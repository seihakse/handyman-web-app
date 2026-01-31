// components/dashboard/UserManagementTable.tsx
'use client';

import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Ban, 
  Trash2, 
  CheckCircle,
  User
} from 'lucide-react';
import { users } from '@/lib/data';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/admin/Button';

export default function UserManagementTable() {
  const handleEdit = (id: string) => {
    alert(`Edit user ${id}`);
  };

  const handleBan = (id: string, status: string) => {
    alert(`${status === 'active' ? 'Ban' : 'Unban'} user ${id}`);
  };

  const handleDelete = (id: string) => {
    alert(`Delete user ${id}`);
  };

  return (
    <div className="card mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">User Management</h3>
          <p className="text-gray-500">Manage platform users and permissions</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select className="input-field pl-10">
              <option>All Status</option>
              <option>Active</option>
              <option>Banned</option>
            </select>
          </div>
          <Button className="flex items-center">
            <Plus size={20} className="mr-2" />
            Add New User
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b">
              <th className="pb-3 font-medium">User ID</th>
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Join Date</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 font-medium">{user.userId}</td>
                <td className="py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium mr-3">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-500 text-xs capitalize">{user.role}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">{user.email}</td>
                <td className="py-4">{user.joinDate}</td>
                <td className="py-4">
                  <Badge variant={user.status === 'active' ? 'active' : 'banned'}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </td>
                <td className="py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="w-8 h-8 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleBan(user.id, user.status)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        user.status === 'active'
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      title={user.status === 'active' ? 'Ban' : 'Unban'}
                    >
                      {user.status === 'active' ? (
                        <Ban size={16} />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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