import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/api';

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await bookingService.getOwnerBookings();
      setBookings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await bookingService.updateStatus(id, { status });
      await load();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update');
    }
  };

  if (loading) return <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
        <p className="text-gray-500 dark:text-gray-400">Confirm or cancel plot booking requests</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/60">
              <tr className="text-left text-gray-600 dark:text-gray-300">
                <th className="px-5 py-3 font-semibold">Plot</th>
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-5 py-4 font-semibold">#{b.plotId?.plotNumber || '-'}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium">{b.userId?.name || b.name || 'User'}</div>
                    <div className="text-xs text-gray-500">{b.userId?.email || b.email || ''}</div>
                    <div className="text-xs text-gray-500">{b.userId?.mobile || b.mobile || ''}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      b.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      b.status === 'sold' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                      b.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {b.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(b._id, 'confirmed')} className="px-3 py-1.5 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700">Confirm</button>
                          <button onClick={() => updateStatus(b._id, 'cancelled')} className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700">Cancel</button>
                        </>
                      )}
                      {b.status === 'confirmed' && (
                        <>
                          <button onClick={() => updateStatus(b._id, 'sold')} className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700">Mark as Sold</button>
                          <button onClick={() => updateStatus(b._id, 'cancelled')} className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700">Cancel</button>
                        </>
                      )}
                      {b.status === 'sold' && (
                        <span className="text-xs text-gray-400">Sold</span>
                      )}
                      {b.status === 'cancelled' && (
                        <span className="text-xs text-gray-400">Cancelled</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td className="px-5 py-10 text-center text-gray-500" colSpan={4}>No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerBookings;
