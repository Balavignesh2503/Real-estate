import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { layoutService } from '../services/api';
import { Search, MapPin, Grid, ArrowRight, Home as HomeIcon } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        const { data } = await layoutService.getAll();
        setLayouts(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLayouts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const resolveImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : 'http://localhost:5001';
    return `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Public Navbar */}
      <nav className="h-20 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 lg:px-20 sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary-600 p-2 rounded-lg text-white">
            <HomeIcon size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">RealMap</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/properties" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">Properties</Link>
          <Link to="/about" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">About</Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {userInfo ? (
            <>
              <button
                onClick={() => navigate(userInfo.role === 'REAL_ESTATE_OWNER' || userInfo.role === 'ADMIN' ? '/owner' : '/user')}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full font-medium text-sm hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-gray-600 dark:text-gray-400 rounded-full font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="px-6 py-2.5 bg-primary-600 text-white rounded-full font-bold text-sm hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 lg:px-20 overflow-hidden">
        <div className="max-w-4xl">
          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-6">
            Discover and Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-400">Perfect Plot</span> Online.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl leading-relaxed">
            RealMap is the industry standard for interactive real estate layout mapping. Browse available plots, view exact locations, and book instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 max-w-2xl">
            <div className="flex-1 flex items-center px-4 py-3">
              <Search className="text-gray-400 mr-3" />
              <input 
                type="text" 
                placeholder="Search location, builder, or project..."
                className="w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white"
              />
            </div>
            <button className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold hover:opacity-90 transition-opacity">
              Find Property
            </button>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute top-40 right-20 hidden lg:block animate-bounce-slow">
           <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
             <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white">
               <Grid size={24} />
             </div>
             <div>
               <div className="text-sm text-gray-500">Live Projects</div>
               <div className="text-2xl font-bold text-gray-900 dark:text-white">1,240+</div>
             </div>
           </div>
        </div>
      </section>

      {/* Featured Layouts */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-24 px-6 lg:px-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Projects</h2>
            <p className="text-gray-500 mt-2">Handpicked premium real estate layouts for you</p>
          </div>
          <button className="text-primary-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View All <ArrowRight size={20} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {layouts.map((layout) => (
              <Link 
                key={layout._id} 
                to={`/property/${layout._id}`}
                className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={resolveImageUrl(layout.imageUrl)} 
                    alt={layout.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-primary-600">
                    NEW PROJECT
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{layout.title}</h3>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                    <MapPin size={16} className="mr-1.5 text-primary-500" />
                    {layout.location}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 overflow-hidden">
                           <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-primary-600 flex items-center justify-center text-[10px] text-white font-bold">
                        +12
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-400">124 Plots Available</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 lg:px-20 border-t border-gray-100 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 p-2 rounded-lg text-white">
                <HomeIcon size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">RealMap</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Leading the digital transformation of real estate layout management and booking.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-primary-600">Features</a></li>
              <li><a href="#" className="hover:text-primary-600">Pricing</a></li>
              <li><a href="#" className="hover:text-primary-600">Interactive Maps</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-primary-600">About Us</a></li>
              <li><a href="#" className="hover:text-primary-600">Careers</a></li>
              <li><a href="#" className="hover:text-primary-600">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Subscribe</h4>
            <p className="text-sm text-gray-500 mb-4">Get latest updates about new properties.</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Email" className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-lg text-sm" />
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold">Join</button>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-500">
          © 2026 RealMap SaaS. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
