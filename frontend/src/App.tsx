import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import PatientPage from './pages/Patients'
import PatientDetailShow from './components/patients/PatientDetail'
import AddPatient from './pages/addPatientPage'
import ViewIndividualProcedure from './pages/individualProcedure'
import ViewAllProceduresPage from './pages/Procedures'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout />}>
      {/* sets the default path to the patient list */}
        <Route index element={<Navigate to="/patients" replace />}></Route>
        <Route path='patients' element={<PatientPage />}></Route>
        <Route path='patients/:id' element={<PatientDetailShow />}></Route>
        <Route path='patients/addpatient' element={<AddPatient />}></Route>
        <Route path='patients/:id/view-procedure' element={<ViewIndividualProcedure />}></Route>
        <Route path='patients/:id/view-all-procedures' element={<ViewAllProceduresPage />}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
