// app/handyman/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import {
  MapPin, Star, Shield, Wrench, Clock, ChevronLeft,
  Send, Image as ImageIcon, Award, Calendar, AlertCircle,
  CheckCircle, Loader2,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

interface HandymanProfile {
  bio: string | null;
  skills: string | null;
  certificate: string | null;
  portfolioImage: string | null;
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  rating: number | null;
  totalReviews: number;
  isApproved: boolean;
  telegramUsername: string | null;
  yearsOfExperience: number | null;
  serviceArea: string | null;
}

interface HandymanData {
  id: string;
  name: string;
  profilePicture: string | null;
  address: string | null;
  createdAt: string;
  handymanProfile: HandymanProfile;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const availabilityConfig = {
  AVAILABLE:   { label: 'Available Now',       classes: 'bg-green-100 text-green-700'  },
  BUSY:        { label: 'Currently Busy',       classes: 'bg-yellow-100 text-yellow-700' },
  UNAVAILABLE: { label: 'Currently Unavailable', classes: 'bg-gray-100 text-gray-700'   },
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < Math.floor(rating)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HandymanProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData]       = useState<HandymanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/handyman/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Handyman not found');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-gray-500">Loading profile…</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Not Found</h2>
            <p className="text-gray-500 mb-6">
              This handyman profile doesn't exist or is not yet approved.
            </p>
            <Link
              href="/handyman"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Handymen
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const profile = data.handymanProfile;
  const skills  = profile.skills ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const avail   = availabilityConfig[profile.availability] ?? availabilityConfig.UNAVAILABLE;
  const rating  = profile.rating ?? 0;
  const joined  = new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* ── Hero banner ── */}
      <section
        className="relative bg-cover bg-center py-16"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(https://t4.ftcdn.net/jpg/01/78/14/57/360_F_178145745_oDRli4ickV2rfj7gJxN1rWd6wfN3OJy2.jpg)',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative container mx-auto px-4">
          {/* Back link */}
          <Link
            href="/handyman"
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Handymen
          </Link>

          {/* Profile summary */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white/30 bg-blue-600 shrink-0">
              {data.profilePicture ? (
                <img src={data.profilePicture} alt={data.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                  {data.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white">{data.name}</h1>
                {profile.isApproved && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-400/40 rounded-full text-green-300 text-sm font-medium">
                    <Shield className="w-3.5 h-3.5" />
                    Verified Pro
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-white/80 text-sm mb-4">
                {(data.address || profile.serviceArea) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {profile.serviceArea || data.address}
                  </span>
                )}
                {profile.yearsOfExperience && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {profile.yearsOfExperience} yrs experience
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Joined {joined}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <StarRow rating={rating} />
                  <span className="text-white font-bold">{rating.toFixed(1)}</span>
                  <span className="text-white/60 text-sm">({profile.totalReviews} reviews)</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${avail.classes}`}>
                  {avail.label}
                </span>
              </div>
            </div>

            {/* CTA — Telegram */}
            {profile.telegramUsername && (
              <a
                href={`https://t.me/${profile.telegramUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-colors shadow-lg"
              >
                <Send className="w-4 h-4" />
                Contact via Telegram
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: main info ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* About */}
            {profile.bio && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-blue-600 rounded-full inline-block" />
                  About
                </h2>
                <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-blue-600 rounded-full inline-block" />
                  <Wrench className="w-4 h-4 text-blue-600" />
                  Services & Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio image */}
            {profile.portfolioImage && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-blue-600 rounded-full inline-block" />
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  Portfolio
                </h2>
                <div className="rounded-lg overflow-hidden border border-gray-100">
                  <img
                    src={profile.portfolioImage}
                    alt="Portfolio"
                    className="w-full object-cover max-h-80"
                  />
                </div>
              </div>
            )}

            {/* Certificate */}
            {profile.certificate && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-blue-600 rounded-full inline-block" />
                  <Award className="w-4 h-4 text-blue-600" />
                  Certificate
                </h2>
                <div className="rounded-lg overflow-hidden border border-gray-100">
                  <img
                    src={profile.certificate}
                    alt="Certificate"
                    className="w-full object-cover max-h-72"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Right: sidebar ── */}
          <div className="space-y-5">

            {/* Quick stats */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                At a Glance
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reviews</span>
                  <span className="font-semibold text-gray-900">{profile.totalReviews}</span>
                </div>
                {profile.yearsOfExperience && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Experience</span>
                    <span className="font-semibold text-gray-900">{profile.yearsOfExperience} years</span>
                  </div>
                )}
                {profile.serviceArea && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Service Area</span>
                    <span className="font-semibold text-gray-900 text-right max-w-[140px] truncate">{profile.serviceArea}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${avail.classes}`}>
                    {avail.label}
                  </span>
                </div>
                {profile.isApproved && (
                  <div className="flex items-center gap-2 pt-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Verified Professional</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact card */}
            <div className="bg-blue-600 rounded-xl p-6 text-white">
              <h3 className="font-bold text-lg mb-1">Ready to hire?</h3>
              <p className="text-blue-100 text-sm mb-5">
                Reach out directly via Telegram for a quick response.
              </p>
              {profile.telegramUsername ? (
                <a
                  href={`https://t.me/${profile.telegramUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Contact via Telegram
                </a>
              ) : (
                <p className="text-blue-200 text-sm italic">No contact info provided yet.</p>
              )}
            </div>

            {/* Back to listing */}
            <Link
              href="/handyman"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Browse All Handymen
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}