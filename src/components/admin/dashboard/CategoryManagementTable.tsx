'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, X } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/admin/Button';

interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  _count: { handymen: number };
}

interface FormState {
  name: string;
  description: string;
}

export default function CategoryManagementTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // modal state: null = closed, 'add' = adding, Category = editing
  const [modal, setModal] = useState<null | 'add' | Category>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to load');
      setCategories(await res.json());
    } catch {
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => {
    setForm({ name: '', description: '' });
    setFormError(null);
    setModal('add');
  };

  const openEdit = (cat: Category) => {
    setForm({ name: cat.name, description: cat.description ?? '' });
    setFormError(null);
    setModal(cat);
  };

  const closeModal = () => { setModal(null); setFormError(null); };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError('Name is required.'); return; }
    setSaving(true);
    setFormError(null);

    const isEdit = modal !== 'add' && modal !== null;
    const url = isEdit ? `/api/categories/${(modal as Category).id}` : '/api/categories';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error ?? 'Something went wrong.'); return; }

      if (isEdit) {
        setCategories(prev => prev.map(c => c.id === data.id ? data : c));
      } else {
        setCategories(prev => [...prev, data]);
      }
      closeModal();
    } catch {
      setFormError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/categories/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? 'Failed to delete.');
        return;
      }
      setCategories(prev => prev.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Service Categories</h3>
            <p className="text-gray-500">Manage service categories and subcategories</p>
          </div>
          <Button className="flex items-center" onClick={openAdd}>
            <Plus size={20} className="mr-2" />
            Add New Category
          </Button>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {error && <p className="text-red-500 text-center py-8">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-3 font-medium">Category Name</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Handymen</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      No categories yet. Add one to get started.
                    </td>
                  </tr>
                )}
                {categories.map(cat => (
                  <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 font-medium">{cat.name}</td>
                    <td className="py-4 text-gray-600 max-w-xs truncate">{cat.description ?? '—'}</td>
                    <td className="py-4 font-medium">{cat._count.handymen}</td>
                    <td className="py-4">
                      <Badge variant={cat.isActive ? 'active' : 'default'}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="w-8 h-8 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
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
        )}
      </div>

      {/* Add / Edit modal */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">
                {modal === 'add' ? 'Add New Category' : 'Edit Category'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Plumbing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Short description of this category"
                />
              </div>
              {formError && <p className="text-sm text-red-500">{formError}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                {saving && <Loader2 size={16} className="animate-spin" />}
                {modal === 'add' ? 'Create' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="px-6 py-5">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Delete Category</h2>
              <p className="text-gray-600 text-sm">
                Are you sure you want to delete{' '}
                <span className="font-semibold">{deleteTarget.name}</span>?{' '}
                {deleteTarget._count.handymen > 0 && (
                  <span className="text-red-600">
                    {deleteTarget._count.handymen} handyman(s) will be unlinked from this category.
                  </span>
                )}
              </p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
