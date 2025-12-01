import axios from "axios";

const apiURL = "http://localhost:5000/api"

const api = axios.create({
    baseURL: apiURL,
    headers:{
        'Content-Type': 'application/json'
    }

})

export const procedureService = {

    // get all procedures 
    getAllProcedures:()=>{
        return api.get('/procedures')
    },

    // get all procedures by id
    getProcedureByID:(id)=>{
        return api.get(`/procedures/${id}`)
    },

    // patient procedures

    //list all patient procedures
    getAllPatientProcedures:()=>{
        return api.get(`/patient-procedures`)
    },
    // create a new patient procedure
    createPatientProcedure:(procedureData)=>{
        return api.post(`/patient-procedures`, procedureData)
    },

    // get all patient procedures for a patient id
    getAllPatientProceduresForPatient:(id)=>{
        return api.get(`/patient-procedures/patient/${id}`)
    },

    //get a patient proceure by id
    getPatientProcedureByID:(id)=>{
        return api.get(`/patient-procedures/${id}`)
    },

    // update a patient procedure
    updatePatientProcedure:(id,updateData)=>{
        return api.put(`/patient-procedures/${id}`,updateData)
    },

    // delete patient procedure
    deletePatientProcedure:(id)=>{
        return api.delete(`/patient-procedures/${id}`)
    }


}