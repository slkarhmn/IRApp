/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { UsergroupDeleteOutlined,SettingOutlined} from '@ant-design/icons';
import '../../styles/sidebar.css'
import { NavLink } from 'react-router-dom';

function Sidebar () {

  return (
    <>
    <aside className='sidebar'>
      <div className='logo' >
        <p>IR</p>
      </div>

      <nav className='sidebar-nav'>

        <NavLink to='/patients' className={({isActive}) => isActive ? 'nav-link-active': 'nav-link'}></NavLink>
      </nav>

      <div className='menu'>
        <p>Menu</p>

        {/* Dashboard */}

        <NavLink to = '/dashboard' className={({ isActive }) => isActive ? 'dashboard-icon active' : 'dashboard-icon'} >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 14H14V21H21V14Z" stroke="#191D23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 14H3V21H10V14Z" stroke="#191D23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 3H14V10H21V3Z" stroke="#191D23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 3H3V10H10V3Z" stroke="#191D23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </NavLink>

        {/* Patients */}

        <NavLink to='/patients' className={({isActive})=> isActive? 'patient-list-icon active': 'patient-list-icon'}>
          <UsergroupDeleteOutlined style={{fontSize:'24px'}} />
        </NavLink>

        {/* Settings */}
        <div className='settings'>
          <SettingOutlined style={{fontSize:'24px'}} />
        </div>

        {/* Profile */}
        <div className='line'></div>
        <div className='profile'>
          <p>Profile</p>
        </div>
        <div className='profile-icon'>

        </div>
      </div>
    </aside>

    </>
  );

};
export default Sidebar;