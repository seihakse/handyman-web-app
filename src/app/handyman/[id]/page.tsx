// app/handyman/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Star, Shield, User, Wrench, Briefcase, IdCard, Award, Flag, MessageCircle, Phone, Mail, Instagram, Map, CheckCircle } from 'lucide-react';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import ReportModal from '@/components/feature/ReportModal';
import ReviewModal from '@/components/feature/ReviewModal';
import { useState } from 'react';

// Mock data for handyman profiles - in production, this would come from an API
const handymanProfiles: Record<string, any> = {
  'john-smith': {
    id: 'john-smith',
    name: 'John Smith',
    location: 'New York, NY',
    rating: 4.7,
    reviews: 128,
    status: 'Active',
    phone: '+1 (555) 123-4567',
    email: 'john.smith@example.com',
    instagram: '@johnsmith_plumbing',
    serviceArea: 'NYC and surrounding areas',
    profession: 'Plumber',
    experience: '8+ years',
    description: 'Licensed plumber with 8 years of experience specializing in residential and commercial plumbing services. Committed to providing quality work with excellent customer service.',
    aboutMe: "I'm a licensed plumber with over 8 years of experience in both residential and commercial plumbing. My expertise includes pipe installation and repair, fixture installation, water heater services, drain cleaning, and emergency plumbing services. I take pride in my work and always strive to provide the best service to my customers.",
    experienceDetail: '8+ years in plumbing & pipe fitting, certified master plumber.',
    skills: ['Plumbing Installation', 'Pipe Repair', 'Leak Detection', 'Water Heater Services', 'Drain Cleaning', 'Fixture Installation', 'Emergency Plumbing', 'Commercial Plumbing'],
    categories: ['Residential Plumbing', 'Commercial Plumbing', 'Emergency Services', 'Maintenance & Repair'],
    verified: true,
    reviews_list: [
      { name: 'Michael Johnson', date: 'March 15, 2023', rating: 5, text: 'John did an excellent job fixing our kitchen sink. He was prompt, professional, and explained everything clearly. Highly recommended!' },
      { name: 'Sarah Williams', date: 'February 28, 2023', rating: 5, text: 'Great service! Fixed our bathroom leak quickly and at a reasonable price. Will definitely contact John again for future plumbing needs.' },
      { name: 'Robert Chen', date: 'January 10, 2023', rating: 5, text: 'Professional and knowledgeable. Installed a new water heater and did a fantastic job. Clean work and great communication throughout the process.' }
    ]
  },
  'maria-garcia': {
    id: 'maria-garcia',
    name: 'Maria Garcia',
    location: 'Los Angeles, CA',
    rating: 5.0,
    reviews: 94,
    status: 'Active',
    phone: '+1 (555) 234-5678',
    email: 'maria.garcia@example.com',
    instagram: '@maria_electric',
    serviceArea: 'Los Angeles and surrounding areas',
    profession: 'Electrician',
    experience: '12+ years',
    description: 'Certified electrician with 12 years of experience. Expert in residential wiring, lighting, and electrical repairs.',
    aboutMe: "I'm a certified master electrician with over 12 years of experience. I specialize in residential and commercial electrical work, including wiring, lighting installation, panel upgrades, and electrical repairs. Safety and quality are my top priorities.",
    experienceDetail: '12+ years in electrical work, licensed master electrician.',
    skills: ['Electrical Wiring', 'Lighting Installation', 'Panel Upgrades', 'Electrical Repairs', 'Safety Inspections', 'Smart Home Setup', 'Ceiling Fans', 'Outlet Installation'],
    categories: ['Residential Electrical', 'Commercial Electrical', 'Emergency Repairs', 'Lighting Design'],
    verified: true,
    reviews_list: [
      { name: 'David Thompson', date: 'April 2, 2023', rating: 5, text: 'Maria did an amazing job rewiring our old house. Very professional and thorough!' },
      { name: 'Lisa Martinez', date: 'March 20, 2023', rating: 5, text: 'Fixed our lighting issue quickly. Great communication and fair pricing.' }
    ]
  },
  'robert-johnson': {
    id: 'robert-johnson',
    name: 'Robert Johnson',
    location: 'Chicago, IL',
    rating: 4.2,
    reviews: 76,
    status: 'Inactive',
    phone: '+1 (555) 345-6789',
    email: 'robert.johnson@example.com',
    instagram: '@robert_carpentry',
    serviceArea: 'Chicago metro area',
    profession: 'Carpenter',
    experience: '15+ years',
    description: 'Master carpenter with 15 years experience. Specializing in custom furniture, cabinetry, and home renovations.',
    aboutMe: "Master carpenter with 15 years of experience in custom woodworking, furniture making, and home renovations. I take pride in creating beautiful, functional pieces that last a lifetime.",
    experienceDetail: '15+ years in carpentry, master carpenter certification.',
    skills: ['Custom Furniture', 'Cabinetry', 'Home Renovations', 'Trim Work', 'Deck Building', 'Woodworking', 'Flooring Installation', 'Shelving'],
    categories: ['Residential Carpentry', 'Custom Furniture', 'Home Renovation', 'Cabinet Making'],
    verified: true,
    reviews_list: [
      { name: 'Emily Clark', date: 'February 10, 2023', rating: 4, text: 'Beautiful custom bookshelf! Robert is very skilled but took a bit longer than expected.' }
    ]
  },
  'sarah-wilson': {
    id: 'sarah-wilson',
    name: 'Sarah Wilson',
    location: 'Miami, FL',
    rating: 4.6,
    reviews: 203,
    status: 'Active',
    phone: '+1 (555) 456-7890',
    email: 'sarah.wilson@example.com',
    instagram: '@sarah_paints',
    serviceArea: 'Miami and surrounding areas',
    profession: 'Painter',
    experience: '10+ years',
    description: 'Professional painter with 10 years of experience. Expert in interior, exterior, and decorative painting services.',
    aboutMe: "Professional painter with over 10 years of experience transforming homes and businesses. I specialize in interior and exterior painting, decorative finishes, and color consultation.",
    experienceDetail: '10+ years in professional painting, EPA Lead-Safe certified.',
    skills: ['Interior Painting', 'Exterior Painting', 'Decorative Finishes', 'Color Consultation', 'Wallpaper Removal', 'Drywall Repair', 'Texture Application', 'Cabinet Painting'],
    categories: ['Residential Painting', 'Commercial Painting', 'Decorative Finishes', 'Exterior Services'],
    verified: true,
    reviews_list: [
      { name: 'James Wilson', date: 'March 1, 2023', rating: 5, text: 'Sarah transformed our living room! The color consultation was invaluable.' },
      { name: 'Patricia Brown', date: 'February 15, 2023', rating: 4.5, text: 'Great attention to detail. Will hire again for our exterior painting.' }
    ]
  }
};

