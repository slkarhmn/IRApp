import { Input } from "antd";
import "../../styles/patients.css"
import DateRangePicker from "../ui/datepicker";
import SearchIcon from "../../assets/icons/search"
import FilterIcon from "../../assets/icons/filter-icon";
import { Link } from "react-router-dom";

function PatientSearch(){
    return (
        <>

        <div className="patient-list-page">
            <div className="title-div">

                {/* Title Text */}
                <div className="title" style={{display:"flex", flexDirection:"row", gap:800,}}>
                    <h1>Patients</h1>

                    <Link to={"addpatient"} style={{textDecoration:'none', color:'white'}}>
                        <div style={{marginTop:50,backgroundColor:"#8E9C78", width:160,height:45,padding:10,fontFamily:"DM sans", borderRadius:5, justifyContent:"center", alignContent:"center", textAlign:"center"}}>
                            <span style={{textDecoration:'none'}}>Add Patient</span> 
                        </div>
                    </Link>
                    
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