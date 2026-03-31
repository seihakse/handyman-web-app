import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import Header from '@/components/feature/Header'
import { Input } from '@/components/forms/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  Wrench, 
  Zap, 
  Hammer, 
  Paintbrush, 
  Thermometer, 
  Home as HomeIcon, 
  Sprout,
  Search,
  Shield,
  Clock,
  Star,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  User
} from 'lucide-react'
import Footer from '@/components/feature/Footer'

export default function Home() {
  const services = [
    { name: 'Plumbing', icon: <Wrench className="h-6 w-6" />, count: 45, color: 'bg-blue-100 text-blue-600' },
    { name: 'Electrical', icon: <Zap className="h-6 w-6" />, count: 38, color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Carpentry', icon: <Hammer className="h-6 w-6" />, count: 52, color: 'bg-amber-100 text-amber-600' },
    { name: 'Painting', icon: <Paintbrush className="h-6 w-6" />, count: 41, color: 'bg-purple-100 text-purple-600' },
    { name: 'HVAC', icon: <Thermometer className="h-6 w-6" />, count: 27, color: 'bg-red-100 text-red-600' },
    { name: 'Appliance Repair', icon: <Wrench className="h-6 w-6" />, count: 33, color: 'bg-green-100 text-green-600' },
    { name: 'Landscaping', icon: <Sprout className="h-6 w-6" />, count: 29, color: 'bg-emerald-100 text-emerald-600' },
    { name: 'General Repairs', icon: <Wrench className="h-6 w-6" />, count: 67, color: 'bg-gray-100 text-gray-600' },
  ]

  const handymen = [
    {
      name: 'John Smith',
      rating: 4.9,
      reviews: 127,
      location: 'Downtown Area',
      description: 'Experienced handyman with 8+ years in residential repairs and maintenance.',
      skills: ['Plumbing', 'Electrical', 'Carpentry'],
      responseTime: 'Usually responds within 1 hour',
      status: 'available',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      name: 'Maria Garcia',
      rating: 4.8,
      reviews: 89,
      location: 'North Side',
      description: 'Specializing in interior painting and home improvement projects.',
      skills: ['Painting', 'Drywall', 'Home Repairs'],
      responseTime: 'Usually responds within 30 minutes',
      status: 'available',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      name: 'David Chen',
      rating: 4.7,
      reviews: 156,
      location: 'East District',
      description: 'Licensed electrician and HVAC technician serving residential clients.',
      skills: ['HVAC', 'Electrical', 'Appliance Repair'],
      responseTime: 'Usually responds within 2 hours',
      status: 'busy',
      statusColor: 'bg-orange-100 text-orange-800'
    },
    {
      name: 'Sarah Johnson',
      rating: 4.9,
      reviews: 203,
      location: 'West End',
      description: 'Skilled carpenter specializing in custom furniture and home organization.',
      skills: ['Carpentry', 'Furniture Assembly', 'Shelving'],
      responseTime: 'Usually responds within 45 minutes',
      status: 'available',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      name: 'Mike Rodriguez',
      rating: 4.6,
      reviews: 78,
      location: 'South Bay',
      description: 'Licensed plumber with expertise in residential plumbing solutions.',
      skills: ['Plumbing', 'Bathroom Repairs', 'Kitchen Fixes'],
      responseTime: 'Usually responds within 1 hour',
      status: 'available',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      name: 'Lisa Williams',
      rating: 4.8,
      reviews: 134,
      location: 'Central City',
      description: 'Versatile handywoman offering comprehensive home maintenance services.',
      skills: ['General Repairs', 'Maintenance', 'Landscaping'],
      responseTime: 'Usually responds within 20 minutes',
      status: 'available',
      statusColor: 'bg-green-100 text-green-800'
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center py-20 md:py-32"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://t4.ftcdn.net/jpg/03/23/15/19/360_F_323151985_oLkiWe9GF7P9QNvhU9V1DldoZ3OFQrR4.jpg)',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Find Trusted Handymen Near You
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Connect with skilled professionals for all your home repair and maintenance needs. 
              Book instantly, pay securely, and rate your experience.
            </p>
            
            {/* Search Box */}
            {/* <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="What service do you need?"
                      className="pl-10 bg-white/90 border-gray-300"
                    />
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg">
                  Find Handymen
                </Button>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Services Section */}
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
                  <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.count} available</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose HandyPro?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Professionals</h3>
              <p className="text-gray-600">All handymen are background-checked and verified for your safety.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quick Service</h3>
              <p className="text-gray-600">Get connected with available handymen in your area within minutes.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Guaranteed</h3>
              <p className="text-gray-600">Rate and review services to maintain high quality standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Handymen Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Rated Handymen</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet our most trusted and skilled professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {handymen.map((handyman, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    {/* Replace the empty div with this */}
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(handyman.name)}&background=3B82F6&color=fff&bold=true&size=64`}
                        alt={handyman.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900">{handyman.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${handyman.statusColor}`}>
                          {handyman.status.charAt(0).toUpperCase() + handyman.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm font-medium">{handyman.rating}</span>
                        <span className="ml-2 text-sm text-gray-600">({handyman.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {handyman.location}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{handyman.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {handyman.skills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-3 mb-4">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Contact
                    </Button>
                    <Button variant="outline" className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50">
                      View Profile
                    </Button>
                  </div>
                  
                  {/* <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {handyman.responseTime}
                  </div> */}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8">
              View All Handymen
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}