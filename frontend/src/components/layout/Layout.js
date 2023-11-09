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
        {isLoginOrRegisterPage && <Header openState={openSidebar} handleClick={handleSidebarClick} />}
        <div className="flex">
          {isLoginOrRegisterPage && (
            <Sidebar
              openState={openSidebar}
              handleClick={handleSidebarClick}
              className={`app-layout__sidebar transition-all duration-200 absolute bg-black ${
                openSidebar ? 'block left-0' : 'hidden left-[-500px]'
              }`}
            />
          )}
          <div className="app-layout__page">{props.children}</div>
        </div>
      </main>
    </React.Fragment>
  );
};

export default Layout;
