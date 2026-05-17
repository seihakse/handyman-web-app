'use client';

// src/app/home/page.tsx (or src/app/page.tsx)
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Header from '@/components/feature/Header';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Wrench, Zap, Hammer, Paintbrush, Thermometer,
  Sprout, Shield, Clock, Star, MapPin, Loader2
} from 'lucide-react';
import Footer from '@/components/feature/Footer';

// Matches the shape returned by GET /api/handyman
interface Handyman {
  id: string;         // profile id
  userId: string;
  bio: string | null;
  skills: string | null;
  rating: number;
  totalReviews: number;
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  isApproved: boolean;
  serviceArea: string | null;
  telegramUsername: string | null;
  user: {
    id: string;
    name: string;
    profilePicture: string | null;
    address: string | null;
  };
}

const availabilityConfig = {
  AVAILABLE:   { label: 'Available',   classes: 'bg-green-100 text-green-800'   },
  BUSY:        { label: 'Busy',        classes: 'bg-orange-100 text-orange-800' },
  UNAVAILABLE: { label: 'Unavailable', classes: 'bg-gray-100 text-gray-700'    },
};

const services = [
  { name: 'Plumbing',         icon: <Wrench className="h-6 w-6" />,      color: 'bg-blue-100 text-blue-600'      },
  { name: 'Electrical',       icon: <Zap className="h-6 w-6" />,         color: 'bg-yellow-100 text-yellow-600'  },
  { name: 'Carpentry',        icon: <Hammer className="h-6 w-6" />,      color: 'bg-amber-100 text-amber-600'    },
  { name: 'Painting',         icon: <Paintbrush className="h-6 w-6" />,  color: 'bg-purple-100 text-purple-600'  },
  { name: 'HVAC',             icon: <Thermometer className="h-6 w-6" />, color: 'bg-red-100 text-red-600'        },
  { name: 'Appliance Repair', icon: <Wrench className="h-6 w-6" />,      color: 'bg-green-100 text-green-600'    },
  { name: 'Landscaping',      icon: <Sprout className="h-6 w-6" />,      color: 'bg-emerald-100 text-emerald-600'},
  { name: 'General Repairs',  icon: <Wrench className="h-6 w-6" />,      color: 'bg-gray-100 text-gray-600'      },
];

export default function Home() {
  const [handymen, setHandymen] = useState<Handyman[]>([]);
  const [loadingHandymen, setLoadingHandymen] = useState(true);

  useEffect(() => {
    fetch('/api/handyman')
      .then(res => res.json())
      .then(data => {
        // API returns { handymen: [...] }
        const list: Handyman[] = data.handymen ?? [];
        setHandymen(list.slice(0, 6)); // top 6 by rating on homepage
      })
      .catch(console.error)
      .finally(() => setLoadingHandymen(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section
        className="relative bg-cover bg-center py-20 md:py-32"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url(https://t4.ftcdn.net/jpg/03/23/15/19/360_F_323151985_oLkiWe9GF7P9QNvhU9V1DldoZ3OFQrR4.jpg)',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Find Trusted Handymen Near You
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Connect with skilled professionals for all your home repair and maintenance needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from a wide range of professional services
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`${service.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {service.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose HandyPro */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose HandyPro?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield className="h-8 w-8 text-blue-600" />,  bg: 'bg-blue-100',   title: 'Verified Professionals', desc: 'All handymen are background-checked and verified for your safety.' },
              { icon: <Clock className="h-8 w-8 text-green-600" />,  bg: 'bg-green-100',  title: 'Quick Service',          desc: 'Get connected with available handymen in your area within minutes.' },
              { icon: <Star className="h-8 w-8 text-yellow-600" />,  bg: 'bg-yellow-100', title: 'Quality Guaranteed',      desc: 'Rate and review services to maintain high quality standards.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className={`${item.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Handymen — LIVE DATA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Rated Handymen</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet our most trusted and skilled professionals
            </p>
          </div>

          {loadingHandymen ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          ) : handymen.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Wrench className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">No handymen available yet</p>
              <p className="text-sm mt-1">Check back soon as we verify and approve new professionals</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {handymen.map((h) => {
                const rating = h.rating ?? 0;
                const skills = (h.skills ?? '').split(',').map(s => s.trim()).filter(Boolean);
                const avail  = availabilityConfig[h.availability] ?? availabilityConfig.UNAVAILABLE;

                return (
                  <Card key={h.id} className="hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 shrink-0">
                          {h.user.profilePicture ? (
                            <img src={h.user.profilePicture} alt={h.user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                              {h.user.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-semibold text-gray-900 truncate">{h.user.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${avail.classes}`}>
                              {avail.label}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
                            <span className="ml-1 text-sm text-gray-500">({h.totalReviews} reviews)</span>
                          </div>
                          {h.serviceArea && (
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <MapPin className="h-3.5 w-3.5 mr-1 shrink-0" />
                              <span className="truncate">{h.serviceArea}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {h.bio && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{h.bio}</p>
                      )}

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                        {skills.length > 3 && (
                          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                            +{skills.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex gap-3">
                        {h.telegramUsername ? (
                          <a
                            href={`https://t.me/${h.telegramUsername}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg text-center transition"
                          >
                            Contact
                          </a>
                        ) : (
                          <button disabled className="flex-1 bg-gray-100 text-gray-400 text-sm font-medium py-2.5 rounded-lg cursor-not-allowed">
                            Contact
                          </button>
                        )}
                        <Link
                          href={`/handyman/${h.id}`}
                          className="flex-1 border border-blue-200 text-blue-600 hover:bg-blue-50 text-sm font-medium py-2.5 rounded-lg text-center transition"
                        >
                          View Profile
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/handyman"
              className="inline-block border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium transition"
            >
              View All Handymen
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}