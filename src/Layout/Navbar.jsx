import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { Menu, User, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
      <div className="h-full flex items-center justify-between px-4 lg:px-8">
        <button 
          onClick={toggleSidebar}
          className="p-2 lg:hidden text-gray-600 dark:text-gray-400"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center space-x-4 ml-auto">
          <ThemeToggle />
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Bell size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
              {userInfo?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{userInfo?.name || 'User'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{userInfo?.role}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