export default function HandymanProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reportStatus, setReportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [reviewStatus, setReviewStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const handyman = handymanProfiles[id];

  const handleReportSubmit = async (reason: string, description: string) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          handymanId: handyman.id,
          handymanName: handyman.name,
          reason: reason,
          description: description,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      setReportStatus({
        type: 'success',
        message: 'Thank you for your report. Our team will review it shortly.'
      });

      setTimeout(() => setReportStatus(null), 5000);
    } catch (error) {
      console.error('Error submitting report:', error);
      setReportStatus({
        type: 'error',
        message: 'Failed to submit report. Please try again later.'
      });
      setTimeout(() => setReportStatus(null), 5000);
      throw error;
    }
  };

  const handleReviewSubmit = async (rating: number, reviewText: string, images?: File[]) => {
    try {
      const formData = new FormData();
      formData.append('handymanId', handyman.id);
      formData.append('handymanName', handyman.name);
      formData.append('rating', rating.toString());
      formData.append('reviewText', reviewText);
      
      if (images && images.length > 0) {
        images.forEach(image => {
          formData.append('images', image);
        });
      }
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to submit review');

      setReviewStatus({
        type: 'success',
        message: 'Thank you for your review! It helps our community.'
      });
      setTimeout(() => setReviewStatus(null), 5000);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      setReviewStatus({
        type: 'error',
        message: 'Failed to submit review. Please try again later.'
      });
      setTimeout(() => setReviewStatus(null), 5000);
      throw error;
    }
  };

  if (!handyman) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Handyman Not Found</h1>
          <p className="text-gray-600 mb-8">The handyman profile you're looking for doesn't exist.</p>
          <Link href="/handyman" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Back to Handymen
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Status Toasts */}
      {reportStatus && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className={`rounded-lg shadow-lg p-4 ${
            reportStatus.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${reportStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {reportStatus.message}
            </p>
          </div>
        </div>
      )}
      
      {reviewStatus && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className={`rounded-lg shadow-lg p-4 ${
            reviewStatus.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${reviewStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {reviewStatus.message}
            </p>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Top Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 min-w-[200px]">
              <div className="w-36 h-36 rounded-full overflow-hidden bg-blue-600 ring-4 ring-white shadow-lg">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(handyman.name)}&background=2563EB&color=fff&bold=true&size=144`}
                  alt={handyman.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  handyman.status === 'Active' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-500 text-white'
                }`}>
                  {handyman.status}
                </span>
              </div>
              <div className="space-y-3 w-full">
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">{handyman.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">{handyman.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Instagram className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">{handyman.instagram}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">{handyman.serviceArea}</span>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{handyman.name}</h1>
                {handyman.verified && (
                  <div className="bg-green-50 rounded-full px-3 py-1 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 text-xs font-medium">Verified</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{handyman.location}</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${
                      i < Math.floor(handyman.rating) 
                        ? "text-yellow-400 fill-yellow-400" 
                        : i < handyman.rating 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"
                    }`} />
                  ))}
                </div>
                <span className="font-bold text-gray-900">{handyman.rating}</span>
                <span className="text-gray-500">({handyman.reviews} reviews)</span>
              </div>
              <p className="text-gray-600 mb-4 max-w-xl">{handyman.description}</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition">
                <MessageCircle className="w-5 h-5" />
                <span>Contact via Telegram</span>
              </button>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Me Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-600">About Me</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">{handyman.aboutMe}</p>
              <p className="text-gray-700 font-semibold">
                <strong>Experience:</strong> {handyman.experienceDetail}
              </p>
            </div>

            {/* Services & Skills */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Wrench className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-600">Services & Skills</h2>
              </div>
              <p className="text-gray-600 mb-3">I specialize in the following services:</p>
              <div className="flex flex-wrap gap-2">
                {handyman.skills.map((skill: string, idx: number) => (
                  <span key={idx} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Service Categories */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-600">Service Categories</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {handyman.categories.map((category: string, idx: number) => (
                  <span key={idx} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Verification & Documents */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-600">Verification & Documents</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <IdCard className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-bold text-gray-900 mb-1">ID Verification</h4>
                  <span className="text-green-600 text-sm font-medium flex items-center justify-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <Award className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-bold text-gray-900 mb-1">Certificate</h4>
                  <span className="text-green-600 text-sm font-medium flex items-center justify-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-600">Customer Reviews</h2>
              </div>
              <div className="space-y-6">
                {handyman.reviews_list.map((review: any, idx: number) => (
                  <div key={idx} className={idx !== handyman.reviews_list.length - 1 ? 'border-b border-gray-100 pb-6' : ''}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-900">{review.name}</span>
                      <span className="text-gray-500 text-sm">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${
                          i < Math.floor(review.rating) 
                            ? "text-yellow-400 fill-yellow-400" 
                            : i < review.rating 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                        }`} />
                      ))}
                    </div>
                    <p className="text-gray-600">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-600">Rate This Handyman</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Have you worked with {handyman.name.split(' ')[0]}? Share your experience to help others.
              </p>
              <button 
                onClick={() => setIsReviewModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition mb-3"
              >
                <Star className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
              <button 
                onClick={() => setIsReportModalOpen(true)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Flag className="w-4 h-4" />
                <span>Report this handyman</span>
              </button>
            </div>

            {/* Trust & Safety Card */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-600">Trust & Safety</h2>
              </div>
              <p className="text-gray-600 text-sm">
                All verified professionals undergo background checks and credential validation. 
                HandyPro ensures reliable service. If you encounter any issues, please report them immediately.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        handymanName={handyman.name}
        handymanId={handyman.id}
        onSubmit={handleReportSubmit}
      />
      
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        handymanName={handyman.name}
        handymanId={handyman.id}
        onSubmit={handleReviewSubmit}
      />

      <Footer />
    </div>
  );
}