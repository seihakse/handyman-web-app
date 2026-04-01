// src/app/services/page.tsx

import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import { Button } from '@/components/ui/Button';
import { Card }from '@/components/ui/Card';
import { 
  Droplets, 
  Zap, 
  Hammer, 
  Paintbrush, 
  Thermometer, 
  Wrench, 
  Refrigerator, 
  SquareStack,
  MessageCircle,
  Clock,
  Shield,
  Users,
  CheckCircle
} from 'lucide-react';

export default function Services() {
  const allServices = [
    {
      id: 1,
      name: 'Plumbing Services',
      icon: <Droplets className="w-6 h-6" />,
      description: 'Professional plumbing repairs, installations, and maintenance for all your water-related needs.',
      services: ['Leak Repairs', 'Pipe Installation', 'Drain Cleaning', 'Faucet Replacement', 'Water Heater Service'],
      startingPrice: 75,
      image: 'https://readdy.ai/api/search-image?query=professional%20plumber%20working%20on%20modern%20bathroom%20pipes%20and%20fixtures%20clean%20bright%20workspace%20with%20plumbing%20tools%20and%20equipment%20contemporary%20home%20plumbing%20installation&width=400&height=300&seq=plumbing1&orientation=landscape'
    },
    {
      id: 2,
      name: 'Electrical Services',
      icon: <Zap className="w-6 h-6" />,
      description: 'Safe and reliable electrical installations, repairs, and upgrades by certified electricians.',
      services: ['Outlet Installation', 'Light Fixture Setup', 'Wiring Repairs', 'Panel Upgrades', 'Safety Inspections'],
      startingPrice: 85,
      image: 'https://readdy.ai/api/search-image?query=certified%20electrician%20installing%20modern%20electrical%20fixtures%20and%20outlets%20bright%20clean%20home%20interior%20with%20electrical%20tools%20and%20safety%20equipment%20professional%20electrical%20work&width=400&height=300&seq=electrical1&orientation=landscape'
    },
    {
      id: 3,
      name: 'Carpentry & Woodwork',
      icon: <Hammer className="w-6 h-6" />,
      description: 'Custom carpentry solutions from furniture repair to built-in installations.',
      services: ['Furniture Repair', 'Cabinet Installation', 'Deck Building', 'Trim Work', 'Custom Shelving'],
      startingPrice: 65,
      image: 'https://readdy.ai/api/search-image?query=skilled%20carpenter%20working%20on%20custom%20wood%20furniture%20and%20built-in%20shelving%20modern%20workshop%20with%20woodworking%20tools%20and%20materials%20beautiful%20craftsmanship%20and%20attention%20to%20detail&width=400&height=300&seq=carpentry1&orientation=landscape'
    },
    // {
    //   id: 4,
    //   name: 'Painting Services',
    //   icon: <Paintbrush className="w-6 h-6" />,
    //   description: 'Interior and exterior painting services with premium materials and expert techniques.',
    //   services: ['Interior Painting', 'Exterior Painting', 'Wall Preparation', 'Color Consultation', 'Touch-up Work'],
    //   startingPrice: 55,
    //   image: 'https://readdy.ai/api/search-image?query=professional%20painter%20applying%20fresh%20paint%20to%20modern%20home%20interior%20walls%20clean%20bright%20room%20with%20painting%20supplies%20and%20equipment%20high%20quality%20finish%20work&width=400&height=300&seq=painting1&orientation=landscape'
    // },
    {
      id: 5,
      name: 'HVAC Services',
      icon: <Thermometer className="w-6 h-6" />,
      description: 'Heating, ventilation, and air conditioning installation, repair, and maintenance.',
      services: ['AC Repair', 'Heating Installation', 'Duct Cleaning', 'Filter Replacement', 'System Maintenance'],
      startingPrice: 95,
      image: 'https://readdy.ai/api/search-image?query=HVAC%20technician%20servicing%20modern%20air%20conditioning%20system%20clean%20mechanical%20room%20with%20professional%20tools%20and%20equipment%20contemporary%20home%20climate%20control%20maintenance&width=400&height=300&seq=hvac1&orientation=landscape'
    },
    {
      id: 6,
      name: 'General Repairs',
      icon: <Wrench className="w-6 h-6" />,
      description: 'Quick fixes and general maintenance tasks to keep your home in perfect condition.',
      services: ['Door Repairs', 'Window Fixes', 'Drywall Patches', 'Caulking', 'Minor Installations'],
      startingPrice: 45,
      image: 'https://readdy.ai/api/search-image?query=handyman%20performing%20general%20home%20repairs%20and%20maintenance%20tasks%20bright%20clean%20home%20interior%20with%20various%20tools%20and%20repair%20equipment%20professional%20service%20quality&width=400&height=300&seq=repairs1&orientation=landscape'
    },
    // {
    //   id: 7,
    //   name: 'Appliance Installation',
    //   icon: <Refrigerator className="w-6 h-6" />,
    //   description: 'Professional installation and setup of home appliances with warranty coverage.',
    //   services: ['Washer/Dryer Setup', 'Dishwasher Installation', 'Refrigerator Connection', 'Oven Installation', 'Microwave Mounting'],
    //   startingPrice: 80,
    //   image: 'https://readdy.ai/api/search-image?query=technician%20installing%20modern%20kitchen%20appliances%20in%20contemporary%20home%20clean%20bright%20kitchen%20with%20professional%20installation%20tools%20and%20equipment%20high-end%20appliances&width=400&height=300&seq=appliance1&orientation=landscape'
    // },
    // {
    //   id: 8,
    //   name: 'Flooring Services',
    //   icon: <SquareStack className="w-6 h-6" />,
    //   description: 'Expert flooring installation, repair, and refinishing for all types of surfaces.',
    //   services: ['Hardwood Installation', 'Tile Work', 'Carpet Installation', 'Floor Refinishing', 'Subfloor Repairs'],
    //   startingPrice: 70,
    //   image: 'https://readdy.ai/api/search-image?query=flooring%20specialist%20installing%20beautiful%20hardwood%20floors%20in%20modern%20home%20interior%20professional%20tools%20and%20materials%20high%20quality%20craftsmanship%20and%20attention%20to%20detail&width=400&height=300&seq=flooring1&orientation=landscape'
    // }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://readdy.ai/api/search-image?query=professional%20handyman%20services%20showcase%20with%20various%20tools%20and%20equipment%20modern%20home%20renovation%20and%20repair%20work%20bright%20clean%20workspace%20with%20skilled%20technicians&width=1920&height=600&seq=serviceshero&orientation=landscape)'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Professional Home Services
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            From quick fixes to major installations, our skilled professionals provide reliable, high-quality services for all your home improvement needs.
          </p>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional solutions for every home improvement need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allServices.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                  
                </div>
                
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <div className="text-blue-600">
                        {service.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{service.name}</h3>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Services Include:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {service.services.map((item, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center">
                    <Users className="w-5 h-5 mr-2" />
                    Go to Handyman
                  </Button> */}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

