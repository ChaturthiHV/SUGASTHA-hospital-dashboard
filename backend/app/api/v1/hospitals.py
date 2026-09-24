import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.hospital import Hospital
from app.schemas.hospital import HospitalOut, BedUpdate

router = APIRouter()

def serialize_hospital(h: Hospital) -> dict:
    return {
        "id": h.id,
        "name": h.name,
        "name_hindi": h.name_hindi,
        "hospital_type": h.hospital_type,
        "district": h.district,
        "state": h.state,
        "address": h.address,
        "distance_km": h.distance_km,
        "travel_cost_inr": h.travel_cost_inr,
        "emergency_available": h.emergency_available,
        "icu_beds_available": h.icu_beds_available,
        "total_beds": h.total_beds,
        "oxygen_beds_available": h.oxygen_beds_available,
        "opd_capacity": h.opd_capacity,
        "opd_active_queue": h.opd_active_queue,
        "departments": json.loads(h.departments) if h.departments else [],
        "doctor_ids": json.loads(h.doctor_ids) if h.doctor_ids else [],
        "rating": h.rating,
        "phone": h.phone
    }

@router.get("", response_model=List[HospitalOut])
def get_hospitals(db: Session = Depends(get_db)):
    hospitals = db.query(Hospital).all()
    return [serialize_hospital(h) for h in hospitals]

@router.get("/{hospital_id}", response_model=HospitalOut)
def get_hospital(hospital_id: str, db: Session = Depends(get_db)):
    h = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return serialize_hospital(h)

@router.patch("/{hospital_id}/beds", response_model=HospitalOut)
def update_hospital_beds(hospital_id: str, bed_data: BedUpdate, db: Session = Depends(get_db)):
    h = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")
    
    if bed_data.total_beds is not None:
        h.total_beds = bed_data.total_beds
    if bed_data.icu_beds_available is not None:
        h.icu_beds_available = bed_data.icu_beds_available
    if bed_data.oxygen_beds_available is not None:
        h.oxygen_beds_available = bed_data.oxygen_beds_available

    db.commit()
    db.refresh(h)
    return serialize_hospital(h)
