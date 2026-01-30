// src/app/process/page.tsx
import { MessageSquare, Users, ClipboardCheck, Phone, Calendar, CheckCircle, Search, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';

const stepImages = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", // Step 1: Request service
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", // Step 2: Get matched with professionals
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", // Step 3: Compare and choose
  "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", // Step 4: Communicate directly

];

const steps = [
  {
    number: "1",
    title: "Find Your Service",
    description: "Browse our website to find the handyman service you need. View categories, check service descriptions, and understand what we offer.",
    icon: <Search className="w-8 h-8 text-blue-600" />,
    features: [
      "Browse service categories",
      "Check service descriptions",
      "View example projects",
      "Understand pricing models"
    ]
  },
  {
    number: "2",
    title: "Choose the Right Handyman",
    description: "Select from handymen that match your specific problem. Compare skills, ratings, and reviews to make the best choice.",
    icon: <Users className="w-8 h-8 text-blue-600" />,
    features: [
      "View handyman profiles",
      "Check skills and specialties",
      "Read customer reviews",
      "Compare experience levels"
    ]
  },
  {
    number: "3",
    title: "Contact via Telegram",
    description: "Connect directly with your chosen handyman through Telegram to discuss details, schedule, and get your project started.",
    icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
    features: [
      "Direct Telegram messaging",
      "Discuss project specifics",
      "Share photos instantly",
      "Get quick responses"
    ]
  },
  {
    number: "4",
    title: "Get the Job Done",
    description: "Your handyman arrives, completes the work professionally, and ensures you're satisfied with the results.",
    icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
    features: [
      "Professional work completion",
      "Timely project delivery",
      "Quality assurance",
      "Customer satisfaction"
    ]
  }
];

const guarantees = [
  {
    title: "Safe & Secure",
    description: "All payments are processed securely, and all handymen are background-checked and verified."
  },
  {
    title: "Quality Guaranteed",
    description: "We stand behind every job with our satisfaction guarantee and professional standards."
  },
  {
    title: "Transparent Pricing",
    description: "No hidden fees or surprise charges. Know exactly what you'll pay before work begins."
  },
  {
    title: "Customer Support",
    description: "24/7 customer support to help with any questions or concerns throughout the process."
  }
];

const faqs = [
  {
    question: "How long does it take to find a handyman?",
    answer: "Most customers get responses within 24 hours. For urgent repairs, we offer same-day matching with available professionals in your area."
  },
  {
    question: "Are all handymen background-checked?",
    answer: "Yes, all professionals on our platform undergo thorough background checks and verification processes to ensure your safety and peace of mind."
  },
  {
    question: "What if I'm not satisfied with the work?",
    answer: "We offer a satisfaction guarantee. If you're not happy with the completed work, contact our support team and we'll work to resolve the issue or arrange for corrections."
  },
  {
    question: "How do payments work?",
    answer: "Payments are processed securely through our platform. You only pay after the work is completed to your satisfaction. We accept all major credit cards and digital payment methods."
  }
];

export default function ProcessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-bold text-white mb-4">How HandyPro Works</h1>
          <p className="text-xl text-gray-200 max-w-3xl">
            Getting professional home services has never been easier. Follow our simple 6-step process to connect with trusted handymen in your area.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Steps to Success</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From posting your project to getting it completed - here's how it works
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}>
                <div className="lg:w-1/2">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        {step.icon}
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Step {step.number}</span>
                      <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{step.description}</p>
                  <ul className="space-y-3">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <div className="relative rounded-xl overflow-hidden shadow-lg h-80 lg:h-96">
                    <Image 
                      src={stepImages[index]}
                      alt={`Step ${step.number}: ${step.title}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold shadow-lg">
                      Step {step.number}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Customers Love HandyPro</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with your peace of mind and satisfaction in focus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {guarantees.map((guarantee, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{guarantee.title}</h3>
                <p className="text-gray-600">{guarantee.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about our process
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}