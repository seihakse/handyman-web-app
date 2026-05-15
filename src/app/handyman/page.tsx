// app/handyman/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { MapPin, Star, Shield, Wrench, Loader2, ChevronDown, X } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import { ALL_LOCATIONS } from '@/lib/locations';

interface Category {
  id: string;
  name: string;
}

interface Handyman {
  id: string;
  userId: string;
  bio: string | null;
  skills: string | null;
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  rating: number;
  totalReviews: number;
  isApproved: boolean;
  yearsOfExperience: number | null;
  serviceArea: string | null;
  telegramUsername: string | null;
  category: { id: string; name: string } | null;
  user: {
    id: string;
    name: string;
    profilePicture: string | null;
    address: string | null;
  };
}

const availabilityConfig = {
  AVAILABLE:   { label: 'Available Now',        classes: 'bg-green-100 text-green-700'   },
  BUSY:        { label: 'Currently Busy',        classes: 'bg-yellow-100 text-yellow-700' },
  UNAVAILABLE: { label: 'Currently Unavailable', classes: 'bg-gray-100 text-gray-700'    },
};

export default function HandymanPage() {
  const [handymen, setHandymen]         = useState<Handyman[]>([]);
  const [loading, setLoading]           = useState(true);
  const [categories, setCategories]     = useState<Category[]>([]);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea]         = useState('');

  // Fetch with server-side filters
  const fetchHandymen = (categoryId = '', area = '') => {
    setLoading(true);
    const params = new URLSearchParams();
    if (categoryId) params.set('categoryId', categoryId);
    if (area)       params.set('area', area);

    fetch(`/api/handyman${params.toString() ? '?' + params.toString() : ''}`)
      .then(r => r.json())
      .then(data => setHandymen(data.handymen ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Load categories for filter dropdown
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : (data.categories ?? [])))
      .catch(console.error);

    fetchHandymen();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    fetchHandymen(categoryId, selectedArea);
  };

  const handleAreaChange = (area: string) => {
    setSelectedArea(area);
    fetchHandymen(selectedCategory, area);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedArea('');
    fetchHandymen('', '');
  };

  const hasFilters = selectedCategory || selectedArea;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section
        className="relative bg-cover bg-center py-20 md:py-32"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url(https://t4.ftcdn.net/jpg/01/78/14/57/360_F_178145745_oDRli4ickV2rfj7gJxN1rWd6wfN3OJy2.jpg)',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Our Handymen</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Find and connect with trusted handymen across Phnom Penh and Kandal Province.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">

        {/* ── Filter bar ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">

            {/* Category filter */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Service Category
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={e => handleCategoryChange(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Location filter */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Service Area
              </label>
              <div className="relative">
                <select
                  value={selectedArea}
                  onChange={e => handleAreaChange(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Areas</option>
                  {ALL_LOCATIONS.map(group => (
                    <optgroup key={group.group} label={group.group}>
                      {group.areas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Result count + clear */}
            <div className="flex items-end gap-3 shrink-0">
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
              <div className="px-4 py-2.5 bg-blue-50 rounded-lg text-sm font-semibold text-blue-700">
                {loading ? '…' : handymen.length} Handyman{handymen.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Active filter pills */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <button onClick={() => handleCategoryChange('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedArea && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  <MapPin className="w-3 h-3" />{selectedArea}
                  <button onClick={() => handleAreaChange('')}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && handymen.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Wrench className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium text-gray-500">No handymen found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Cards */}
        {!loading && handymen.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {handymen.map(h => {
              const skills   = h.skills?.split(',').map(s => s.trim()).filter(Boolean) ?? [];
              const rating   = h.rating ?? 0;
              const avail    = availabilityConfig[h.availability] ?? availabilityConfig.UNAVAILABLE;
              const location = h.serviceArea || h.user.address || '';

              return (
                <div key={h.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col">

                  {/* Card header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-600 shrink-0">
                        {h.user.profilePicture ? (
                          <img src={h.user.profilePicture} alt={h.user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                            {h.user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 truncate">{h.user.name}</h3>
                        {location && (
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="w-4 h-4 mr-1 shrink-0" />
                            <span className="text-sm truncate">{location}</span>
                          </div>
                        )}
                        {h.category && (
                          <span className="inline-block mt-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                            {h.category.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${avail.classes}`}>
                        {avail.label}
                      </span>
                    </div>

                    <div className="flex items-center mt-4 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-2 font-bold text-gray-900">{rating.toFixed(1)}</span>
                      <span className="ml-1 text-gray-500 text-sm">({h.totalReviews})</span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-6 flex-1">
                    {h.bio && (
                      <div className="mb-5">
                        <h4 className="font-bold text-gray-900 mb-1.5 text-sm">About</h4>
                        <p className="text-gray-600 text-sm line-clamp-3">{h.bio}</p>
                      </div>
                    )}
                    {skills.length > 0 && (
                      <div className="mb-5">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5 text-sm">
                          <Wrench className="w-3.5 h-3.5" /> Services
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">{skill}</span>
                          ))}
                          {skills.length > 4 && (
                            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">+{skills.length - 4} more</span>
                          )}
                        </div>
                      </div>
                    )}
                    {h.isApproved && (
                      <div className="flex items-center text-green-600 gap-1.5">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium">Verified Professional</span>
                      </div>
                    )}
                  </div>

                  {/* Card actions — fixed h.id */}
                  <div className="p-6 pt-0 grid grid-cols-2 gap-3">
                    {h.telegramUsername ? (
                      <a
                        href={`https://t.me/${h.telegramUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center transition-colors text-sm"
                      >
                        Contact
                      </a>
                    ) : (
                      <button disabled className="bg-gray-100 text-gray-400 font-medium py-3 rounded-lg flex items-center justify-center text-sm cursor-not-allowed">
                        Contact
                      </button>
                    )}
                    <Link
                      href={`/handyman/${h.id}`}
                      className="bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium py-3 rounded-lg border border-gray-200 flex items-center justify-center transition-colors text-sm text-center"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}