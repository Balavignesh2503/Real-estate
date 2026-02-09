import React from 'react';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { userInfo } = useAuth();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">Your account details</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-4">
        <div>
          <div className="text-xs text-gray-500">Name</div>
          <div className="font-semibold">{userInfo?.name || '-'}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Email</div>
          <div className="font-semibold">{userInfo?.email || '-'}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Role</div>
          <div className="font-semibold">{userInfo?.role || '-'}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
