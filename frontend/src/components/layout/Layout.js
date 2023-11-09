import React, { useState } from 'react';

import { useLocation } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';

import '../../styles/Layout.css';

const Layout = (props) => {
  const location = useLocation();
  const isLoginOrRegisterPage = location.pathname !== '/login' && location.pathname !== '/create-new-account';
  const [openSidebar, setOpenSidebar] = useState(false);
  const handleSidebarClick = (open) => {
    setOpenSidebar(open);
  };
  return (
    <React.Fragment>
      <main className="app-layout flex flex-col">
        {/* <Sidebar className="app-layout__sidebar absolute bg-black w-full mt-16" /> */}
        {/* // {isLoginOrRegisterPage && <Sidebar className="app-layout__sidebar absolute bg-black " />} */}
        {isLoginOrRegisterPage && <Header openState={openSidebar} handleClick={handleSidebarClick} />}
        <div className="flex">
          {isLoginOrRegisterPage && (
            <Sidebar className={`app-layout__sidebar bg-black ${openSidebar ? 'block' : 'hidden'}`} />
          )}
          <div className="app-layout__page">{props.children}</div>
        </div>
      </main>
    </React.Fragment>
  );
};

export default Layout;
