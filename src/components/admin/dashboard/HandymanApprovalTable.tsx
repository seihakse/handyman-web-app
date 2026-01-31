// components/dashboard/HandymanApprovalTable.tsx
'use client';

import { useState } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { pendingHandymen } from '@/lib/data';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import { Check, X, Eye } from 'lucide-react';

const categories = ['All Categories', 'Plumbing', 'Electrical', 'Carpentry', 'Cleaning'];

export default function HandymanApprovalTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleApprove = (id: string) => {
    alert(`Approved handyman ${id}`);
  };

  const handleReject = (id: string) => {
    alert(`Rejected handyman ${id}`);
  };

  const handleView = (id: string) => {
    alert(`Viewing handyman ${id}`);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 font-medium">{rating}</span>
      </div>
    );
  };

  return (
    <div className="card mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Pending Handyman Approvals</h3>
          <p className="text-gray-500">5 handymen awaiting approval</p>
        </div>
        <Button>View All</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search handymen..."
            className="input-field pl-10"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select className="input-field pl-10">
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select className="input-field pl-10">
            <option>Newest First</option>
            <option>Oldest First</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Location</th>
              <th className="pb-3 font-medium">Experience</th>
              <th className="pb-3 font-medium">ID Card</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingHandymen.map((handyman) => (
              <tr key={handyman.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium mr-3">
                      {handyman.avatar}
                    </div>
                    <div>
                      <p className="font-medium">{handyman.name}</p>
                      <p className="text-gray-500 text-xs">
                        Applied: {handyman.appliedDate}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <Badge variant="category">{handyman.category}</Badge>
                </td>
                <td className="py-4">{handyman.location}</td>
                <td className="py-4 font-medium">{handyman.experience} years</td>
                <td className="py-4">{handyman.idcard}</td>
                <td className="py-4">
                  <Badge variant="pending">Pending</Badge>
                </td>
                <td className="py-4">
                  <div className="flex space-x-2">
                    <button
                        onClick={() => handleApprove(handyman.id)}
                        className="w-8 h-8 bg-green-100 text-green-700 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors"
                        title="Approve"
                        >
                        <Check size={16} />
                    </button>
                    <button
                    onClick={() => handleView(handyman.id)}
                    className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                    title="View"
                    >
                    <Eye size={16} />
                    </button>
                    <button
                    onClick={() => handleReject(handyman.id)}
                    className="w-8 h-8 bg-red-100 text-red-700 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors"
                    title="Reject"
                    >
                    <X size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}