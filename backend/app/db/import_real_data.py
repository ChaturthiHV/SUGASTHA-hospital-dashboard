"""
Import hospitals + doctors from a JSON file into the database.

Usage (Render Shell, from the backend root):
    python -m app.db.import_real_data app/db/real_hospitals.json
    python -m app.db.import_real_data app/db/real_hospitals.json --force

Idempotent: re-running updates existing rows (matched by id) instead of
duplicating them. Hospitals without valid latitude/longitude are rejected,
since /hospitals/nearby-govt skips them anyway.

Files whose "_comment" says the data is FICTIONAL are refused unless --force.
"""
import json
import sys

from app.db.database import SessionLocal, engine
from app.db.base import Base
import app.models  # noqa: F401  (register all models)
from app.models.hospital import Hospital
from app.models.doctor import Doctor

# hospital_type must contain one of these words to be treated as government
# by /hospitals/nearby-govt: govt, government, aiims, district hospital,
# civil hospital, phc, chc, sub-district, state hospital, municipal, esic
HOSPITAL_REQUIRED = ["id", "name", "hospital_type", "district", "state", "address", "latitude", "longitude"]
DOCTOR_REQUIRED = ["id", "name", "specialty", "qualification", "room_no"]


def _check(obj, required, label):
    missing = [k for k in required if obj.get(k) in (None, "")]
    if missing:
        raise ValueError(f"{label} '{obj.get('name', obj.get('id'))}' missing fields: {missing}")
    if any("REPLACE" in str(obj.get(k, "")).upper() for k in required):
        raise ValueError(f"{label} '{obj.get('id')}' still contains placeholder values")


def _check_coords(h):
    try:
        lat, lng = float(h["latitude"]), float(h["longitude"])
    except (TypeError, ValueError):
        raise ValueError(f"Hospital '{h['id']}' has non-numeric coordinates")
    if not (-90 <= lat <= 90 and -180 <= lng <= 180):
        raise ValueError(f"Hospital '{h['id']}' has out-of-range coordinates: {lat}, {lng}")
    h["latitude"], h["longitude"] = lat, lng


def _clean(model, data, label):
    """Keep only keys that are real columns on the model; normalise 'N/A'."""
    cols = set(model.__table__.columns.keys())
    skipped = sorted(k for k in data if k not in cols)
    if skipped:
        print(f"  (note: {label} '{data.get('id')}' skipping unknown fields: {skipped})")
    out = {k: v for k, v in data.items() if k in cols}
    for k, v in out.items():
        if isinstance(v, str) and v.strip().upper() == "N/A":
            out[k] = None
    return out


def _upsert(db, model, data):
    row = db.query(model).filter(model.id == data["id"]).first()
    if row:
        for k, v in data.items():
            setattr(row, k, v)
        return "updated"
    db.add(model(**data))
    return "added"


def main(path, force=False):
    with open(path, encoding="utf-8") as f:
        payload = json.load(f)

    comment = str(payload.get("_comment", ""))
    if "FICTIONAL" in comment.upper() and not force:
        sys.exit(
            "Refusing to import: the file says some data is FICTIONAL:\n"
            f"  {comment}\n"
            "Replace it with verified data, or re-run with --force if this is a test database."
        )

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for raw in payload.get("hospitals", []):
            h = dict(raw)                      # don't mutate the loaded JSON
            doctors = [dict(d) for d in h.pop("doctors", [])]
            _check(h, HOSPITAL_REQUIRED, "Hospital")
            _check_coords(h)
            h["departments"] = json.dumps(h.get("departments", []))
            h["doctor_ids"] = json.dumps([d["id"] for d in doctors])
            h = _clean(Hospital, h, "Hospital")
            print(f"Hospital {h['name']}: {_upsert(db, Hospital, h)}")
            db.flush()
            for d in doctors:
                _check(d, DOCTOR_REQUIRED, "Doctor")
                d["hospital_id"] = h["id"]
                d = _clean(Doctor, d, "Doctor")
                print(f"  Doctor {d['name']}: {_upsert(db, Doctor, d)}")
        db.commit()
        print("Done.")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--force"]
    if len(args) != 1:
        sys.exit("usage: python -m app.db.import_real_data <file.json> [--force]")
    main(args[0], force="--force" in sys.argv)