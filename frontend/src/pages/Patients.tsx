
import { PatientTable } from "../components/patients/PatientList"
import PatientSearch from "../components/patients/PatientSearch";

export default function PatientPage(){
    return (
        <>
            <PatientSearch />
            <PatientTable />
        </>
    );
}

