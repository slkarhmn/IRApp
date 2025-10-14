/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import "../../styles/patientDetail.css"
import type { PatientTable } from './PatientTable';
import patientData from "./patientDataList.json"
import { useParams } from 'react-router-dom';


const PatientDetailShow = () => {

  // find patient
  const { id }  = useParams(); // get id from url
  const patient = patientData.find(p=>p.id === Number(id))

  if(!patient){
    return 0; // load the 404 component here
  }

  return (
    <div className='patientdetail-page'>
      <div className='patients-back'>
        <div className='icon-wrapper'>
          <FaArrowLeftLong color='black' size={25} />
        </div>
        <div className='patients-title-pdp'>Patients</div>
      </div>

      {/* box of procedures and checklist and patient detail */}
      <div className='pdp-wrapper'>
        <div className='patient-info-pdp'>
          <div className='patient-name-individual-pdp'>{patient.fullName}</div>
          <div className='row-pdp'>
            <div className='col-pdp'>

            </div>
            <div className='col-pdp'>
              
            </div>
          </div>
          
        </div>

        {/* procedures and checklists */}
        <div className='procedures-checklists-compressed'>

        </div>
      </div>
    </div>
  )
}

export default PatientDetailShow
