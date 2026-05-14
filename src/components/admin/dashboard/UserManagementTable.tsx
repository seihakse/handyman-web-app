'use client';

// src/components/admin/dashboard/UserManagementTable.tsx
import { useEffect, useState, useCallback } from 'react';
import { Users, Trash2, Wrench, User, CheckCircle, XCircle } from 'lucide-react';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  handymanProfile: { id: string; isApproved: boolean; isPaused: boolean; isBanned: boolean; rating: number } | null;
}

export default function UserManagementTable() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users ?? []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  // Uses profile.id + { action } — matches the PATCH route exactly
  const handleApproval = async (userId: string, profileId: string, action: 'approve' | 'reject') => {
    setApprovingId(profileId);
    try {
      const res = await fetch(`/api/admin/handymen/${profileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const { handyman } = await res.json();
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId && u.handymanProfile
              ? {
                  ...u,
                  handymanProfile: {
                    ...u.handymanProfile,
                    isApproved: handyman.isApproved,
                    isPaused: handyman.isPaused,
                    isBanned: handyman.isBanned,
                  },
                }
              : u
          )
        );
      }
    } catch (err) {
      console.error('Approval action failed', err);
    } finally {
      setApprovingId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow mb-8">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500">{users.length} registered users</p>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="p-8 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Handyman Status</th>
                <th className="px-6 py-3 text-left">Joined</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  {/* User info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-bold">
                        {u.name?.charAt(0).toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role badge */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        u.role === 'handyman'
                          ? 'bg-purple-100 text-purple-700'
                          : u.role === 'admin'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {u.role === 'handyman' ? <Wrench className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {u.role}
                    </span>
                  </td>

                  {/* Handyman status badge */}
                  <td className="px-6 py-4">
                    {u.handymanProfile ? (
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          u.handymanProfile.isBanned
                            ? 'bg-red-100 text-red-700'
                            : u.handymanProfile.isPaused
                            ? 'bg-orange-100 text-orange-700'
                            : u.handymanProfile.isApproved
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {u.handymanProfile.isBanned
                          ? 'Banned'
                          : u.handymanProfile.isPaused
                          ? 'Paused'
                          : u.handymanProfile.isApproved
                          ? 'Approved'
                          : 'Pending'}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(u.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {u.handymanProfile && !u.handymanProfile.isBanned && (
                        <>
                          {!u.handymanProfile.isApproved ? (
                            <button
                              onClick={() => handleApproval(u.id, u.handymanProfile!.id, 'approve')}
                              disabled={approvingId === u.handymanProfile.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-green-600 hover:bg-green-50 text-xs font-medium rounded-lg transition disabled:opacity-50"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => handleApproval(u.id, u.handymanProfile!.id, 'reject')}
                              disabled={approvingId === u.handymanProfile.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-yellow-600 hover:bg-yellow-50 text-xs font-medium rounded-lg transition disabled:opacity-50"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Revoke
                            </button>
                          )}
                        </>
                      )}

                      {/* Delete */}
                      {confirmDelete === u.id ? (
                        <div className="flex gap-2 items-center">
                          <span className="text-xs text-red-600 font-medium">Sure?</span>
                          <button
                            onClick={() => handleDelete(u.id)}
                            disabled={deletingId === u.id}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition disabled:opacity-50"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(u.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-red-500 hover:bg-red-50 text-xs font-medium rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}