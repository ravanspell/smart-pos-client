'use client'

import Sidebar from './sideBar';
import { ProtectedRoute } from '@/components/utilComponents/ProtectedRoute';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute
      requiredPermissions={['view:general-settings']}
    >
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
    </ProtectedRoute>
  );
};

export default SettingsLayout; 