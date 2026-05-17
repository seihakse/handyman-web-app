// app/handyman/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { MapPin, Star, Shield, Wrench, Loader2, ChevronDown, X, SlidersHorizontal, CheckCircle } from 'lucide-react';
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

// ── Custom Dropdown ────────────────────────────────────────────────────────────

function FilterDropdown({
  label,
  icon,
  value,
  placeholder,
  isActive,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  isActive: boolean;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 min-w-[180px] ${
          isActive
            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
            : open
            ? 'bg-white border-blue-400 text-gray-800 shadow-sm ring-2 ring-blue-100'
            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 shadow-sm'
        }`}
      >
        <span className={isActive ? 'text-white' : 'text-blue-500'}>{icon}</span>
        <span className="flex-1 text-left truncate max-w-[120px]">
          {value || placeholder}
        </span>
        {isActive ? (
          <CheckCircle className="w-4 h-4 text-white/80 shrink-0" />
        ) : (
          <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        )}
      </button>

      {/* Floating panel */}
      {open && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 w-64 overflow-hidden">
          {/* Panel label */}
          <div className="px-4 pt-3 pb-2 border-b border-gray-50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
          </div>
          {/* Scrollable list */}
          <div className="px-3 py-2 max-h-72 overflow-y-auto">
            {children(() => setOpen(false))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HandymanPage() {
  const [handymen, setHandymen]     = useState<Handyman[]>([]);
  const [loading, setLoading]       = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea]         = useState('');

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
  const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.name ?? '';

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
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">

            {/* Label */}
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Filters</span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-gray-200 shrink-0" />

            {/* Dropdowns */}
            <div className="flex flex-wrap gap-2 flex-1">

              {/* Category */}
              <FilterDropdown
                label="Service Category"
                icon={<Wrench className="w-4 h-4" />}
                value={selectedCategoryName}
                placeholder="All Categories"
                isActive={!!selectedCategory}
              >
                {(close) => (
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => { handleCategoryChange(''); close(); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === '' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      All Categories
                      {selectedCategory === '' && <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />}
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => { handleCategoryChange(cat.id); close(); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === cat.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {cat.name}
                        {selectedCategory === cat.id && <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </FilterDropdown>

              {/* Area */}
              <FilterDropdown
                label="Service Area"
                icon={<MapPin className="w-4 h-4" />}
                value={selectedArea}
                placeholder="All Areas"
                isActive={!!selectedArea}
              >
                {(close) => (
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => { handleAreaChange(''); close(); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedArea === '' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      All Areas
                      {selectedArea === '' && <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />}
                    </button>

                    {ALL_LOCATIONS.map(group => (
                      <div key={group.group}>
                        <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          {group.group}
                        </p>
                        {group.areas.map(area => (
                          <button
                            key={area}
                            onClick={() => { handleAreaChange(area); close(); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedArea === area ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {area}
                            {selectedArea === area && <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </FilterDropdown>

              {/* Clear */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>

            {/* Result count */}
            <span className="shrink-0 self-center inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-full text-xs font-bold tracking-wide">
              {loading && <Loader2 className="w-3 h-3 animate-spin opacity-80" />}
              {handymen.length} {handymen.length === 1 ? 'result' : 'results'}
            </span>
          </div>

          {/* Active filter pills */}
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pl-1">
              <span className="text-xs text-gray-400 font-medium">Active:</span>
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">
                  <Wrench className="w-3 h-3" />
                  {selectedCategoryName}
                  <button onClick={() => handleCategoryChange('')} className="ml-0.5 hover:text-blue-900 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedArea && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">
                  <MapPin className="w-3 h-3" />
                  {selectedArea}
                  <button onClick={() => handleAreaChange('')} className="ml-0.5 hover:text-blue-900 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading indicator — small spinner over the result count, not full page */}
        {loading && handymen.length === 0 && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Empty state */}
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

        {/* Cards — stay mounted during filter changes, fade instead of unmounting */}
        {handymen.length > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            style={{
              opacity: loading ? 0.45 : 1,
              pointerEvents: loading ? 'none' : 'auto',
              transition: 'opacity 0.25s ease',
            }}
          >
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

                  {/* Card actions */}
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