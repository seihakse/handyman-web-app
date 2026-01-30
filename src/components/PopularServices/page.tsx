'use client'

import services from "@/lib/mocks/services"

// Map service IDs to emojis (quick fix without changing data)
const serviceIcons: Record<string, string> = {
  plumbing: "🔧",
  electrical: "⚡",
  carpentry: "🔨",
  painting: "🎨",
  hvac: "🌡️",
  repairs: "🛠️",
  appliance: "🏠",
  landscaping: "🌱"
}

// Service counts
const serviceCounts: Record<string, number> = {
  plumbing: 45,
  electrical: 38,
  carpentry: 52,
  painting: 41,
  hvac: 27,
  repairs: 67,
  appliance: 33,
  landscaping: 29
}

// Service colors
const serviceColors: Record<string, string> = {
  plumbing: "bg-blue-100 text-blue-600",
  electrical: "bg-yellow-100 text-yellow-600",
  carpentry: "bg-amber-100 text-amber-600",
  painting: "bg-purple-100 text-purple-600",
  hvac: "bg-red-100 text-red-600",
  repairs: "bg-gray-100 text-gray-600",
  appliance: "bg-green-100 text-green-600",
  landscaping: "bg-emerald-100 text-emerald-600"
}

export default function PopularServices() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Popular Services
      </h2>
      <p className="text-xl text-gray-600 text-center mb-12">
        Choose from a wide range of professional services
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {services.map((service) => {
          const icon = serviceIcons[service.id] || "🔧"
          const count = serviceCounts[service.id] || 0
          const colorClass = serviceColors[service.id] || "bg-blue-100 text-blue-600"
          
          return (
            <div
              key={service.id}
              className="bg-white border border-gray-200 shadow-sm p-6 rounded-lg text-center hover:shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`${colorClass} w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4`}>
                <span className="text-2xl">{icon}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{service.subtitle}</p>
              <div className="text-xs text-gray-600 bg-gray-50 rounded-full px-3 py-1 inline-block">
                {count} available
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}