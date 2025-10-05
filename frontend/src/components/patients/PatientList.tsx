/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */


import { Input } from "antd";
import "../../styles/patients.css"
import DateRangePicker from "../ui/datepicker";
import SearchIcon from "../../assets/icons/search"
import FilterIcon from "../../assets/icons/filter-icon";
function PatientList(){
    return (
        <>

        <div className="patient-list-page">
            <div className="title-div">

                {/* Title Text */}
                <div className="title">
                    <h1>Patients</h1>
                </div>
                {/* search box */}
                <div className="search-container">
                    <div className="search">
                        <Input 
                        placeholder="Search"
                        prefix={<SearchIcon size={12} />}
                        />
                        <DateRangePicker />
                    </div>
                    <div className="filter">
                        <FilterIcon  />
                    </div>
                </div>
            
            </div>

            <div className="patient-body-container">

                {/* id */}
                <div className="id"></div>

                {/* patient-info */}
                <div className="patient-info">
                    <div className="patient-name"></div>
                    <div className="age-gender">
                        <div className="age"></div>
                        <div className="gender"></div>
                    </div>
                </div>
                {/* contact-info */}
                <div className=""></div>
                {/* MRN */}
                <div className="mrn"></div>
                {/* insurance */}
                <div className="insurance"></div>
                {/* created at */}
                <div className="created-at"></div>
                {/* updated at */}
                <div className="updated-at"></div>
            </div>
        </div>
        
        </>
    );
}

export default PatientList;