// src/components/admin/dashboard/StatCard.tsx
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bg: string;
  highlight?: boolean;
}

export default function StatCard({ title, value, icon: Icon, color, bg, highlight }: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow p-6 flex items-center gap-4 transition-all ${
        highlight ? 'ring-2 ring-yellow-400 ring-offset-1' : ''
      }`}
    >
      <div className={`${bg} ${color} p-3 rounded-xl`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}