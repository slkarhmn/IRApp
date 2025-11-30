import axios from "axios";

const apiURL = "http://localhost:5000/api"

const api = axios.create({
    baseURL: apiURL,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const checklistService = {

    // procedure planning

    // create
    createProcedurePlanning:(planningData)=>{
        return api.post('/checklist/procedure-planning', planningData)
    },
    // list all planning entries
    getAllProcedurePlanning:()=>{
        return api.get('/checklist/procedure-planning')
    },
    // update a procedure planning entry
    updateProcedurePlanning:(id, data)=>{
        return api.put(`/checklist/procedure-planning/${id}`, data)
    },
    // fetch procedure planning entry by id
    getProcedurePlanning:(id)=>{
        return api.get(`/checklist/procedure-planning/${id}`)
    },
    // delete procedure planning entry
    deleteProcedurePlanning:(id)=>{
        return api.delete(`/checklist/procedure-planning/${id}`)
    },
    // getProcedurePlanningByProcedure: (procedureId) => {
    //     return api.get(`/checklist/procedure-planning/procedure/${procedureId}`)
    // },


    // sign in 

    // create new sign in entry
    createSignIn:(signInData)=>{
        return api.post(`/checklist/sign-in/`, signInData)
    },
    // get all sign in entries
    getAllSignIns:()=>{
        return api.get(`/checklist/sign-in/`)
    },
    // update sign in entry
    updateSignIn:(id,data)=>{
        return api.put(`/checklist/sign-in/${id}`,data)
    },
    getSignIn:(id)=>{
        return api.get(`/checklist/sign-in/${id}`)
    },
    // delete sign in entry by id
    deleteSignIn:(id)=>{
        return api.delete(`/checklist/sign-in/${id}`)
    },
    // getSignInByProcedure: (procedureId) => {
    //     return api.get(`/checklist/sign-in/procedure/${procedureId}`)
    // },



    // sign out


    // create new sign out entry
    createSignOut:(signOutData)=>{
        return api.post(`/checklist/sign-out/`, signOutData)
    },
    // get all sign out entries
    getAllSignOuts:()=>{
        return api.get(`/checklist/sign-out/`)
    },
    // update sign in entry
    updateSignOut:(id,data)=>{
        return api.put(`/checklist/sign-out/${id}`,data)
    },
    getSignOut:(id)=>{
        return api.get(`/checklist/sign-out/${id}`)
    },
    // delete sign in entry by id
    deleteSignOut:(id)=>{
        return api.delete(`/checklist/sign-out/${id}`)
    },

    // getSignOutByProcedure: (procedureId) => {
    //     return api.get(`/checklist/sign-out/procedure/${procedureId}`)
    // },

    // get procedure planning by patient procedure ID
    getProcedurePlanningByProcedure: (procedureId) => {
        return api.get(`/checklist/procedure-planning/by-procedure/${procedureId}`)
    },

    // get sign in by patient procedure ID
    getSignInByProcedure: (procedureId) => {
        return api.get(`/checklist/sign-in/by-procedure/${procedureId}`)
    },

    // get sign out by patient procedure ID
    getSignOutByProcedure: (procedureId) => {
        return api.get(`/checklist/sign-out/by-procedure/${procedureId}`)
    },

}