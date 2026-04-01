// src/app/handyman/page.tsx
import { MapPin, Star, Clock, MessageCircle, User, Shield, Wrench, Zap, Hammer, Paintbrush, Search, CheckCircle, Award, ThumbsUp } from 'lucide-react';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';

const handymen = [
  {
    name: "John Smith",
    location: "New York, NY",
    rating: 4.7,
    reviews: 128,
    status: "Active Now",
    statusColor: "bg-green-500",
    image: "J",
    profession: "Plumber",
    experience: "8 years",
    description: "Licensed plumber with 8 years of experience. Specializing in pipe repairs, installations, and emergency services.",
    skills: ["Plumbing", "Pipe Repair", "Installation", "Emergency"],
    verified: true
  },
  {
    name: "Maria Garcia",
    location: "Los Angeles, CA",
    rating: 5.0,
    reviews: 94,
    status: "Active Now",
    statusColor: "bg-green-500",
    image: "M",
    profession: "Electrician",
    experience: "12 years",
    description: "Certified electrician with 12 years of experience. Expert in residential wiring, lighting, and electrical repairs.",
    skills: ["Electrical", "Wiring", "Lighting", "Repairs"],
    verified: true
  },
  {
    name: "Robert Johnson",
    location: "Chicago, IL",
    rating: 4.2,
    reviews: 76,
    status: "Currently Unavailable",
    statusColor: "bg-gray-500",
    image: "R",
    profession: "Carpenter",
    experience: "15 years",
    description: "Master carpenter with 15 years experience. Specializing in custom furniture, cabinetry, and home renovations.",
    skills: ["Carpentry", "Furniture", "Cabinetry", "Renovations"],
    verified: true
  },
  {
    name: "Sarah Wilson",
    location: "Miami, FL",
    rating: 4.6,
    reviews: 203,
    status: "Active Now",
    statusColor: "bg-green-500",
    image: "S",
    profession: "Painter",
    experience: "10 years",
    description: "Professional painter with 10 years of experience. Expert in interior, exterior, and decorative painting services.",
    skills: ["Painting", "Interior", "Exterior", "Decorative"],
    verified: true
  }
];

const categories = ["Electrical", "Plumbing", "Carpentry", "Painting"];

const stats = [
  { number: "500+", label: "Verified Professionals" },
  { number: "4.8", label: "Average Rating" },
  { number: "10,000+", label: "Jobs Completed" },
  { number: "98%", label: "Customer Satisfaction" }
];

export default function HandymanPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center py-20 md:py-32"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://t4.ftcdn.net/jpg/01/78/14/57/360_F_178145745_oDRli4ickV2rfj7gJxN1rWd6wfN3OJy2.jpg)',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Our Handyman</h1>
          <p className="text-xl text-gray-200 max-w-3xl">
            Getting professional home services has never been easier. Please find and connect with trusted handymen in your area.
          </p>
        </div>
      </section>


      {/* Handyman Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                Browse by Category
              </h2>
              <p className="text-gray-600">
                Find handymen specializing in your specific needs
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-medium text-gray-900">125 Handymen Available</p>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mt-6 py-8">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
              <Hammer className="w-4 h-4 mr-2" />
              All Services
            </button>
            {categories.map((category, index) => {
              const icons = [Zap, Wrench, Hammer, Paintbrush];
              const Icon = icons[index];
              return (
                <button
                  key={index}
                  className="px-6 py-3 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category}
                </button>
              );
            })}
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {handymen.map((handyman, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Profile Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Replace the empty div with this */}
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(handyman.name)}&background=3B82F6&color=fff&bold=true&size=64`}
                        alt={handyman.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{handyman.name}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{handyman.location}</span>
                      </div>
                    </div>
                  </div>
                  {/* <div className={`${handyman.statusColor} w-6 h-6 rounded-full flex items-center justify-center`}>
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div> */}
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    handyman.status === "Active Now" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {handyman.status}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center mt-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${
                        i < Math.floor(handyman.rating) 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"
                      }`} />
                    ))}
                  </div>
                  <span className="ml-2 font-bold text-gray-900">{handyman.rating}</span>
                  <span className="ml-2 text-gray-600">({handyman.reviews} reviews)</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    About
                  </h4>
                  <p className="text-gray-600 text-sm">{handyman.description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                    <Wrench className="w-4 h-4 mr-2" />
                    Services
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {handyman.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {handyman.verified && (
                  <div className="flex items-center text-green-600 mb-6">
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Verified Professional</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-6 pt-0">
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center transition-colors">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact
                  </button>
                  <button className="bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium py-3 rounded-lg border border-gray-200 flex items-center justify-center transition-colors">
                    <User className="w-4 h-4 mr-1" />
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">
            Load More Handymen
          </button>
        </div>
      </div>


      {/* Footer */}
      <Footer />
    </div>
  );
}