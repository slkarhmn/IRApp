import axios from "axios";

const apiURL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: apiURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const checklistService = {

  // ------------------------
  // Procedure Planning
  // ------------------------

  createProcedurePlanning: (planningData) => {
    // planningData must include patient_procedure_id
    return api.post('/checklist/procedure-planning', planningData);
  },

  getAllProcedurePlanning: () => {
    return api.get('/checklist/procedure-planning');
  },

  updateProcedurePlanning: (id, data) => {
    return api.put(`/checklist/procedure-planning/${id}`, data);
  },

  getProcedurePlanning: (id) => {
    return api.get(`/checklist/procedure-planning/${id}`);
  },

  deleteProcedurePlanning: (id) => {
    return api.delete(`/checklist/procedure-planning/${id}`);
  },

  getProcedurePlanningByProcedure: (patientProcedureId) => {
    return api.get(`/checklist/procedure-planning/by-procedure/${patientProcedureId}`);
  },

  // ------------------------
  // Sign In
  // ------------------------

  createSignIn: (signInData) => {
    // signInData must include patient_procedure_id
    return api.post('/checklist/sign-in/', signInData);
  },

  getAllSignIns: () => {
    return api.get('/checklist/sign-in/');
  },

  updateSignIn: (id, data) => {
    return api.put(`/checklist/sign-in/${id}`, data);
  },

  getSignIn: (id) => {
    return api.get(`/checklist/sign-in/${id}`);
  },

  deleteSignIn: (id) => {
    return api.delete(`/checklist/sign-in/${id}`);
  },

  getSignInByProcedure: (patientProcedureId) => {
    return api.get(`/checklist/sign-in/by-procedure/${patientProcedureId}`);
  },

  // ------------------------
  // Sign Out
  // ------------------------

  createSignOut: (signOutData) => {
    // signOutData must include patient_procedure_id
    return api.post('/checklist/sign-out/', signOutData);
  },

  getAllSignOuts: () => {
    return api.get('/checklist/sign-out/');
  },

  updateSignOut: (id, data) => {
    return api.put(`/checklist/sign-out/${id}`, data);
  },

  getSignOut: (id) => {
    return api.get(`/checklist/sign-out/${id}`);
  },

  deleteSignOut: (id) => {
    return api.delete(`/checklist/sign-out/${id}`);
  },

  getSignOutByProcedure: (patientProcedureId) => {
    return api.get(`/checklist/sign-out/by-procedure/${patientProcedureId}`);
  }

};
