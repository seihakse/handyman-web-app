// src/app/process/page.tsx
import { Search, Users, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import Link from 'next/link';

const steps = [
  {
    number: '1',
    title: 'Find Your Nearest Handyman',
    description:
      'Browse our platform to find the service you need. Filter by category, location, and service area across Phnom Penh and Kandal Province.',
    icon: <Search className="w-7 h-7 text-blue-600" />,
    features: [
      'Filter by service category',
      'Filter by district or area',
      'View ratings and reviews',
      'See verified profiles',
    ],
    // Person browsing on laptop / phone — search/discovery context
    image: 'https://images.ctfassets.net/vwt5n1ljn95x/7xOIcLPo1FIXKXzr7FNOfU/ae9a63ccbf7bde6063532f35eb256bed/Handyman.png?w=3840&q=75&fm=webp',
  },
  {
    number: '2',
    title: 'Choose the Right Handyman',
    description:
      'Compare profiles, read customer reviews, and check skills and experience to pick the handyman that best fits your job.',
    icon: <Users className="w-7 h-7 text-blue-600" />,
    features: [
      'View full handyman profiles',
      'Read verified customer reviews',
      'Check skills and experience',
      'See ID and certificate verification',
    ],
    // Person reviewing/comparing options on a tablet or reviewing documents
    image: 'https://icaschool.com/wp-content/uploads/2023/11/ica-blog-hero-how-a-handyman-can-add-home-inspection.jpg',
  },
  {
    number: '3',
    title: 'Contact via Telegram',
    description:
      'Tap the Telegram button on any profile to open a direct chat with a pre-filled message. Discuss the job, schedule, and pricing in real time.',
    icon: <MessageCircle className="w-7 h-7 text-blue-600" />,
    features: [
      'One-tap Telegram contact',
      'Pre-filled opening message',
      'Share photos of the problem',
      'Agree on timing and price',
    ],
    // Person messaging on phone — clear mobile chat context
    image: 'https://static0.makeuseofimages.com/wordpress/wp-content/uploads/2022/09/Delete-Contacts-on-Telegram.jpg?w=1600&h=900&fit=crop',
  },
  {
    number: '4',
    title: 'Get the Job Done',
    description:
      'Your handyman arrives, completes the work professionally, and ensures you\'re fully satisfied. Leave a review to help others.',
    icon: <CheckCircle className="w-7 h-7 text-blue-600" />,
    features: [
      'Professional on-site work',
      'Quality and clean finish',
      'Rate and review your experience',
      'Report issues if any arise',
    ],
    // Handyman completing repair work — tools, home repair context
    image: 'https://quotefancy.com/media/wallpaper/3840x2160/8045556-Get-things-done-Wallpaper.jpg',
  },
];

const faqs = [
  {
    question: 'How long does it take to find a handyman?',
    answer:
      'Most customers connect with a handyman within minutes by contacting them directly via Telegram. You can message multiple handymen at once to find the earliest available.',
  },
  {
    question: 'Are all handymen verified?',
    answer:
      'Yes. Every handyman on HandyPro goes through an approval process. Profiles marked Verified have submitted ID and/or certificates which our admin team reviews before approval.',
  },
  {
    question: 'What if I\'m not satisfied with the work?',
    answer:
      'You can report the handyman directly from their profile. Our admin team reviews all reports and will take action — including warnings, suspension, or bans — depending on the severity.',
  },
  {
    question: 'How do payments work?',
    answer:
      'Payments are arranged directly between you and the handyman via Telegram. HandyPro does not process payments — this keeps things flexible and lets you agree on the best method for your job.',
  },
  {
    question: 'Can I leave a review after the job?',
    answer:
      'Absolutely. Visit the handyman\'s profile and click "Write a Review" to share your experience, rating, and optional photos. Reviews help other customers make better decisions.',
  },
];

export default function ProcessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section
        className="relative py-24 bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.58), rgba(0,0,0,0.58)), url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1920&q=80)',
        }}
      >
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">How HandyPro Works</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Find, contact, and hire a trusted handyman in 4 simple steps — no middlemen, no waiting rooms.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">4 Simple Steps</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              From browsing to job done — here's exactly how it works
            </p>
          </div>

          <div className="space-y-20">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-10 items-center`}
              >
                {/* Text */}
                <div className="lg:w-1/2 space-y-5">
                  {/* Step badge + icon */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-md shrink-0">
                      {step.icon}
                      {/* override icon color to white inside blue bg */}
                      <style>{`.step-icon-${index} svg { color: white !important; }`}</style>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                        Step {step.number}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 leading-tight">{step.title}</h3>
                    </div>
                  </div>

                  <p className="text-gray-500 text-[16px] leading-relaxed">{step.description}</p>

                  <ul className="space-y-2.5">
                    {step.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700 text-[15px]">
                        <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <span className="w-2 h-2 rounded-full bg-green-500 block" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image */}
                <div className="lg:w-1/2 w-full">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg h-72 lg:h-[360px]">
                    <img
                      src={step.image}
                      alt={`Step ${step.number}: ${step.title}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Step number overlay */}
                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow">
                      Step {step.number}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-14 bg-blue-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to get started?</h2>
          <p className="text-blue-100 mb-7 text-lg">
            Browse verified handymen in your area and get your job done today.
          </p>
          <Link
            href="/handyman"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Find a Handyman <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-500">Common questions about how HandyPro works</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-[16.5px] font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-500 text-[15px] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}