from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, engine, Base
from schemas import GoalSheetSubmit
import models
from schemas import GoalUpdate
from schemas import CheckInSubmit
import math
from schemas import SharedGoalSubmit
import uuid
from pydantic import BaseModel

app = FastAPI()

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # The "*" allows your live Vercel app to connect!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/goals/submit")
def submit_goal_sheet(payload: GoalSheetSubmit, db: Session = Depends(get_db)):
    # 1. Validate total weightage is exactly 100%
    total_weightage = sum(goal.weightage for goal in payload.goals)
    if total_weightage != 100:
        raise HTTPException(status_code=400, detail="Total weightage must equal exactly 100%.")

    if len(payload.goals) > 8:
        raise HTTPException(status_code=400, detail="Maximum of 8 goals allowed.")

    # 2. Fetch the test user we created in Supabase
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="No users found in database.")

    # 3. Save to database using that user's UUID
    db_goals = []
    for goal_data in payload.goals:
        new_goal = models.Goal(
            employee_id=user.id,  # Dynamically use the test user's ID
            title=goal_data.title,
            thrust_area=goal_data.thrust_area, # <--- NEW
            uom_type=goal_data.uom_type,
            target=goal_data.target,
            weightage=goal_data.weightage,
            status="Submitted"
        )
        db.add(new_goal)
        db_goals.append(new_goal)
    
    db.commit()
    return {"message": "Goal sheet submitted successfully", "goals_saved": len(db_goals)}

@app.get("/api/goals")
def get_employee_goals(db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == 'employee@northstar.com').first()
    if not user:
        raise HTTPException(status_code=404, detail="Test employee not found.")

    goals = db.query(models.Goal).filter(models.Goal.employee_id == user.id).all()
    
    # Attach the latest progress score to each goal
    goals_data = []
    for goal in goals:
        # Fetch the most recent check-in for this specific goal
        latest_update = db.query(models.GoalUpdateLog).filter(
            models.GoalUpdateLog.goal_id == goal.id
        ).order_by(models.GoalUpdateLog.created_at.desc()).first()
        
        score = float(latest_update.progress_score) if latest_update else 0.0
        
        goals_data.append({
            "id": str(goal.id),
            "title": goal.title,
            "uom_type": goal.uom_type,
            "target": float(goal.target),
            "weightage": float(goal.weightage),
            "status": goal.status,
            "locked": goal.locked,
            "current_score": score # <-- New field!
        })
    
    return {
        "employee_name": user.name,
        "role": user.role,
        "goals": goals_data
    }

@app.get("/api/manager/team-goals")
def get_team_goals(db: Session = Depends(get_db)):
    # Join Goals and Users to get the employee name alongside their goals
    results = db.query(models.Goal, models.User.name).join(
        models.User, models.Goal.employee_id == models.User.id
    ).all()
    
    formatted_goals = []
    for goal, employee_name in results:
        formatted_goals.append({
            "id": str(goal.id),
            "employee_name": employee_name,
            "title": goal.title,
            "uom_type": goal.uom_type,
            "target": float(goal.target),
            "weightage": float(goal.weightage),
            "status": goal.status,
            "locked": goal.locked
        })
    return formatted_goals

@app.put("/api/goals/{goal_id}")
def update_goal(goal_id: str, payload: GoalUpdate, db: Session = Depends(get_db)):
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    # We will hardcode "Manager" here for the hackathon demo, 
    # but in reality this comes from the logged-in user's token
    current_user = "Manager (Demo)"

    # Track changes for the audit log
    if payload.target is not None and goal.target != payload.target:
        db.add(models.AuditLog(entity_type="Goal", entity_id=goal.id, action="Updated Target", old_value=str(goal.target), new_value=str(payload.target), performed_by=current_user))
        goal.target = payload.target

    if payload.weightage is not None and goal.weightage != payload.weightage:
        db.add(models.AuditLog(entity_type="Goal", entity_id=goal.id, action="Updated Weightage", old_value=str(goal.weightage), new_value=str(payload.weightage), performed_by=current_user))
        goal.weightage = payload.weightage

    if payload.status is not None and goal.status != payload.status:
        db.add(models.AuditLog(entity_type="Goal", entity_id=goal.id, action="Changed Status", old_value=goal.status, new_value=payload.status, performed_by=current_user))
        goal.status = payload.status

    if payload.locked is not None: 
        goal.locked = payload.locked
    
    db.commit()
    return {"message": "Goal updated successfully"}


@app.get("/api/admin/audit-logs")
def get_audit_logs(db: Session = Depends(get_db)):
    # Fetch all logs, newest first
    logs = db.query(models.AuditLog).order_by(models.AuditLog.timestamp.desc()).all()
    return [
        {
            "id": str(log.id),
            "action": log.action,
            "old_value": log.old_value,
            "new_value": log.new_value,
            "performed_by": log.performed_by,
            # Format timestamp nicely
            "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S") if log.timestamp else ""
        }
        for log in logs
    ]

