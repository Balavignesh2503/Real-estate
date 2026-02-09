import React, { useEffect, useState } from 'react';
import { layoutService, bookingService } from '../../services/api';
import { Grid, Calendar, MapPin } from 'lucide-react';

const OwnerOverview = () => {
  const [layouts, setLayouts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [l, b] = await Promise.all([
          layoutService.getMine(),
          bookingService.getOwnerBookings(),
        ]);
        setLayouts(l.data);
        setBookings(b.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = [
    { label: 'Total Layouts', value: layouts.length, icon: Grid, color: 'bg-blue-500' },
    { label: 'Incoming Bookings', value: bookings.length, icon: Calendar, color: 'bg-purple-500' },
    { label: 'Locations', value: new Set(layouts.map(x => x.location).filter(Boolean)).size, icon: MapPin, color: 'bg-green-500' },
  ];

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
    </div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Owner Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage layouts, plots and bookings</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="font-bold text-lg mb-4">Recent Layouts</h2>
          <div className="space-y-3">
            {layouts.slice(0, 5).map((l) => (
              <div key={l._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                <img src={l.imageUrl} alt={l.title} className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0">
                  <div className="font-semibold truncate">{l.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{l.location}</div>
                </div>
              </div>
            ))}
            {layouts.length === 0 && <div className="text-sm text-gray-500">No layouts yet.</div>}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="font-bold text-lg mb-4">Latest Bookings</h2>
          <div className="space-y-3">
            {bookings.slice(0, 5).map((b) => (
              <div key={b._id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                <div className="min-w-0">
                  <div className="font-semibold truncate">Plot #{b.plotId?.plotNumber || '-'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{b.userId?.name || b.name || 'User'}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${b.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : b.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                  {b.status}
                </span>
              </div>
            ))}
            {bookings.length === 0 && <div className="text-sm text-gray-500">No bookings yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerOverview;
