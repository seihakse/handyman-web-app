// app/handyman/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { MapPin, Star, Shield, Wrench, Zap, Hammer, Paintbrush, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';

interface Handyman {
  id: string;
  name: string;
  profilePicture: string | null;
  address: string | null;
  handymanProfile: {
    bio: string | null;
    skills: string | null;
    availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
    rating: number | null;
    totalReviews: number;
    isApproved: boolean;
    yearsOfExperience: number | null;
    serviceArea: string | null;
    telegramUsername: string | null;
  };
}

const availabilityConfig = {
  AVAILABLE:   { label: 'Available Now',        classes: 'bg-green-100 text-green-700'   },
  BUSY:        { label: 'Currently Busy',        classes: 'bg-yellow-100 text-yellow-700' },
  UNAVAILABLE: { label: 'Currently Unavailable', classes: 'bg-gray-100 text-gray-700'    },
};

const categories = ['All Services', 'Electrical', 'Plumbing', 'Carpentry', 'Painting'];
const icons      = [Hammer, Zap, Wrench, Hammer, Paintbrush];

export default function HandymanPage() {
  const [handymen, setHandymen]           = useState<Handyman[]>([]);
  const [filtered, setFiltered]           = useState<Handyman[]>([]);
  const [loading, setLoading]             = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Services');

  useEffect(() => {
    fetch('/api/handyman')
      .then(res => res.json())
      .then(data => {
        setHandymen(data);
        setFiltered(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'All Services') {
      setFiltered(handymen);
    } else {
      setFiltered(
        handymen.filter(h =>
          h.handymanProfile.skills
            ?.toLowerCase()
            .includes(cat.toLowerCase())
        )
      );
    }
  };

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
            Getting professional home services has never been easier. Find and connect with trusted handymen in your area.
          </p>
        </div>
      </section>

      {/* Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">Browse by Category</h2>
            <p className="text-gray-600">Find handymen specializing in your specific needs</p>
          </div>
          <p className="text-lg font-medium text-gray-900">
            {filtered.length} Handyman{filtered.length !== 1 ? 's' : ''} Available
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-3 mt-6 py-6">
          {categories.map((cat, i) => {
            const Icon = icons[i];
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-6 py-3 rounded-lg text-sm font-medium flex items-center transition-colors ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {cat}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Wrench className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg">No handymen found for this category.</p>
          </div>
        )}

        {/* Cards */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map(handyman => {
              const profile = handyman.handymanProfile;
              const skills  = profile.skills?.split(',').map(s => s.trim()).filter(Boolean) ?? [];
              const rating  = profile.rating ?? 0;
              const avail   = availabilityConfig[profile.availability] ?? availabilityConfig.UNAVAILABLE;
              const location = profile.serviceArea || handyman.address || '';

              return (
                <div
                  key={handyman.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-600 shrink-0">
                        {handyman.profilePicture ? (
                          <img src={handyman.profilePicture} alt={handyman.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                            {handyman.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 truncate">{handyman.name}</h3>
                        {location && (
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="w-4 h-4 mr-1 shrink-0" />
                            <span className="text-sm truncate">{location}</span>
                          </div>
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
                        <Star key={i} className={`w-5 h-5 ${
                          i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`} />
                      ))}
                      <span className="ml-2 font-bold text-gray-900">{rating.toFixed(1)}</span>
                      <span className="ml-1 text-gray-500 text-sm">({profile.totalReviews})</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 flex-1">
                    {profile.bio && (
                      <div className="mb-5">
                        <h4 className="font-bold text-gray-900 mb-1.5 text-sm">About</h4>
                        <p className="text-gray-600 text-sm line-clamp-3">{profile.bio}</p>
                      </div>
                    )}

                    {skills.length > 0 && (
                      <div className="mb-5">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5 text-sm">
                          <Wrench className="w-3.5 h-3.5" /> Services
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                          {skills.length > 4 && (
                            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                              +{skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {profile.isApproved && (
                      <div className="flex items-center text-green-600 gap-1.5">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium">Verified Professional</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 grid grid-cols-2 gap-3">
                    {profile.telegramUsername ? (
                      <a
                        href={`https://t.me/${profile.telegramUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center transition-colors text-sm"
                      >
                        Contact
                      </a>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-100 text-gray-400 font-medium py-3 rounded-lg flex items-center justify-center text-sm cursor-not-allowed"
                      >
                        Contact
                      </button>
                    )}
                    <Link
                      href={`/handyman/${handyman.id}`}
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