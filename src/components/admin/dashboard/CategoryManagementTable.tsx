'use client';

// src/components/admin/dashboard/CategoryManagementTable.tsx
import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Layers, X, Check, RefreshCw, Wrench } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string | null;
  handymenCount: number;
  createdAt: string;
}

interface FormState {
  name: string;
  description: string;
}

export default function CategoryManagementTable() {
  const [categories, setCategories]     = useState<Category[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm]           = useState<FormState>({ name: '', description: '' });
  const [addLoading, setAddLoading]     = useState(false);
  const [addError, setAddError]         = useState<string | null>(null);

  // Inline edit
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [editForm, setEditForm]         = useState<FormState>({ name: '', description: '' });
  const [editLoading, setEditLoading]   = useState(false);
  const [editError, setEditError]       = useState<string | null>(null);

  // Delete
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading]     = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data.categories ?? []);
    } catch {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // ── ADD ──────────────────────────────────────────
  const handleAdd = async () => {
    if (!addForm.name.trim()) { setAddError('Name is required'); return; }
    setAddLoading(true);
    setAddError(null);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (!res.ok) { setAddError(data.error ?? 'Failed to create'); return; }
      setCategories(prev => [...prev, { ...data.category, handymenCount: 0 }]);
      setAddForm({ name: '', description: '' });
      setShowAddModal(false);
    } catch {
      setAddError('Network error');
    } finally {
      setAddLoading(false);
    }
  };

  // ── EDIT ─────────────────────────────────────────
  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, description: cat.description ?? '' });
    setEditError(null);
  };

  const cancelEdit = () => { setEditingId(null); setEditError(null); };

  const handleEdit = async (id: string) => {
    if (!editForm.name.trim()) { setEditError('Name is required'); return; }
    setEditLoading(true);
    setEditError(null);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) { setEditError(data.error ?? 'Failed to update'); return; }
      setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data.category } : c));
      setEditingId(null);
    } catch {
      setEditError('Network error');
    } finally {
      setEditLoading(false);
    }
  };

  // ── DELETE ───────────────────────────────────────
  const handleDelete = async (id: string) => {
    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
        setConfirmDeleteId(null);
      }
    } catch {
      // silent — could add a toast here
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow mb-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Service Categories</h2>
            <p className="text-sm text-gray-500">{categories.length} categories · changes reflect immediately on the public site</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchCategories}
              title="Refresh"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setShowAddModal(true); setAddError(null); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Layers className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No categories yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your first category to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">Handymen</th>
                  <th className="px-6 py-3 text-left">Created</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition">
                    {editingId === cat.id ? (
                      /* ── Inline edit row ── */
                      <>
                        <td className="px-6 py-3">
                          <input
                            autoFocus
                            value={editForm.name}
                            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                            className="border border-blue-300 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Category name"
                          />
                          {editError && <p className="text-xs text-red-500 mt-1">{editError}</p>}
                        </td>
                        <td className="px-6 py-3">
                          <input
                            value={editForm.description}
                            onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Description (optional)"
                          />
                        </td>
                        <td className="px-6 py-3 text-gray-500">{cat.handymenCount}</td>
                        <td className="px-6 py-3 text-gray-400 text-xs">
                          {new Date(cat.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(cat.id)}
                              disabled={editLoading}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                              {editLoading ? 'Saving…' : 'Save'}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition"
                            >
                              <X className="w-3.5 h-3.5" /> Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      /* ── Normal row ── */
                      <>
                        <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                        <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                          {cat.description ?? <span className="text-gray-300 italic">No description</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-gray-700">
                            <Wrench className="w-3.5 h-3.5 text-gray-400" />
                            {cat.handymenCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs">
                          {new Date(cat.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          {confirmDeleteId === cat.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-red-600 font-medium">Delete?</span>
                              <button
                                onClick={() => handleDelete(cat.id)}
                                disabled={deleteLoading === cat.id}
                                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition disabled:opacity-50"
                              >
                                {deleteLoading === cat.id ? '…' : 'Yes'}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(cat)}
                                className="w-8 h-8 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(cat.id)}
                                className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add Category Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Add New Category</h3>
              <button
                onClick={() => { setShowAddModal(false); setAddForm({ name: '', description: '' }); }}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  autoFocus
                  type="text"
                  value={addForm.name}
                  onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Plumbing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={addForm.description}
                  onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Short description of what this category covers…"
                />
              </div>

              {addError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{addError}</p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAdd}
                disabled={addLoading}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {addLoading ? 'Creating…' : 'Create Category'}
              </button>
              <button
                onClick={() => { setShowAddModal(false); setAddForm({ name: '', description: '' }); }}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}