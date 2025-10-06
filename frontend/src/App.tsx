/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import './App.css'
import Sidebar from './components/layout/Sidebar'

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import PatientSearch from './components/patients/PatientSearch'
import PatientPage from './pages/Patients'


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout />}>
      {/* sets the default path to the patient list */}
        <Route index element={<Navigate to="/patients" replace />}></Route>
        <Route path='patients' element={<PatientPage />}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
