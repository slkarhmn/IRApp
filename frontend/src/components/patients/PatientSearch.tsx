/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */


import { Input } from "antd";
import "../../styles/patients.css"
import DateRangePicker from "../ui/datepicker";
import SearchIcon from "../../assets/icons/search"
import FilterIcon from "../../assets/icons/filter-icon";

function PatientSearch(){
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
        </div>
        
        </>
    );
}

export default PatientSearch;