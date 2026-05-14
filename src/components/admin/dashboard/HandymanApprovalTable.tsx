'use client';

// src/components/admin/dashboard/HandymanApprovalTable.tsx
import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, Star, MapPin, Wrench, RefreshCw, PauseCircle, PlayCircle, Ban } from 'lucide-react';

interface Handyman {
  id: string;           // profile id
  userId: string;
  bio: string | null;
  skills: string | null;
  rating: number | null;
  totalReviews: number;
  isApproved: boolean;
  isPaused: boolean;
  isBanned: boolean;
  yearsOfExperience: number | null;
  serviceArea: string | null;
  telegramUsername: string | null;
  profilePicture: string | null; // on HandymanProfile — removed, now on user
  createdAt: string;
  user: { id: string; name: string; email: string; profilePicture: string | null };
}

type FilterType = 'pending' | 'approved' | 'all';

type Action = 'approve' | 'reject' | 'pause' | 'unpause' | 'ban' | 'unban';

export default function HandymanApprovalTable() {
  const [handymen, setHandymen] = useState<Handyman[]>([]);
  const [filter, setFilter] = useState<FilterType>('pending');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmBan, setConfirmBan] = useState<string | null>(null); // profile id

  const fetchHandymen = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/handymen?status=${filter}`);
      const data = await res.json();
      setHandymen(data.handymen ?? []);
    } catch (err) {
      console.error('Failed to fetch handymen', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchHandymen();
  }, [fetchHandymen]);

  // All actions use profile.id (h.id) — NOT h.userId
  const handleAction = async (profileId: string, action: Action) => {
    setActionLoading(profileId + action);
    setConfirmBan(null);
    try {
      const res = await fetch(`/api/admin/handymen/${profileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const { handyman } = await res.json();
        // Update the row in-place so the UI reflects immediately
        setHandymen((prev) =>
          prev.map((h) =>
            h.id === profileId
              ? { ...h, isApproved: handyman.isApproved, isPaused: handyman.isPaused, isBanned: handyman.isBanned }
              : h
          )
        );
      }
    } catch (err) {
      console.error('Action failed', err);
    } finally {
      setActionLoading(null);
    }
  };

  const isLoading = (profileId: string, action: Action) => actionLoading === profileId + action;

  return (
    <div className="bg-white rounded-xl shadow mb-8">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Handyman Management</h2>
          <p className="text-sm text-gray-500">
            {filter === 'pending'
              ? 'Waiting for approval — hidden from the public website'
              : filter === 'approved'
              ? 'Currently visible on the public website'
              : `${handymen.length} total handymen`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchHandymen}
            title="Refresh"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {(['pending', 'approved', 'all'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition capitalize ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f === 'pending' ? 'Pending' : f === 'approved' ? 'Approved' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="p-8 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : handymen.length === 0 ? (
        <div className="text-center py-16">
          <Wrench className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-gray-500">
            {filter === 'pending' ? 'No pending applications' : 'No handymen found'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {filter === 'pending' ? 'All caught up!' : 'Try a different filter'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Handyman</th>
                <th className="px-6 py-3 text-left">Skills</th>
                <th className="px-6 py-3 text-left">Details</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Joined</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {handymen.map((h) => (
                <tr key={h.id} className={`hover:bg-gray-50 transition ${h.isBanned ? 'opacity-60' : ''}`}>
                  {/* Handyman */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {h.user.profilePicture ? (
                        <img src={h.user.profilePicture} alt={h.user.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                          {h.user.name?.charAt(0).toUpperCase() ?? '?'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{h.user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{h.user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Skills */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(h.skills ?? '').split(',').slice(0, 3).map(s => s.trim()).filter(Boolean).map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">{skill}</span>
                      ))}
                      {(h.skills ?? '').split(',').length > 3 && (
                        <span className="text-xs text-gray-400">+{(h.skills ?? '').split(',').length - 3} more</span>
                      )}
                    </div>
                  </td>

                  {/* Details */}
                  <td className="px-6 py-4 text-xs text-gray-600 space-y-1">
                    {h.yearsOfExperience != null && (
                      <div className="flex items-center gap-1"><Star className="w-3 h-3" />{h.yearsOfExperience} yrs exp</div>
                    )}
                    {h.serviceArea && (
                      <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{h.serviceArea}</div>
                    )}
                    {h.telegramUsername && (
                      <div className="text-blue-500">@{h.telegramUsername}</div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {h.isBanned ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <Ban className="w-3 h-3" /> Banned
                      </span>
                    ) : h.isPaused ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        <PauseCircle className="w-3 h-3" /> Paused
                      </span>
                    ) : h.isApproved ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(h.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {h.isBanned ? (
                        // Banned — only action is unban
                        <button
                          onClick={() => handleAction(h.id, 'unban')}
                          disabled={!!actionLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition disabled:opacity-50"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          {isLoading(h.id, 'unban') ? 'Unbanning…' : 'Unban'}
                        </button>
                      ) : (
                        <>
                          {/* Approve / Revoke */}
                          {!h.isApproved ? (
                            <button
                              onClick={() => handleAction(h.id, 'approve')}
                              disabled={!!actionLoading}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition disabled:opacity-50"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              {isLoading(h.id, 'approve') ? 'Approving…' : 'Approve'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction(h.id, 'reject')}
                              disabled={!!actionLoading}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 text-xs font-medium rounded-lg transition disabled:opacity-50"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              {isLoading(h.id, 'reject') ? 'Revoking…' : 'Revoke'}
                            </button>
                          )}

                          {/* Pause / Unpause — only for approved handymen */}
                          {h.isApproved && (
                            h.isPaused ? (
                              <button
                                onClick={() => handleAction(h.id, 'unpause')}
                                disabled={!!actionLoading}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-medium rounded-lg transition disabled:opacity-50"
                              >
                                <PlayCircle className="w-3.5 h-3.5" />
                                {isLoading(h.id, 'unpause') ? 'Resuming…' : 'Resume'}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAction(h.id, 'pause')}
                                disabled={!!actionLoading}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 text-xs font-medium rounded-lg transition disabled:opacity-50"
                              >
                                <PauseCircle className="w-3.5 h-3.5" />
                                {isLoading(h.id, 'pause') ? 'Pausing…' : 'Pause'}
                              </button>
                            )
                          )}

                          {/* Ban — two-step confirm */}
                          {confirmBan === h.id ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-red-600 font-medium">Ban?</span>
                              <button
                                onClick={() => handleAction(h.id, 'ban')}
                                disabled={!!actionLoading}
                                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition disabled:opacity-50"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setConfirmBan(null)}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmBan(h.id)}
                              disabled={!!actionLoading}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-medium rounded-lg transition disabled:opacity-50"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              Ban
                            </button>
                          )}
                        </>
                      )}

                      {/* View profile link */}
                      <a
                        href={`/handyman/${h.userId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition"
                      >
                        View
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info banner */}
      {!loading && filter === 'pending' && handymen.length > 0 && (
        <div className="px-6 py-3 bg-amber-50 border-t border-amber-100 rounded-b-xl">
          <p className="text-xs text-amber-700 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            Approved handymen appear immediately on the public website. Pending and paused handymen are invisible to visitors.
          </p>
        </div>
      )}
    </div>
  );
}