import axios from "axios";

const apiURL = "http://localhost:5000/api"

const api = axios.create({
    baseURL: apiURL,
    headers:{
        'Content-Type': 'application/json'
    }

})

export const patientService = {

    // get all patients
    getAllPatients:()=>{
        return api.get('/patients')
    },
    // get single patient by id
    getPatient:(id)=>{
        return api.get(`/patients/${id}`)
    },

    // create a new patient
    createPatient:(patientData)=>{
        return api.post('/patients', patientData)
    },

    // update patient PUT
    updatePatient:(id,patientData)=>{
        return api.put(`/patients/${id}`, patientData)
    },

    // delete patient
    deletePatient:(id)=>{
        return api.delete(`/patients/${id}`)
    },

    // get patient vitals
    getPatientVitals:(id)=>{
        return api.get(`/patients/${id}/vitals`)
    },

    // update patient vitals

    updatePatientVitals:(id, vitalsData)=>{
        return api.post(`/patients/${id}/vitals`, vitalsData)
    },

    // get patients labs
    getPatientLabs:(id)=>{
        return api.get(`/patients/${id}/labs`)
    },

    // update patient lab values
    updatePatientLabs:(id, labData)=>{
        return api.post(`/patients/${id}/labs`, labData)
    },

    

}