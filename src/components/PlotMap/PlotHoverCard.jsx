import React from 'react';
import { MapPin, IndianRupee, Ruler, Compass } from 'lucide-react';

const PlotHoverCard = ({ plot, position }) => {
  if (!plot) return null;

  const statusColor = {
    available: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    booked: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    sold: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  };

  return (
    <div
      className="absolute z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%) translateY(-12px)',
        minWidth: '220px',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm">Plot #{plot.plotNumber}</h3>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor[plot.status] || 'bg-gray-100 text-gray-700'}`}>
          {plot.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-1">
          <IndianRupee size={12} className="text-gray-400" />
          <span className="font-medium">₹{plot.price?.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Ruler size={12} className="text-gray-400" />
          <span>{plot.area} sqft</span>
        </div>
        <div className="flex items-center gap-1">
          <Compass size={12} className="text-gray-400" />
          <span>{plot.facing}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin size={12} className="text-gray-400" />
          <span className="truncate">{plot.layoutId?.location || '-'}</span>
        </div>
      </div>

      {plot.description && (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
          {plot.description}
        </div>
      )}
    </div>
  );
};

export default PlotHoverCard;
