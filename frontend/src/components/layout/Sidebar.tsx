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