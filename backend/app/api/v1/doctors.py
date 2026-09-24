import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.doctor import Doctor
from app.schemas.doctor import DoctorOut, DoctorCreate, DoctorStatusUpdate

router = APIRouter()

@router.get("", response_model=List[DoctorOut])
def get_doctors(
    hospital_id: Optional[str] = Query(None),
    specialty: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Doctor)
    if hospital_id:
        query = query.filter(Doctor.hospital_id == hospital_id)
    if specialty and specialty != "ALL":
        query = query.filter(Doctor.specialty.ilike(f"%{specialty}%"))
    return query.all()

@router.post("", response_model=DoctorOut)
def create_doctor(doc_in: DoctorCreate, db: Session = Depends(get_db)):
    doc_id = doc_in.id or f"doc-{uuid.uuid4().hex[:6]}"
    doc = Doctor(
        id=doc_id,
        hospital_id=doc_in.hospital_id,
        name=doc_in.name,
        specialty=doc_in.specialty,
        specialty_hindi=doc_in.specialty_hindi or doc_in.specialty,
        qualification=doc_in.qualification,
        experience_years=doc_in.experience_years,
        room_no=doc_in.room_no,
        aebas_status=doc_in.aebas_status,
        aebas_check_in_time=doc_in.aebas_check_in_time,
        max_daily_slots=doc_in.max_daily_slots,
        booked_slots=doc_in.booked_slots,
        current_queue_length=doc_in.current_queue_length,
        consultation_fee=doc_in.consultation_fee,
        rating=doc_in.rating
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.patch("/{doctor_id}/status", response_model=DoctorOut)
def update_doctor_status(doctor_id: str, status_data: DoctorStatusUpdate, db: Session = Depends(get_db)):
    doc = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    doc.aebas_status = status_data.aebas_status
    db.commit()
    db.refresh(doc)
    return doc
