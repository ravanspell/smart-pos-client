'use client'
import React, { ReactNode } from 'react';
import Sidebar from './sideBar';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-wrap">
      {/* Sidebar */}
      <div className="w-full lg:w-3/12 p-4 border-r">
        <Sidebar />
      </div>

      {/* Content */}
      <div className="w-full lg:w-9/12 p-6">
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;