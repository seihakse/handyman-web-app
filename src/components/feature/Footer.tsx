
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: '"Pacifico", serif' }}>
              HandyPro
            </h3>
            <p className="text-gray-400 mb-4">
              Connect with skilled handymen in your area. Professional, reliable, and affordable home services at your fingertips.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <i className="ri-facebook-fill text-xl cursor-pointer hover:text-blue-400"></i>
              </div>
              <div className="w-8 h-8 flex items-center justify-center">
                <i className="ri-twitter-fill text-xl cursor-pointer hover:text-blue-400"></i>
              </div>
              <div className="w-8 h-8 flex items-center justify-center">
                <i className="ri-instagram-line text-xl cursor-pointer hover:text-blue-400"></i>
              </div>
            </div>
          </div>

          {/* <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer">Find Handymen</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer">Join as Handyman</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer">How it Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer">Safety</a></li>
              <li><a href="https://readdy.ai/?origin=logo" className="text-gray-400 hover:text-white cursor-pointer">Made with Readdy</a></li>
            </ul>
          </div> */}

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 HandyPro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}