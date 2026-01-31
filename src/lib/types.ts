// lib/types.ts
import { Users, Wrench, Layers, DollarSign } from 'lucide-react';

export interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode; // Use ReactNode instead of string
  trend: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}

export interface HandymanApproval {
  id: string;
  name: string;
  avatar: string;
  category: string;
  location: string;
  experience: number;
  idcard: 'completed';
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
}

export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'handyman';
  joinDate: string;
  status: 'active' | 'banned' | 'inactive';
}

export interface Category {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  handymenCount: number;
  status: 'active' | 'inactive';
}