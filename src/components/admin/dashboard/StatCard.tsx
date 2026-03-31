// components/dashboard/StatCard.tsx
import { 
  ArrowUp, 
  Users, 
  Wrench, 
  Layers, 
  DollarSign 
} from 'lucide-react';
import type { StatCard } from '@/lib/types';

// Map icon names to lucide components
const iconComponents: Record<string, React.ComponentType<any>> = {
  '👥': Users,
  '🔧': Wrench,
  '📁': Layers,
  '💰': DollarSign,
};

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  red: 'bg-red-50 text-red-600',
};

export default function StatCard({ card }: { card: StatCard }) {
  // Get the lucide icon component based on the icon key
  const IconComponent = iconComponents[card.icon as keyof typeof iconComponents] || Users;
  
  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{card.title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
          <p className="text-green-600 text-sm mt-2 flex items-center">
            <ArrowUp size={14} className="mr-1" />
            {card.trend}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[card.color]}`}>
          <IconComponent size={24} />
        </div>
      </div>
    </div>
  );
}