import json
from app.extensions.database import db
from app.models.procedure import Procedures

JSON_FILE = "app/data/procedures.json" 


def load_initial_procedure_data():
    """Load data only if the procedures table is empty."""
    if Procedures.query.first():   # table not empty
        print("Procedures table already populated.")
        return

    print("Procedures table empty — loading initial data...")

    with open(JSON_FILE, "r") as f:
        data = json.load(f)

    for category, procedures in data.items():
        for item in procedures:
            proc = Procedures(
                procedure_name=item["name"],
                procedure_code=item["procedure_code"],
                specialised_checklist=item.get("specialised_checklist", [])
            )
            db.session.add(proc)

    db.session.commit()
    print("Initial procedures data loaded.")
