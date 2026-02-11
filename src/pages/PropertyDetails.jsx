import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlotCanvas from '../components/PlotMap/PlotCanvas';
import { layoutService, plotService, bookingService } from '../services/api';
import { MapPin, IndianRupee, Ruler, Compass, CheckCircle, Info, XCircle, Mail, Phone, User } from 'lucide-react';
import MobileBottomNav from '../components/MobileBottomNav';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [layout, setLayout] = useState(null);
  const [plots, setPlots] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', mobile: '' });

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
        console.error('Error fetching property data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePlotClick = (plot) => {
    if (plot.status === 'available') {
      setSelectedPlot(plot);
    }
  };

  const openBooking = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }

    setBookingError('');
    setIsBookingOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlot?._id) return;

    try {
      setBookingLoading(true);
      setBookingError('');
      await bookingService.create({
        plotId: selectedPlot._id,
        name: bookingForm.name,
        email: bookingForm.email,
        mobile: bookingForm.mobile,
      });

      setIsBookingOpen(false);
      setBookingForm({ name: '', email: '', mobile: '' });
      // Refresh plots
      const { data } = await plotService.getByLayout(id);
      setPlots(data);
      setSelectedPlot(null);
    } catch (error) {
      setBookingError(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">Loading property...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 sm:pb-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{layout?.title}</h1>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <MapPin size={18} className="mr-2 text-primary-500" />
            {layout?.location}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Sold</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
          <PlotCanvas 
            imageUrl={layout?.imageUrl} 
            plots={plots.map(p => ({
              ...p,
              onClick: () => handlePlotClick(p)
            }))} 
            isEditing={false}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          {selectedPlot ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xl space-y-6 sticky top-24 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Plot #{selectedPlot.plotNumber}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  selectedPlot.status === 'available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  selectedPlot.status === 'booked' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                }`}>
                  {selectedPlot.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-1">
                    <IndianRupee size={14} className="mr-1" />
                    Price
                  </div>
                  <div className="font-bold text-lg">₹{selectedPlot.price.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-1">
                    <Ruler size={14} className="mr-1" />
                    Area
                  </div>
                  <div className="font-bold text-lg">{selectedPlot.area} sqft</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-1">
                    <Compass size={14} className="mr-1" />
                    Facing
                  </div>
                  <div className="font-bold text-lg">{selectedPlot.facing}</div>
                </div>
              </div>

              {selectedPlot.description && (
                <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedPlot.description}
                </div>
              )}

              <button 
                onClick={openBooking}
                disabled={bookingLoading || selectedPlot.status !== 'available'}
                className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {selectedPlot.status === 'sold' ? (
                  <>Sold</>
                ) : selectedPlot.status === 'booked' ? (
                  <>Booked</>
                ) : bookingLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Book This Plot
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 italic">
                * Booking request will be sent to the owner for confirmation
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center space-y-4 h-64">
              <div className="bg-white dark:bg-gray-900 p-4 rounded-full shadow-sm">
                <Info size={32} className="text-gray-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Select a Plot</h3>
                <p className="text-sm text-gray-500 max-w-[200px]">Click on any available plot on the layout to view details and book.</p>
              </div>
            </div>
          )}

          <div className="bg-primary-50 dark:bg-primary-900/10 rounded-2xl p-6 border border-primary-100 dark:border-primary-900/30">
            <h3 className="font-bold text-primary-900 dark:text-primary-100 mb-2">Need Assistance?</h3>
            <p className="text-sm text-primary-700 dark:text-primary-300 mb-4">Our property experts are here to help you choose the best plot.</p>
            <button className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline">
              Contact Sales Team →
            </button>
          </div>
        </div>
      </div>

      {isBookingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Book Plot #{selectedPlot?.plotNumber}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fill details to submit booking request</p>
              </div>
              <button onClick={() => setIsBookingOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              {bookingError && (
                <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 px-4 py-2 rounded-lg">
                  {bookingError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    required
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    required
                    type="email"
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mobile</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    required
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700"
                    value={bookingForm.mobile}
                    onChange={(e) => setBookingForm({ ...bookingForm, mobile: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {bookingLoading ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </form>
          </div>
        </div>
      )}
      <MobileBottomNav />
    </div>
  );
};

export default PropertyDetails;
