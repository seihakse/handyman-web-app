// app/terms/page.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using HandyPro's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Services Description</h2>
              <p>HandyPro connects customers with skilled handymen for various home services. We provide a platform for users to request services, communicate with service providers, and process payments.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
              <p>To use our services, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Customer Responsibilities</h2>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Provide accurate and complete information about service requests</li>
                <li>Ensure safe access to the service location</li>
                <li>Pay for services as agreed upon</li>
                <li>Treat handymen with respect and professionalism</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Handyman Responsibilities</h2>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Perform services with professional skill and care</li>
                <li>Arrive on time for scheduled appointments</li>
                <li>Communicate clearly with customers</li>
                <li>Maintain required licenses and insurance</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Payments and Fees</h2>
              <p>Service prices are determined by handymen and agreed upon before work begins. HandyPro may charge service fees that will be disclosed before confirmation. All payments are processed securely through our platform.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cancellations and Refunds</h2>
              <p>Customers may cancel appointments with at least 24 hours notice. Cancellations with less notice may incur a fee. Refunds are handled on a case-by-case basis and depend on the circumstances.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
              <p>HandyPro is not liable for any damages arising from services provided by handymen. We are not responsible for the quality of work performed or for any disputes between users.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Termination</h2>
              <p>We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or misuse our services.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact</h2>
              <p>For questions about these Terms of Service, contact us at:</p>
              <p className="mt-2">Email: legal@handypro.com</p>
              <p>Phone: 092724724</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}