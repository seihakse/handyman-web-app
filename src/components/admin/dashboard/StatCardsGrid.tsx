'use client';

// src/components/admin/dashboard/StatCardsGrid.tsx
import { useEffect, useState } from 'react';
import { Users, Wrench, Clock, CheckCircle, Flag, AlertTriangle, Layers, Star } from 'lucide-react';
import StatCard from './StatCard';

interface Stats {
  totalUsers: number;
  totalHandymen: number;
  pendingApprovals: number;
  approvedHandymen: number;
  totalReports: number;
  pendingReports: number;
  totalCategories: number;
  totalReviews: number;
}

export default function StatCardsGrid() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow h-28 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { title: 'Total Users',        value: stats.totalUsers,        icon: Users,         color: 'text-blue-600',   bg: 'bg-blue-50'   },
    { title: 'Total Handymen',     value: stats.totalHandymen,     icon: Wrench,        color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Pending Approvals',  value: stats.pendingApprovals,  icon: Clock,         color: 'text-yellow-600', bg: 'bg-yellow-50', highlight: stats.pendingApprovals > 0 },
    { title: 'Approved Handymen',  value: stats.approvedHandymen,  icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-50'  },
    { title: 'Total Reports',      value: stats.totalReports,      icon: Flag,          color: 'text-red-600',    bg: 'bg-red-50'    },
    { title: 'Pending Reports',    value: stats.pendingReports,    icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', highlight: stats.pendingReports > 0 },
    { title: 'Categories',         value: stats.totalCategories,   icon: Layers,        color: 'text-teal-600',   bg: 'bg-teal-50'   },
    { title: 'Total Reviews',      value: stats.totalReviews,      icon: Star,          color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}