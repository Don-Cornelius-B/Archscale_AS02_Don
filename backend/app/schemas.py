from pydantic import BaseModel, Field
from typing import Literal, List, Optional

class InboundMessageRequest(BaseModel):
    raw_text: str
    channel: str = Field(default="Email")
    sender: Optional[str] = None

class ActiveBaselineState(BaseModel):
    project_name: str
    active_drawing_revision: str
    active_material_spec: str
    active_hardware_spec: str
    updated_at: Optional[str] = None

class ActionItem(BaseModel):
    task: str
    assigned_role: Literal["Architect", "Contractor", "Supplier", "Client"]
    zone_or_room: Optional[str] = None
    priority: Literal["Low", "Normal", "Urgent"] = "Normal"

class ConflictAlert(BaseModel):
    is_conflict: bool
    severity: Literal["none", "warning", "critical"]
    reason: Optional[str] = None

class ExtractedPayload(BaseModel):
    summary: str
    decisions: List[str]
    actions: List[ActionItem]
    conflict: ConflictAlert

class PresetScenario(BaseModel):
    id: str
    label: str
    channel: str
    sender: str
    raw_text: str
