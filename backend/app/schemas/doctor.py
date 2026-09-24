from typing import Optional
from pydantic import BaseModel

class DoctorBase(BaseModel):
    hospital_id: str
    name: str
    specialty: str
    specialty_hindi: Optional[str] = None
    qualification: str
    experience_years: int = 10
    room_no: str
    aebas_status: str = "IN_OPD"
    aebas_check_in_time: str = "08:30 AM IST"
    max_daily_slots: int = 45
    booked_slots: int = 20
    current_queue_length: int = 4
    consultation_fee: int = 0
    rating: float = 4.9

class DoctorCreate(DoctorBase):
    id: Optional[str] = None

class DoctorOut(DoctorBase):
    id: str

    class Config:
        from_attributes = True

class DoctorStatusUpdate(BaseModel):
    aebas_status: str
