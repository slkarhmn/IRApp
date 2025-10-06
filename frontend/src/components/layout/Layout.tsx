/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import '../../styles/sidebar.css'
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../../styles/layout.css"
import PatientSearch from '../patients/PatientSearch';

function Layout(){
    return (
        <div className="layout">
            <Sidebar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout