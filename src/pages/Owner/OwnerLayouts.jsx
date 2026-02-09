import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { layoutService } from '../../services/api';
import { Plus, MapPin, ArrowRight } from 'lucide-react';

const OwnerLayouts = () => {
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await layoutService.getMine();
        setLayouts(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Layouts</h1>
          <p className="text-gray-500 dark:text-gray-400">Create and manage your property layouts</p>
        </div>
        <Link to="/owner/layouts/new" className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20">
          <Plus size={20} />
          <span>New Layout</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {layouts.map((layout) => (
            <div key={layout._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img src={layout.imageUrl} alt={layout.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <Link to={`/owner/layout/${layout._id}/editor`} className="w-full py-2 bg-white text-black text-center rounded-lg font-bold text-sm">Open Editor</Link>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{layout.title}</h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <MapPin size={14} className="mr-1" />
                  {layout.location}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-md">Interactive Map</span>
                  <Link to={`/owner/layout/${layout._id}/editor`} className="text-primary-600 dark:text-primary-400"><ArrowRight size={20} /></Link>
                </div>
              </div>
            </div>
          ))}
          {layouts.length === 0 && (
            <div className="col-span-full text-sm text-gray-500 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
              No layouts found. Create your first layout.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerLayouts;
