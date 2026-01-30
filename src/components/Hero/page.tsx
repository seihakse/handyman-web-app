export default function Hero() {
  return (
    <section
      className="relative h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(https://readdy.ai/api/search-image?query=modern%20home%20renovation%20scene&width=1920&height=1080)`,
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 h-full flex items-center px-4 max-w-7xl mx-auto">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Find Trusted Handymen Near You
          </h1>

          <p className="text-xl mb-8">
            Connect with skilled professionals for home repair & maintenance.
          </p>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="What service do you need?"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
                <i className="ri-search-line mr-2" />
                Find Handymen
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="bg-white/20 text-white border border-white/30 px-4 py-2 rounded-lg">
              Join as Customer
            </button>
            <button className="bg-white/20 text-white border border-white/30 px-4 py-2 rounded-lg">
              Join as Handyman
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
