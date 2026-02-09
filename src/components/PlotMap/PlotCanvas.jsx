import React, { useState, useRef, useEffect } from 'react';
import PlotHoverCard from './PlotHoverCard';

const PlotCanvas = ({ imageUrl, plots, onPlotCreate, isEditing = false }) => {
  const [points, setPoints] = useState([]);
  const [viewBox, setViewBox] = useState("0 0 1000 1000");
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  const resolveImageUrl = (url) => {
    if (!url) return '';
    // If it's already a full URL, return as-is
    if (url.startsWith('http')) return url;
    // Prepend backend base URL from environment or fallback
    const baseUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
    return `${baseUrl}${url}`;
  };

  const fullImageUrl = resolveImageUrl(imageUrl);
  console.log('PlotCanvas imageUrl:', imageUrl, 'resolved to:', fullImageUrl);

  useEffect(() => {
    if (!fullImageUrl) return;
    const img = new Image();
    img.onload = () => {
      const naturalWidth = img.naturalWidth || 1000;
      const naturalHeight = img.naturalHeight || 1000;
      setViewBox(`0 0 ${naturalWidth} ${naturalHeight}`);
    };
    img.src = fullImageUrl;
  }, [fullImageUrl]);

  const getCoordinates = (e) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: Math.round(cursorpt.x), y: Math.round(cursorpt.y) };
  };

  const handleSvgClick = (e) => {
    if (!isEditing) return;
    const { x, y } = getCoordinates(e);
    setPoints([...points, { x, y }]);
  };

  const handleSvgMouseMove = (e) => {
    setHoverPosition({ x: e.clientX, y: e.clientY });
  };

  const handleCompletePolygon = () => {
    if (points.length < 3) return;
    const polygonString = points.map(p => `${p.x},${p.y}`).join(' ');
    onPlotCreate(polygonString);
    setPoints([]);
  };

  return (
    <div className="relative w-full overflow-hidden bg-gray-200 dark:bg-gray-800 rounded-xl shadow-inner border border-gray-300 dark:border-gray-700">
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="block w-full h-auto max-w-full touch-none select-none"
        onClick={handleSvgClick}
        onMouseMove={handleSvgMouseMove}
        onMouseLeave={() => setHoveredPlot(null)}
        preserveAspectRatio="xMidYMid meet"
      >
        <image
          href={fullImageUrl}
          width="100%"
          height="100%"
          style={{ pointerEvents: 'none' }}
        />
        
        {/* Existing Plots */}
        {plots.map((plot, index) => (
          <polygon
            key={plot._id || index}
            points={plot.polygon}
            onClick={(e) => {
              e.stopPropagation();
              if (typeof plot.onClick === 'function') plot.onClick(plot);
            }}
            onMouseEnter={() => setHoveredPlot(plot)}
            onMouseLeave={() => setHoveredPlot(null)}
            className={`cursor-pointer transition-all duration-200 ${
              plot.status === 'available' ? 'fill-green-500/30 stroke-green-600 hover:fill-green-500/50' :
              plot.status === 'booked' ? 'fill-yellow-500/30 stroke-yellow-600 hover:fill-yellow-500/50' :
              'fill-red-500/30 stroke-red-600 hover:fill-red-500/50'
            }`}
            strokeWidth="2"
          />
        ))}

        {/* Current Drawing Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="5" className="fill-primary-600" />
        ))}
        
        {points.length > 0 && (
          <polyline
            points={points.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            className="stroke-primary-500"
            strokeWidth="2"
            strokeDasharray="4"
          />
        )}
      </svg>

      {hoveredPlot && (
        <PlotHoverCard plot={hoveredPlot} position={hoverPosition} />
      )}

      {isEditing && points.length >= 3 && (
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button 
            onClick={() => setPoints([])}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
          <button 
            onClick={handleCompletePolygon}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 transition-colors"
          >
            Complete Plot
          </button>
        </div>
      )}
    </div>
  );
};

export default PlotCanvas;
