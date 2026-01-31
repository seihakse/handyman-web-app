// components/dashboard/StatCardsGrid.tsx
import StatCard from './StatCard';
import { statCards } from '@/lib/data';

export default function StatCardsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <StatCard key={index} card={card} />
      ))}
    </div>
  );
}