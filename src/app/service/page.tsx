// src/app/services/page.tsx
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import { Card } from '@/components/ui/Card';
import {
  Droplets, Zap, Hammer, Thermometer, Wrench, Paintbrush,
  CheckCircle, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const allServices = [
  {
    id: 1,
    name: 'Plumbing Services',
    icon: <Droplets className="w-6 h-6" />,
    description: 'Professional plumbing repairs, installations, and maintenance for all your water-related needs.',
    services: ['Leak Repairs', 'Pipe Installation', 'Drain Cleaning', 'Faucet Replacement', 'Water Heater Service'],
    // Plumber working under sink with tools — clear, relevant
    image: 'https://plus.unsplash.com/premium_photo-1663045495725-89f23b57cfc5?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGx1bWJpbmclMjBzZXJ2aWNlc3xlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 2,
    name: 'Electrical Services',
    icon: <Zap className="w-6 h-6" />,
    description: 'Safe and reliable electrical installations, repairs, and upgrades by certified electricians.',
    services: ['Outlet Installation', 'Light Fixture Setup', 'Wiring Repairs', 'Panel Upgrades', 'Safety Inspections'],
    // Electrician working on panel/wiring
    image: 'https://img.magnific.com/free-photo/man-electrical-technician-working-switchboard-with-fuses_169016-24062.jpg?semt=ais_hybrid&w=740&q=80',
  },
  {
    id: 3,
    name: 'Carpentry & Woodwork',
    icon: <Hammer className="w-6 h-6" />,
    description: 'Custom carpentry solutions from furniture repair to built-in installations.',
    services: ['Furniture Repair', 'Cabinet Installation', 'Deck Building', 'Trim Work', 'Custom Shelving'],
    // Carpenter measuring and cutting wood
    image: 'https://img.magnific.com/free-photo/planing-board-workshop_1098-14709.jpg?semt=ais_hybrid&w=740&q=80',
  },
  {
    id: 4,
    name: 'Painting Services',
    icon: <Paintbrush className="w-6 h-6" />,
    description: 'Interior and exterior painting with premium materials and expert finishing techniques.',
    services: ['Interior Painting', 'Exterior Painting', 'Wall Preparation', 'Color Consultation', 'Touch-up Work'],
    // Painter with roller on wall — clean, bright
    image: 'https://images.akzonobel.com/akzonobel-flourish/dulux/hk/en/dulux-home-refresh-painting-service/dps-banner_2.jpg?impolicy=.auto',
  },
  {
    id: 5,
    name: 'Air Conditioning',
    icon: <Thermometer className="w-6 h-6" />,
    description: 'Heating, ventilation, and air conditioning installation, repair, and maintenance.',
    services: ['AC Repair', 'AC Installation', 'Duct Cleaning', 'Filter Replacement', 'System Maintenance'],
    // Technician servicing outdoor AC unit
    image: 'https://ambroseair.com/wp-content/uploads/2022/07/what-does-an-air-conditioning-service-consist-of-1080x675-1.jpg',
  },
  {
    id: 6,
    name: 'General Repairs',
    icon: <Wrench className="w-6 h-6" />,
    description: 'Quick fixes and general maintenance tasks to keep your home in perfect condition.',
    services: ['Door Repairs', 'Window Fixes', 'Drywall Patches', 'Caulking', 'Minor Installations'],
    // Handyman with toolbox doing home repair
    image: 'https://avalonpropertymanagement.net/user/pages/08.blog/property-maintenance-and-repairs/tenant-landlord-communication.jpg',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section
        className="relative py-24 bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1920&q=80)',
        }}
      >
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Professional Home Services
          </h1>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            From quick fixes to major installations — skilled, verified handymen ready to help across Phnom Penh and Kandal Province.
          </p>
          {/* <Link
            href="/handyman"
            className="inline-flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Find a Handyman <ArrowRight className="w-4 h-4" />
          </Link> */}
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What We Cover</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Professional solutions for every home improvement and repair need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allServices.map((service) => (
              <Card
                key={service.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-blue-600">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{service.name}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Includes
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {service.services.map((item, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 text-center">
            <p className="text-gray-500 mb-4">Ready to get started?</p>
            <Link
              href="/handyman"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Handymen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}