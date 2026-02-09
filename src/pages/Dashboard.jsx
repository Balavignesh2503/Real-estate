import React, { useState, useEffect } from 'react';
import { layoutService } from '../services/api';
import { MapPin, Plus, ArrowRight, Grid } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        const { data } = await layoutService.getAll();
        setLayouts(data);
      } catch (error) {
        console.error('Error fetching layouts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLayouts();
  }, []);

  const stats = [
    { label: 'Total Layouts', value: layouts.length, icon: Grid, color: 'bg-blue-500' },
    { label: 'Total Plots', value: '452', icon: MapPin, color: 'bg-green-500' },
    { label: 'Recent Bookings', value: '12', icon: ArrowRight, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Property Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your layouts and plot bookings</p>
        </div>
        <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20">
          <Plus size={20} />
          <span>New Layout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Layouts</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {layouts.map((layout) => (
              <div key={layout._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={layout.imageUrl} 
                    alt={layout.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <Link 
                      to={`/dashboard/layout/${layout._id}`}
                      className="w-full py-2 bg-white text-black text-center rounded-lg font-bold text-sm"
                    >
                      Open Editor
                    </Link>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{layout.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin size={14} className="mr-1" />
                    {layout.location}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-md">
                      124 Plots
                    </span>
                    <Link to={`/dashboard/layout/${layout._id}`} className="text-primary-600 dark:text-primary-400">
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
