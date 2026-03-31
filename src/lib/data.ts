// lib/data.ts
import { Category, HandymanApproval, StatCard, User } from './types'; 
import { Users, Wrench, Layers, DollarSign } from 'lucide-react';


export const statCards: StatCard[] = [
  {
    title: 'Total Users',
    value: '1,254',
    icon: '👥', // Will map to Users icon
    trend: '+12.5% from last month',
    color: 'blue'
  },
  {
    title: 'Active Handymen',
    value: '342',
    icon: '🔧', // Will map to Wrench icon
    trend: '+8.2% from last month',
    color: 'green'
  },
  {
    title: 'Service Categories',
    value: '12',
    icon: '📁', // Will map to Layers icon
    trend: 'No change',
    color: 'purple'
  },
  {
    title: 'Banned Handymen',
    value: '0',
    icon: '👥', // Will map to DollarSign icon
    trend: 'N/A',
    color: 'red'
  }
];

export const pendingHandymen: HandymanApproval[] = [
  {
    id: '1',
    name: 'John Smith',
    avatar: 'JS',
    category: 'Plumbing',
    location: 'New York, NY',
    experience: 5,
    idcard: 'completed',
    status: 'pending',
    appliedDate: '2023-10-26'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    avatar: 'MG',
    category: 'Electrical',
    location: 'Los Angeles, CA',
    experience: 3,
    idcard: 'completed',
    status: 'pending',
    appliedDate: '2023-10-27'
  },
  {
    id: '3',
    name: 'Robert Chen',
    avatar: 'RC',
    category: 'Carpentry',
    location: 'Chicago, IL',
    experience: 3,
    idcard: 'completed',
    status: 'pending',
    appliedDate: '2023-10-25'
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    avatar: 'SJ',
    category: 'Cleaning',
    location: 'Miami, FL',
    experience: 2,
    idcard: 'completed',
    status: 'pending',
    appliedDate: '2023-10-28'
  }
];

export const users: User[] = [
  {
    id: '1',
    userId: 'USR-0012',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'customer',
    joinDate: '2023-01-15',
    status: 'active'
  },
  {
    id: '2',
    userId: 'USR-0087',
    name: 'Sarah Miller',
    email: 'sarah.m@example.com',
    role: 'customer',
    joinDate: '2023-03-22',
    status: 'active'
  },
  {
    id: '3',
    userId: 'USR-0045',
    name: 'Michael Brown',
    email: 'm.brown@example.com',
    role: 'customer',
    joinDate: '2023-02-10',
    status: 'banned'
  }
];

export const categories: Category[] = [
  {
    id: '1',
    categoryId: 'CAT-01',
    name: 'Plumbing',
    description: 'Pipe installation, leak repairs, faucet fixes',
    handymenCount: 87,
    status: 'active'
  },
  {
    id: '2',
    categoryId: 'CAT-02',
    name: 'Electrical',
    description: 'Wiring, installations, electrical repairs',
    handymenCount: 64,
    status: 'active'
  },
  {
    id: '3',
    categoryId: 'CAT-03',
    name: 'Carpentry',
    description: 'Furniture, cabinets, wooden structures',
    handymenCount: 53,
    status: 'active'
  }
];