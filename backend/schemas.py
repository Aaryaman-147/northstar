from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID

class GoalCreate(BaseModel):
    title: str
    thrust_area: str  # <--- IT BELONGS HERE! Every individual goal gets one.
    uom_type: str
    target: float
    weightage: float

class GoalSheetSubmit(BaseModel):
    goals: List[GoalCreate]

class GoalUpdate(BaseModel):
    target: Optional[float] = None
    weightage: Optional[float] = None
    status: Optional[str] = None
    locked: Optional[bool] = None

class CheckInSubmit(BaseModel):
    quarter: str
    actual_value: float
    progress_status: str

class SharedGoalSubmit(BaseModel):
    title: str
    uom_type: str
    target: float
    # Note: No weightage here! The employee decides that later.
    thrust_area: str