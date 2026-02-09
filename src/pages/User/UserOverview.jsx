import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/api';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

const UserOverview = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await bookingService.getMyBookings();
        setBookings(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const pending = bookings.filter((b) => b.status === 'pending').length;

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Confirmed', value: confirmed, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Pending', value: pending, icon: Clock, color: 'bg-yellow-500' },
  ];

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
    </div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Track your plot bookings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
                <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{s.value}</p>
              </div>
              <div className={`${s.color} p-3 rounded-xl text-white`}>
                <s.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <h2 className="font-bold text-lg mb-4">Recent Bookings</h2>
        <div className="space-y-3">
          {bookings.slice(0, 8).map((b) => (
            <div key={b._id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
              <div className="min-w-0">
                <div className="font-semibold truncate">Plot #{b.plotId?.plotNumber || '-'}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{new Date(b.createdAt).toLocaleString()}</div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${b.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : b.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                {b.status}
              </span>
            </div>
          ))}
          {bookings.length === 0 && <div className="text-sm text-gray-500">No bookings found.</div>}
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
