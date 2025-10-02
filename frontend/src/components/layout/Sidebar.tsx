/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { UsergroupDeleteOutlined,SettingOutlined} from '@ant-design/icons';
import '../../styles/sidebar.css'

function Sidebar () {

  return (
    <>
    <div className='sidebar'>
      <div className='logo' >
        <p>IR</p>
      </div>

      <div className='menu'>
        <p>Menu</p>
        <div className='dashboard-icon'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M21 14H14V21H21V14Z" stroke="#191D23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10 14H3V21H10V14Z" stroke="#191D23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 3H14V10H21V3Z" stroke="#191D23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10 3H3V10H10V3Z" stroke="#191D23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        </div>
        <div className='patient-list-icon'>
          <UsergroupDeleteOutlined style={{fontSize:'24px'}} />
        </div>
        <div className='settings'>
          <SettingOutlined style={{fontSize:'24px'}} />
        </div>
        <div className='line'></div>
        <div className='profile'>
          <p>Profile</p>
        </div>
        <div className='profile-icon'>
          
        </div>
      </div>
    </div>

    </>
  );

};
export default Sidebar;