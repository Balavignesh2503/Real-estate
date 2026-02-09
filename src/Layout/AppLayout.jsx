import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Map, Calendar, User } from 'lucide-react';

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Map, label: 'My Layouts', path: '/dashboard/layouts' },
    { icon: Calendar, label: 'Bookings', path: '/dashboard/bookings' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} menuItems={menuItems} onLogout={logout} />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
