import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PlotCanvas from '../components/PlotMap/PlotCanvas';
import { layoutService, plotService, bookingService } from '../services/api';
import { Plus, Info, CheckCircle, XCircle, Clock } from 'lucide-react';

const LayoutEditor = () => {
  const { id } = useParams();
  const [layout, setLayout] = useState(null);
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlotModal, setShowPlotModal] = useState(false);
  const [newPlotPolygon, setNewPlotPolygon] = useState('');
  const [mapFile, setMapFile] = useState(null);
  const [mapUploading, setMapUploading] = useState(false);
  const [mapUploadError, setMapUploadError] = useState('');
  const [mapUploadSuccess, setMapUploadSuccess] = useState('');
  const [plotData, setPlotData] = useState({
    plotNumber: '',
    area: '',
    price: '',
    facing: 'East',
    description: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [layoutRes, plotsRes] = await Promise.all([
          layoutService.getById(id),
          plotService.getByLayout(id)
        ]);
        setLayout(layoutRes.data);
        setPlots(plotsRes.data);
      } catch (error) {
        console.error('Error fetching layout data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePlotCreate = (polygonString) => {
    setNewPlotPolygon(polygonString);
    setShowPlotModal(true);
  };

  const handleSavePlot = async (e) => {
    e.preventDefault();
    try {
      const { data } = await plotService.create({
        ...plotData,
        polygon: newPlotPolygon,
        layoutId: id
      });
      setPlots([...plots, data]);
      setShowPlotModal(false);
      setPlotData({ plotNumber: '', area: '', price: '', facing: 'East', description: '' });
    } catch (error) {
      alert('Error saving plot');
    }
  };

  const handleMapFileChange = (e) => {
    const f = e.target.files?.[0];
    setMapUploadError('');
    setMapUploadSuccess('');
    setMapFile(f || null);
  };

  const handleChangeMapImage = async () => {
    if (!mapFile || !layout?._id) return;
    setMapUploading(true);
    setMapUploadError('');
    setMapUploadSuccess('');
    try {
      const uploaded = await layoutService.upload(mapFile);
      const nextUrl = uploaded.data.imageUrl;
      console.log('Upload returned URL:', nextUrl);
      const updated = await layoutService.update(layout._id, { imageUrl: nextUrl });
      console.log('Layout after update imageUrl:', updated.data.imageUrl);
      setLayout(updated.data);
      setMapFile(null);
      setMapUploadSuccess('Map image updated');
    } catch (error) {
      setMapUploadError(error.response?.data?.message || error.message || 'Failed to update map image');
    } finally {
      setMapUploading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96 text-gray-500">Loading editor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{layout?.title}</h1>
          <p className="text-gray-500 dark:text-gray-400">{layout?.location}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-gray-600 dark:text-gray-400">Available</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-gray-600 dark:text-gray-400">Booked</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-gray-600 dark:text-gray-400">Sold</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <PlotCanvas 
            imageUrl={layout?.imageUrl} 
            plots={plots} 
            onPlotCreate={handlePlotCreate}
            isEditing={true}
          />
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Info size={18} className="text-primary-500" />
              Editor Instructions
            </h2>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>• Click on the map to place polygon points.</li>
              <li>• Points will connect automatically.</li>
              <li>• Click "Complete Plot" when done.</li>
              <li>• Fill in plot details to save.</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h2 className="font-semibold mb-4">Change Map Image</h2>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*,application/pdf"
                className="w-full"
                onChange={handleMapFileChange}
              />
              {mapUploadError && <div className="text-sm text-red-600">{mapUploadError}</div>}
              {mapUploadSuccess && <div className="text-sm text-green-600">{mapUploadSuccess}</div>}
              <button
                type="button"
                disabled={!mapFile || mapUploading}
                onClick={handleChangeMapImage}
                className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-bold text-sm disabled:opacity-50"
              >
                {mapUploading ? 'Updating...' : 'Upload & Apply'}
              </button>
              <div className="text-xs text-gray-500">
                Supported: images + PDF. PDF rendering requires conversion (next step).
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h2 className="font-semibold mb-4">Plot Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Total Plots</span>
                <span className="font-medium">{plots.length}</span>
              </div>
              <div className="flex justify-between items-center text-green-600">
                <span className="text-sm">Available</span>
                <span className="font-medium">{plots.filter(p => p.status === 'available').length}</span>
              </div>
              <div className="flex justify-between items-center text-yellow-600">
                <span className="text-sm">Booked</span>
                <span className="font-medium">{plots.filter(p => p.status === 'booked').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plot Details Modal */}
      {showPlotModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold">Add Plot Details</h3>
              <button onClick={() => setShowPlotModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleSavePlot} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Plot Number</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                    value={plotData.plotNumber}
                    onChange={e => setPlotData({...plotData, plotNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Area (sqft)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                    value={plotData.area}
                    onChange={e => setPlotData({...plotData, area: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input 
                  required
                  type="number" 
                  className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                  value={plotData.price}
                  onChange={e => setPlotData({...plotData, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Facing</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                  value={plotData.facing}
                  onChange={e => setPlotData({...plotData, facing: e.target.value})}
                >
                  <option>East</option>
                  <option>West</option>
                  <option>North</option>
                  <option>South</option>
                  <option>North-East</option>
                  <option>North-West</option>
                  <option>South-East</option>
                  <option>South-West</option>
                </select>
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
              >
                Save Plot
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayoutEditor;
