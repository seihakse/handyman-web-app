// src/data/services.ts -> /mocks/services.ts
export type Service = {
  id: string;
  title: string;
  subtitle?: string;
  price?: string;
  img: string;
  items: string[];
};

const services: Service[] = [
  {
    id: "plumbing",
    title: "Plumbing Services",
    subtitle: "Starting at $75/hr",
    price: "$75/hr",
    img:
      "https://readdy.ai/api/search-image?query=professional%20plumber%20working%20on%20modern%20bathroom&width=800&height=600",
    items: ["Leak Repairs", "Pipe Installation", "Drain Cleaning", "Faucet Replacement", "Water Heater Service"],
  },
  {
    id: "electrical",
    title: "Electrical Work",
    subtitle: "Starting at $85/hr",
    price: "$85/hr",
    img:
      "https://readdy.ai/api/search-image?query=certified%20electrician%20installing%20fixtures&width=800&height=600",
    items: ["Outlet Installation","Light Fixture Setup","Wiring Repairs","Panel Upgrades","Safety Inspections"],
  },
  {
    id: "carpentry",
    title: "Carpentry & Woodwork",
    subtitle: "Starting at $65/hr",
    price: "$65/hr",
    img:
      "https://readdy.ai/api/search-image?query=skilled%20carpenter%20working%20on%20custom%20wood%20furniture&width=800&height=600",
    items: ["Furniture Repair","Cabinet Installation","Deck Building","Trim Work","Custom Shelving"],
  },
  {
    id: "painting",
    title: "Painting Services",
    subtitle: "Starting at $55/hr",
    price: "$55/hr",
    img:
      "https://readdy.ai/api/search-image?query=professional%20painter%20applying%20fresh%20paint&width=800&height=600",
    items: ["Interior Painting","Exterior Painting","Wall Preparation","Color Consultation","Touch-up Work"],
  },
  {
    id: "hvac",
    title: "HVAC Services",
    subtitle: "Starting at $95/hr",
    price: "$95/hr",
    img:
      "https://readdy.ai/api/search-image?query=HVAC%20technician%20servicing%20air%20conditioner&width=800&height=600",
    items: ["AC Repair","Heating Installation","Duct Cleaning","Filter Replacement","System Maintenance"],
  },
  {
    id: "repairs",
    title: "General Repairs",
    subtitle: "Starting at $45/hr",
    price: "$45/hr",
    img:
      "https://readdy.ai/api/search-image?query=handyman%20performing%20general%20home%20repairs&width=800&height=600",
    items: ["Door Repairs","Window Fixes","Drywall Patches","Caulking","Minor Installations"],
  },
];

export default services;
