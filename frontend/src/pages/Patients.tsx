
import patientDataList from "../components/patients/patientDataList.json"
import { PatientTable, type PatientDetail } from "../components/patients/PatientTable"
import PatientSearch from "../components/patients/PatientSearch";

export default function PatientPage(){
    const patients = patientDataList as PatientDetail[];
    return (
        <>
            <PatientSearch />
            <PatientTable data={patients} />
        </>
    );
}

