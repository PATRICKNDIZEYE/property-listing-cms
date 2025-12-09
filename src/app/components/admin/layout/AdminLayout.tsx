'use client';

import { useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import Breadcrumb from './Breadcrumb';

interface AdminLayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
}

export default function AdminLayout({ children, showBreadcrumb = true }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-darkmode">
      {/* Sidebar */}
      <AdminSidebar collapsed={sidebarCollapsed} />
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <AdminHeader 
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
        
        {/* Page Content */}
        <main className="p-6 max-w-[1600px] mx-auto">
          {showBreadcrumb && <Breadcrumb />}
          {children}
        </main>
      </div>
    </div>
  );
}