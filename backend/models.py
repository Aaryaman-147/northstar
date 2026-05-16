from sqlalchemy import Column, String, Numeric, Boolean, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    role = Column(String(50), nullable=False)
    department_id = Column(String(100))
    manager_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

class Goal(Base):
    __tablename__ = "goals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String(255), nullable=False)
    uom_type = Column(String(50), nullable=False)
    target = Column(Numeric, nullable=False)
    weightage = Column(Numeric, nullable=False)
    status = Column(String(50), default="Submitted")
    locked = Column(Boolean, default=False)
    # --- NEW COLUMNS FOR SHARED GOALS ---
    is_shared = Column(Boolean, default=False)
    shared_goal_id = Column(UUID(as_uuid=True), nullable=True)
    # ------------------------------------
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    thrust_area = Column(String(100), default="General")

class GoalUpdateLog(Base):
    __tablename__ = "goal_updates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    goal_id = Column(UUID(as_uuid=True), ForeignKey("goals.id"))
    quarter = Column(String(10), nullable=False)
    actual_value = Column(Numeric, nullable=False)
    progress_status = Column(String(50), nullable=False)
    progress_score = Column(Numeric, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    manager_comment = Column(String, nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    action = Column(String(255), nullable=False)
    old_value = Column(String, nullable=True)
    new_value = Column(String, nullable=True)
    performed_by = Column(String(255), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())