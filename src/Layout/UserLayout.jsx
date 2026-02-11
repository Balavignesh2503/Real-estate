import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, User, Search } from 'lucide-react';
import MobileBottomNav from '../components/MobileBottomNav';

const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/user' },
    { icon: Search, label: 'Properties', path: '/properties' },
    { icon: Calendar, label: 'My Bookings', path: '/user/bookings' },
    { icon: User, label: 'Profile', path: '/user/profile' },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} menuItems={menuItems} onLogout={logout} />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-4 lg:p-8 pb-24 sm:pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
};

export default UserLayout;
