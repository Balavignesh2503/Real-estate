import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, LayoutDashboard, Calendar, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { userInfo } = useAuth();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const dashboardPath = userInfo
    ? (userInfo.role === 'REAL_ESTATE_OWNER' || userInfo.role === 'ADMIN' ? '/owner' : '/user')
    : '/login';

  const bookingsPath = userInfo
    ? (userInfo.role === 'REAL_ESTATE_OWNER' || userInfo.role === 'ADMIN' ? '/owner/bookings' : '/user/bookings')
    : '/login';

  const profilePath = userInfo
    ? (userInfo.role === 'REAL_ESTATE_OWNER' || userInfo.role === 'ADMIN' ? '/owner/profile' : '/user/profile')
    : '/login';

  const items = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Search', to: '/properties', icon: Search },
    { label: 'Dashboard', to: dashboardPath, icon: LayoutDashboard },
    { label: 'Bookings', to: bookingsPath, icon: Calendar },
    { label: 'Profile', to: profilePath, icon: User },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-screen-sm">
        <div className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-5 px-2 py-2">
            {items.map((item) => {
              const active = isActive(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex flex-col items-center justify-center gap-1 rounded-2xl py-2 transition-colors ${
                    active
                      ? 'text-primary-600'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Icon size={20} className={active ? 'text-primary-600' : ''} />
                  <span className={`text-[10px] font-extrabold ${active ? 'text-primary-600' : ''}`}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNav;
