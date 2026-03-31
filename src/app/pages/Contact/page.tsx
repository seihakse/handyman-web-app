// // src/app/contact/page.tsx
// // src/app/contact/page.tsx
// import { Mail, Phone, Clock, MessageSquare, Send } from 'lucide-react';
// import Footer from '@/components/feature/Footer'; 
// import Header from '@/components/feature/Header';

// const contactMethods = [
//   {
//     title: "Customer Support",
//     description: "Get help with your account, bookings, or general questions",
//     email: "support@handypro.com",
//     availability: "24/7 Available",
//     icon: <MessageSquare className="w-8 h-8 text-blue-600" />
//   },
//   {
//     title: "Business Inquiries",
//     description: "Partnership opportunities and business-related questions",
//     email: "business@handypro.com",
//     availability: "Mon-Fri, 9AM-6PM EST",
//     icon: <Mail className="w-8 h-8 text-blue-600" />
//   },
//   {
//     title: "Technical Support",
//     description: "Help with app issues, technical problems, or bugs",
//     email: "tech@handypro.com",
//     availability: "Mon-Fri, 8AM-8PM EST",
//     icon: <Phone className="w-8 h-8 text-blue-600" />
//   },
//   {
//     title: "Press & Media",
//     description: "Media inquiries, press releases, and PR requests",
//     email: "press@handypro.com",
//     availability: "Mon-Fri, 9AM-5PM EST",
//     icon: <Clock className="w-8 h-8 text-blue-600" />
//   }
// ];

// const faqs = [
//   {
//     question: "What are your customer support hours?",
//     answer: "Our customer support team is available 24/7 to help with urgent issues. For general inquiries, our extended team is available Monday through Friday, 8AM to 8PM EST."
//   },
//   {
//     question: "How quickly do you respond to messages?",
//     answer: "We aim to respond to all customer inquiries within 24 hours. Urgent support requests are typically addressed within 2-4 hours during business hours."
//   },
//   {
//     question: "Can I schedule a phone call with support?",
//     answer: "Yes! For complex issues or business inquiries, we can schedule a phone call. Please mention your preferred time in your message and we'll coordinate with you."
//   },
//   {
//     question: "Do you offer live chat support?",
//     answer: "Currently, we provide support through email and phone. We're working on implementing live chat functionality to better serve our customers in real-time."
//   }
// ];

// export default function ContactPage() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       {/* Hero Section */}
//       <section className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800">
//         <div className="absolute inset-0 bg-black/40" />
//         <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
//           <h1 className="text-5xl font-bold text-white mb-4">Get in Touch</h1>
//           <p className="text-xl text-gray-200 max-w-3xl">
//             Have questions? Need help? Want to join our platform? We're here to help and would love to hear from you.
//           </p>
//         </div>
//       </section>

//       {/* Contact Methods */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">How Can We Help?</h2>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Choose the best way to reach us based on your needs
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {contactMethods.map((method, index) => (
//               <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
//                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                   {method.icon}
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">{method.title}</h3>
//                 <p className="text-gray-600 text-center text-sm mb-4">{method.description}</p>
//                 <div className="text-center">
//                   <a 
//                     href={`mailto:${method.email}`} 
//                     className="text-blue-600 font-medium hover:text-blue-800 block mb-2"
//                   >
//                     {method.email}
//                   </a>
//                   <p className="text-sm text-gray-500">{method.availability}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Contact Form */}
//       <section className="py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto">
//             <div className="text-center mb-12">
//               <h2 className="text-4xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
//               <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//                 Fill out the form below and we'll get back to you within 24 hours
//               </p>
//             </div>

//             <form className="bg-white rounded-lg shadow-lg p-8">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 <div>
//                   <label className="block text-gray-700 text-sm font-medium mb-2">
//                     Full Name *
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter your full name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 text-sm font-medium mb-2">
//                     Email Address *
//                   </label>
//                   <input
//                     type="email"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter your email"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 <div>
//                   <label className="block text-gray-700 text-sm font-medium mb-2">
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter your phone number"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 text-sm font-medium mb-2">
//                     Inquiry Type
//                   </label>
//                   <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//                     <option>General Question</option>
//                     <option>Technical Support</option>
//                     <option>Business Inquiry</option>
//                     <option>Press/Media</option>
//                     <option>Other</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <label className="block text-gray-700 text-sm font-medium mb-2">
//                   Subject *
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Brief description of your inquiry"
//                 />
//               </div>

//               <div className="mb-6">
//                 <label className="block text-gray-700 text-sm font-medium mb-2">
//                   Message
//                 </label>
//                 <textarea
//                   rows={6}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                   placeholder="Please provide details about your inquiry..."
//                   maxLength={500}
//                 />
//                 <p className="text-sm text-gray-500 mt-2">0/500 characters</p>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-lg flex items-center justify-center transition-colors"
//               >
//                 <Send className="w-5 h-5 mr-2" />
//                 Send Message
//               </button>
//             </form>
//           </div>
//         </div>
//       </section>

//       {/* FAQ Section */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto">
//             <div className="text-center mb-12">
//               <h2 className="text-4xl font-bold text-gray-900 mb-4">Quick Answers</h2>
//               <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//                 Find answers to the most commonly asked questions
//               </p>
//             </div>

//             <div className="space-y-6">
//               {faqs.map((faq, index) => (
//                 <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
//                   <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
//                   <p className="text-gray-600">{faq.answer}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>
//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }