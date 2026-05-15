// app/handyman/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import {
  MapPin, Star, Shield, Wrench, Clock, ChevronLeft,
  Send, Award, Calendar, AlertCircle, CheckCircle,
  Loader2, Phone, Mail, Flag, MessageSquare,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: { name: string; profilePicture: string | null };
}

interface HandymanProfile {
  id: string;
  bio: string | null;
  skills: string | null;
  certificate: string | null;
  idCardImage: string | null;
  portfolioImage: string | null;
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  rating: number | null;
  totalReviews: number;
  isApproved: boolean;
  telegramUsername: string | null;
  yearsOfExperience: number | null;
  serviceArea: string | null;
  category: { id: string; name: string } | null;
  reviews: Review[];
}

interface HandymanData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profilePicture: string | null;
  address: string | null;
  createdAt: string;
  handymanProfile: HandymanProfile;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const availabilityConfig = {
  AVAILABLE:   { label: 'Active',   classes: 'bg-green-500 text-white border-green-500' },
  BUSY:        { label: 'Busy',     classes: 'bg-yellow-500 text-white border-yellow-500' },
  UNAVAILABLE: { label: 'Inactive', classes: 'bg-gray-400 text-white border-gray-400' },
};

function StarRow({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`${sz} ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
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

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Not Found</h2>
            <p className="text-gray-500 mb-6">This handyman profile doesn't exist or is not yet approved.</p>
            <Link href="/handyman" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Handymen
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

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="max-w-[1200px] mx-auto px-5 py-8 space-y-7">

        {/* Back link */}
        <Link href="/handyman" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Handymen
        </Link>

        {/* ── Profile header card ── */}
        <div className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] p-8">
          <div className="flex flex-col md:flex-row items-start gap-8">

            {/* Left: avatar + status + contact */}
            <div className="flex flex-col items-center gap-4 w-full md:w-[200px] shrink-0">
              <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] bg-blue-600">
                {data.profilePicture ? (
                  <img src={data.profilePicture} alt={data.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-5xl font-bold">
                    {data.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Status badges */}
              <div className="flex gap-2 flex-wrap justify-center">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${avail.classes}`}>
                  {avail.label}
                </span>
              </div>

              {/* Contact details */}
              <div className="w-full space-y-2.5 pt-1">
                {data.phone && (
                  <div className="flex items-center gap-2.5 text-[13.4px] text-slate-800">
                    <Phone className="w-[15px] h-[15px] text-blue-600 shrink-0" />
                    <span>{data.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-[13.7px] text-slate-800">
                  <Mail className="w-[15px] h-[15px] text-blue-600 shrink-0" />
                  <span className="truncate">{data.email}</span>
                </div>
                {profile.telegramUsername && (
                  <div className="flex items-center gap-2.5 text-[13.7px] text-slate-800">
                    <Send className="w-[14px] h-[14px] text-blue-600 shrink-0" />
                    <span>@{profile.telegramUsername}</span>
                  </div>
                )}
                {(profile.serviceArea || data.address) && (
                  <div className="flex items-center gap-2.5 text-[13.7px] text-slate-800">
                    <MapPin className="w-[11px] h-[15px] text-blue-600 shrink-0" />
                    <span>{profile.serviceArea || data.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: name, location, rating, bio, CTA */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[32px] font-bold text-slate-800 leading-[39px]">{data.name}</h1>
                {profile.isApproved && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100/80 rounded-full text-green-500 text-[13px] font-medium">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>

              {(profile.serviceArea || data.address) && (
                <div className="flex items-center gap-2 text-slate-500 text-[16.6px]">
                  <MapPin className="w-[14px] h-[18px]" />
                  <span>{profile.serviceArea || data.address}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <StarRow rating={rating} size="lg" />
                <span className="text-[16.1px] font-bold text-slate-800">{rating.toFixed(1)}</span>
                <span className="text-[15.1px] text-slate-500">({profile.totalReviews} reviews)</span>
                {profile.yearsOfExperience && (
                  <>
                    <span className="text-slate-300 mx-1">·</span>
                    <span className="flex items-center gap-1.5 text-slate-500 text-sm">
                      <Clock className="w-4 h-4" /> {profile.yearsOfExperience} yrs experience
                    </span>
                  </>
                )}
                <span className="text-slate-300 mx-1">·</span>
                <span className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <Calendar className="w-4 h-4" /> Joined {joined}
                </span>
              </div>

              {profile.bio && (
                <p className="text-[14.9px] text-slate-500 leading-[26px] max-w-[430px]">{profile.bio}</p>
              )}

              {profile.telegramUsername && (
                <div className="pt-1">
                  <a
                    href={`https://t.me/${profile.telegramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[12.8px] rounded-lg transition-colors"
                  >
                    <Send className="w-[13px] h-[14px]" />
                    Contact via Telegram
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-8">

            {/* About Me */}
            {profile.bio && (
              <div className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] p-6">
                <h2 className="flex items-center gap-2.5 text-[19.8px] font-bold text-blue-600 mb-1 pb-3 border-b border-gray-100">
                  <MessageSquare className="w-5 h-5" /> About Me
                </h2>
                <div className="pt-4 space-y-2">
                  <p className="text-[15px] text-slate-500 leading-[26px]">{profile.bio}</p>
                  {profile.yearsOfExperience && (
                    <p className="text-[15.4px] text-slate-500 leading-[26px]">
                      <strong>Experience:</strong> {profile.yearsOfExperience} years of professional service.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Services & Skills */}
            {skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] p-6">
                <h2 className="flex items-center gap-2.5 text-[20.6px] font-bold text-blue-600 mb-1 pb-3 border-b border-gray-100">
                  <Wrench className="w-5 h-5" /> Services &amp; Skills
                </h2>
                <p className="text-[14.9px] text-slate-500 mt-4 mb-4">I specialize in the following services:</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-blue-600/10 text-blue-600 rounded-full text-[14.8px] font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Service Category */}
            {profile.category && (
              <div className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] p-6">
                <h2 className="flex items-center gap-2.5 text-[20px] font-bold text-blue-600 mb-1 pb-3 border-b border-gray-100">
                  <Shield className="w-5 h-5" /> Service Categories
                </h2>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-4 py-2 bg-blue-600/10 text-blue-600 rounded-full text-[15px] font-medium">
                    {profile.category.name}
                  </span>
                </div>
              </div>
            )}

            {/* Verification & Documents */}
            {(profile.idCardImage || profile.certificate) && (
              <div className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] p-6">
                <h2 className="flex items-center gap-2.5 text-[20.2px] font-bold text-blue-600 mb-1 pb-3 border-b border-gray-100">
                  <Award className="w-5 h-5" /> Verification &amp; Documents
                </h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {profile.idCardImage && (
                    <div className="border border-slate-200 rounded-lg p-4 flex flex-col items-center gap-3 text-center">
                      <Award className="w-8 h-8 text-blue-600" />
                      <p className="text-[15.4px] font-bold text-slate-800">ID Verification</p>
                      <p className="text-[12.9px] font-medium text-green-500">Verified</p>
                    </div>
                  )}
                  {profile.certificate && (
                    <div className="border border-slate-200 rounded-lg p-4 flex flex-col items-center gap-3 text-center">
                      <Shield className="w-8 h-8 text-blue-600" />
                      <p className="text-[15.8px] font-bold text-slate-800">Certificate</p>
                      <p className="text-[12.9px] font-medium text-green-500">Verified</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Portfolio */}
            {profile.portfolioImage && (
              <div className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] p-6">
                <h2 className="flex items-center gap-2.5 text-[20px] font-bold text-blue-600 mb-1 pb-3 border-b border-gray-100">
                  <Award className="w-5 h-5" /> Portfolio
                </h2>
                <div className="rounded-lg overflow-hidden border border-gray-100 mt-4">
                  <img src={profile.portfolioImage} alt="Portfolio" className="w-full object-cover max-h-80" />
                </div>
              </div>
            )}

            {/* Customer Reviews */}
            <div className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] p-6">
              <h2 className="flex items-center gap-2.5 text-[20.3px] font-bold text-blue-600 mb-1 pb-3 border-b border-gray-100">
                <Star className="w-5 h-5" /> Customer Reviews
              </h2>
              {profile.reviews.length === 0 ? (
                <p className="text-slate-400 text-sm italic pt-4">No reviews yet.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {profile.reviews.map(review => (
                    <div key={review.id} className="py-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 overflow-hidden shrink-0">
                            {review.reviewer.profilePicture ? (
                              <img src={review.reviewer.profilePicture} alt={review.reviewer.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-blue-600 text-sm font-bold">
                                {review.reviewer.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-[15.6px] font-bold text-slate-800">{review.reviewer.name}</p>
                            <p className="text-[13.5px] text-slate-500">
                              {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <StarRow rating={review.rating} size="sm" />
                      {review.comment && (
                        <p className="text-[15px] text-slate-500 leading-[24px] mt-2">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>{/* end left column */}

          {/* Right sidebar */}
          <div className="w-full lg:w-[376px] shrink-0 space-y-6">

            {/* Rate & Report */}
            <div className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] p-6">
              <h3 className="flex items-center gap-2.5 text-[20.3px] font-bold text-blue-600 mb-1 pb-3 border-b border-gray-100">
                <Star className="w-5 h-5" /> Rate This Handyman
              </h3>
              <div className="space-y-3 pt-4">
                <p className="text-[15.1px] text-slate-500 leading-[26px]">
                  Have you worked with {data.name.split(' ')[0]}? Share your experience to help others.
                </p>
                <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[12.9px] rounded-lg transition-colors">
                  <MessageSquare className="w-[15px] h-[14px]" /> Write a Review
                </button>
                <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-[12.9px] rounded-lg transition-colors">
                  <Flag className="w-[14px] h-[14px]" /> Report this handyman
                </button>
              </div>
            </div>

            {/* At a Glance */}
            <div className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">At a Glance</h3>
              <div className="space-y-3">
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
                    <span className="font-semibold text-gray-900">{profile.yearsOfExperience} yrs</span>
                  </div>
                )}
                {profile.category && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Category</span>
                    <span className="font-semibold text-gray-900">{profile.category.name}</span>
                  </div>
                )}
                {profile.serviceArea && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Service Area</span>
                    <span className="font-semibold text-gray-900 text-right max-w-[160px] truncate">{profile.serviceArea}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${avail.classes}`}>
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
              <p className="text-blue-100 text-sm mb-4">Reach out directly via Telegram for a quick response.</p>
              {profile.telegramUsername ? (
                <a
                  href={`https://t.me/${profile.telegramUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Send className="w-4 h-4" /> Contact via Telegram
                </a>
              ) : (
                <p className="text-blue-200 text-sm italic">No contact info provided yet.</p>
              )}
            </div>

            {/* Back link */}
            <Link
              href="/handyman"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Browse All Handymen
            </Link>

          </div>{/* end sidebar */}

        </div>{/* end main grid */}
      </main>

      <Footer />
    </div>
  );
}