@app.post("/api/goals/{goal_id}/check-in")
def submit_check_in(goal_id: str, payload: CheckInSubmit, db: Session = Depends(get_db)):
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    # PRD 4.5: Progress Score Computation
    score = 0
    target = float(goal.target)
    actual = payload.actual_value

    if goal.uom_type == "Min": # Higher is better (e.g., Revenue)
        score = (actual / target) * 100 if target != 0 else 0
    elif goal.uom_type == "Max": # Lower is better (e.g., Bugs)
        score = (target / actual) * 100 if actual != 0 else 100 
    elif goal.uom_type == "Zero-based":
        score = 100 if actual == 0 else 0
    
    # Cap score at 100%
    score = min(score, 100)

    new_update = models.GoalUpdateLog(
        goal_id=goal.id,
        quarter=payload.quarter,
        actual_value=actual,
        progress_status=payload.progress_status,
        progress_score=score
    )
    
    db.add(new_update)
    db.commit()
    
    return {"message": "Check-in saved!", "progress_score": score}



@app.post("/api/manager/push-shared-goal")
def push_shared_goal(payload: SharedGoalSubmit, db: Session = Depends(get_db)):
    # 1. Generate a master ID for this shared goal
    master_shared_id = uuid.uuid4()
    
    # 2. Get all employees (For hackathon demo, we just grab all users with role 'Employee')
    employees = db.query(models.User).filter(models.User.role == 'Employee').all()
    
    if not employees:
        raise HTTPException(status_code=404, detail="No employees found to push goals to.")

    # 3. Push this goal to every employee's sheet
    db_goals = []
    current_user = "Manager (Demo)" # For Audit Log

    for emp in employees:
        new_goal = models.Goal(
            employee_id=emp.id,
            title=f"🏢 {payload.title}", # Add a nice building icon so employees know it's a company goal
            thrust_area=payload.thrust_area, # <--- NEW
            uom_type=payload.uom_type,
            target=payload.target,
            weightage=0, # Employee must set this later
            status="Draft",
            is_shared=True,
            shared_goal_id=master_shared_id
        )
        db.add(new_goal)
        db_goals.append(new_goal)
        
    db.commit()
    
    # 4. Log the action
    db.add(models.AuditLog(
        entity_type="Shared Goal", 
        entity_id=master_shared_id, 
        action="Pushed Department KPI", 
        old_value="None", 
        new_value=payload.title, 
        performed_by=current_user
    ))
    db.commit()

    return {"message": f"Successfully pushed to {len(db_goals)} employees."}

from pydantic import BaseModel
import time
import random

class AIRequest(BaseModel):
    role: str
    focus_area: str = "General"

@app.post("/api/ai/suggest-goals")
def suggest_smart_goals(payload: AIRequest):
    # Simulate LLM thinking time for the demo
    time.sleep(1.5)
    
    # Pre-trained "AI" responses based on role
    role = payload.role.lower()
    
    if "engineer" in role or "developer" in role:
        suggestions = [
            {"title": "Reduce Average API Latency", "uom_type": "Max", "target": 200},
            {"title": "Ship Q2 Core Features", "uom_type": "Zero-based", "target": 100},
        ]
    elif "sales" in role:
        suggestions = [
            {"title": "Close New Enterprise Deals", "uom_type": "Min", "target": 500000},
            {"title": "Increase Outbound Calls", "uom_type": "Min", "target": 150},
        ]
    else:
        # Default generic goals
        suggestions = [
            {"title": "Complete Q2 Training Modules", "uom_type": "Min", "target": 3},
            {"title": "Reduce Operational Costs", "uom_type": "Max", "target": 10000},
        ]
        
    return {"suggestions": suggestions}

@app.post("/api/admin/run-escalations")
def run_escalation_engine(db: Session = Depends(get_db)):
    # 1. Find all goals that are still in "Draft" status (Rule-based condition)
    overdue_goals = db.query(models.Goal).filter(models.Goal.status == "Draft").all()
    
    escalation_count = 0
    for goal in overdue_goals:
        goal.status = "Escalated (Overdue)"
        
        # 2. Automatically log the escalation in the Audit Trail
        db.add(models.AuditLog(
            entity_type="Goal Escalation",
            entity_id=goal.id,
            action="Auto-Escalation Rule Triggered",
            old_value="Draft",
            new_value="Escalated (Overdue)",
            performed_by="System Alert Bot"
        ))
        escalation_count += 1
        
    db.commit()
    return {"message": "Escalation engine complete", "count": escalation_count}



class CommentSubmit(BaseModel):
    comment: str

@app.post("/api/goals/{goal_id}/comment")
def add_manager_comment(goal_id: str, payload: CommentSubmit, db: Session = Depends(get_db)):
    # Find the latest check-in for this goal
    latest_update = db.query(models.GoalUpdateLog).filter(
        models.GoalUpdateLog.goal_id == goal_id
    ).order_by(models.GoalUpdateLog.created_at.desc()).first()
    
    if not latest_update:
        raise HTTPException(status_code=400, detail="Employee hasn't checked in yet.")
        
    latest_update.manager_comment = payload.comment
    db.commit()
    
    return {"message": "Feedback saved successfully!"}