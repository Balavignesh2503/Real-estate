import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { layoutService } from '../services/api';
import { MapPin, Search, ArrowUpDown, X } from 'lucide-react';
import MobileBottomNav from '../components/MobileBottomNav';

const PAGE_SIZE = 9;

const Properties = () => {
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const resolveImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : 'http://localhost:5001';
    return `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  };

  useEffect(() => {
    const fetchLayouts = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await layoutService.getAll();
        setLayouts(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.response?.data?.message || e.message || 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };
    fetchLayouts();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const loc = location.trim().toLowerCase();

    let items = layouts;

    if (q) {
      items = items.filter((l) => {
        const title = (l.title || '').toLowerCase();
        const lLoc = (l.location || '').toLowerCase();
        const desc = (l.description || '').toLowerCase();
        return title.includes(q) || lLoc.includes(q) || desc.includes(q);
      });
    }

    if (loc) {
      items = items.filter((l) => (l.location || '').toLowerCase().includes(loc));
    }

    if (status !== 'all') {
      items = items.filter((l) => (l.status || 'active') === status);
    }

    const min = minPrice === '' ? null : Number(minPrice);
    const max = maxPrice === '' ? null : Number(maxPrice);

    if (min !== null && !Number.isNaN(min)) {
      items = items.filter((l) => typeof l.minPrice === 'number' ? l.minPrice >= min : true);
    }

    if (max !== null && !Number.isNaN(max)) {
      items = items.filter((l) => typeof l.minPrice === 'number' ? l.minPrice <= max : true);
    }

    const sorted = [...items];
    if (sort === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sort === 'title_asc') {
      sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sort === 'title_desc') {
      sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    }

    return sorted;
  }, [layouts, query, location, status, minPrice, maxPrice, sort]);

  const visibleItems = filtered.slice(0, visible);

  const clearFilters = () => {
    setQuery('');
    setLocation('');
    setStatus('all');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setVisible(PAGE_SIZE);
  };

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, location, status, minPrice, maxPrice, sort]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24 sm:pb-0">
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="px-4 sm:px-6 lg:px-20 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">Properties</h1>
              <p className="text-xs sm:text-sm text-gray-500">Browse projects and book available plots</p>
            </div>
            <Link
              to="/"
              className="text-xs sm:text-sm font-bold text-primary-600 hover:text-primary-700"
            >
              Back to Home
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-3 py-2.5">
                <Search size={18} className="text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by project name or location..."
                  className="w-full bg-transparent border-none focus:ring-0 outline-none text-sm text-gray-900 dark:text-white"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Clear search"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-3">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Filter location"
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-3 py-2.5 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div className="lg:col-span-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-3 py-2.5 text-sm text-gray-900 dark:text-white"
              >
                <option value="newest">Newest</option>
                <option value="title_asc">Title A-Z</option>
                <option value="title_desc">Title Z-A</option>
              </select>
            </div>

            <div className="lg:col-span-2 flex items-center justify-end">
              <button
                onClick={clearFilters}
                className="w-full lg:w-auto px-4 py-2.5 bg-gray-900 text-white dark:bg-white dark:text-black rounded-2xl text-sm font-extrabold"
              >
                Clear
              </button>
            </div>

            <div className="lg:col-span-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-3 py-2.5 text-sm text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <input
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min price"
                inputMode="numeric"
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-3 py-2.5 text-sm text-gray-900 dark:text-white"
              />

              <input
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max price"
                inputMode="numeric"
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-3 py-2.5 text-sm text-gray-900 dark:text-white"
              />

              <div className="hidden sm:flex items-center justify-end gap-2 text-xs text-gray-500">
                <ArrowUpDown size={14} />
                <span className="font-semibold">{filtered.length} results</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-20 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-2xl p-4 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 text-center">
            <div className="text-lg font-extrabold text-gray-900 dark:text-white">No properties found</div>
            <div className="text-sm text-gray-500 mt-1">Try changing your filters</div>
            <button
              onClick={clearFilters}
              className="mt-4 px-5 py-2.5 rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-black font-extrabold text-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleItems.map((layout) => (
                <Link
                  key={layout._id}
                  to={`/property/${layout._id}`}
                  className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={resolveImageUrl(layout.imageUrl)}
                      alt={layout.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-950/85 backdrop-blur px-3 py-1.5 rounded-full text-xs font-extrabold text-gray-900 dark:text-white">
                      {layout.location || 'Location'}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-lg font-extrabold text-gray-900 dark:text-white line-clamp-1">{layout.title}</div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin size={16} className="text-primary-500" />
                      <span className="line-clamp-1">{layout.location || '-'}</span>
                    </div>
                    {layout.description && (
                      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {layout.description}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {visible < filtered.length && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="px-6 py-3 rounded-2xl bg-primary-600 text-white font-extrabold text-sm hover:bg-primary-700"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default Properties;
