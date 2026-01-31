// components/dashboard/CategoryManagementTable.tsx
'use client';

import { Plus } from 'lucide-react';
import { categories } from '@/lib/data';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/admin/Button';
import { Edit2, Trash2 } from 'lucide-react';

export default function CategoryManagementTable() {
  const handleEdit = (id: string) => {
    alert(`Edit category ${id}`);
  };

  const handleDelete = (id: string) => {
    alert(`Delete category ${id}`);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Service Categories</h3>
          <p className="text-gray-500">Manage service categories and subcategories</p>
        </div>
        <Button className="flex items-center">
          <Plus size={20} className="mr-2" />
          Add New Category
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b">
              <th className="pb-3 font-medium">Category ID</th>
              <th className="pb-3 font-medium">Category Name</th>
              <th className="pb-3 font-medium">Description</th>
              <th className="pb-3 font-medium">Handymen Count</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 font-medium">{category.categoryId}</td>
                <td className="py-4 font-medium">{category.name}</td>
                <td className="py-4">{category.description}</td>
                <td className="py-4">
                  <span className="font-medium">{category.handymenCount}</span>
                </td>
                <td className="py-4">
                  <Badge variant="active">Active</Badge>
                </td>
                <td className="py-4">
                  <div className="flex space-x-2">
                <button
                onClick={() => handleEdit(category.id)}
                className="w-8 h-8 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                title="Edit"
                >
                <Edit2 size={16} />
                </button>
                <button
                onClick={() => handleDelete(category.id)}
                className="w-8 h-8 bg-red-100 text-red-700 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors"
                title="Delete"
                >
                <Trash2 size={16} />
                </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}