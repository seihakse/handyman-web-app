// src/app/settings/change-password/page.tsx
'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

// ── Moved OUTSIDE the page component so React never remounts it on re-render ──
function PasswordField({
  label,
  name,
  value,
  placeholder,
  show,
  onToggleShow,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  show: boolean;
  onToggleShow: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [show, setShow] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [status, setStatus]   = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const toggleShow = (field: keyof typeof show) =>
    setShow(prev => ({ ...prev, [field]: !prev[field] }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (form.newPassword !== form.confirmPassword) {
      setErrorMsg('New passwords do not match.');
      setStatus('error');
      return;
    }
    if (form.newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      setStatus('error');
      return;
    }
    if (form.newPassword === form.currentPassword) {
      setErrorMsg('New password must be different from your current password.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to change password');
      }

      setStatus('success');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  const strength =
    form.newPassword.length >= 12 ? 4
    : form.newPassword.length >= 10 ? 3
    : form.newPassword.length >= 6  ? 2
    : form.newPassword.length > 0   ? 1
    : 0;

  const strengthLabel = ['', 'Too short', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'][strength];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
        <p className="text-sm text-gray-500 mt-1">Update your account password</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Security tips */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-800 mb-1 flex items-center gap-1.5">
            <Lock className="h-4 w-4" /> Password requirements
          </p>
          <ul className="text-xs text-blue-700 space-y-0.5 list-disc list-inside">
            <li>At least 6 characters long</li>
            <li>Must be different from your current password</li>
          </ul>
        </div>

        <PasswordField
          label="Current Password"
          name="currentPassword"
          value={form.currentPassword}
          placeholder="Enter your current password"
          show={show.currentPassword}
          onToggleShow={() => toggleShow('currentPassword')}
          onChange={handleChange}
        />
        <PasswordField
          label="New Password"
          name="newPassword"
          value={form.newPassword}
          placeholder="Enter your new password"
          show={show.newPassword}
          onToggleShow={() => toggleShow('newPassword')}
          onChange={handleChange}
        />
        <PasswordField
          label="Confirm New Password"
          name="confirmPassword"
          value={form.confirmPassword}
          placeholder="Confirm your new password"
          show={show.confirmPassword}
          onToggleShow={() => toggleShow('confirmPassword')}
          onChange={handleChange}
        />

        {/* Password strength indicator */}
        {form.newPassword && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Password strength</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    level <= strength ? strengthColor : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">{strengthLabel}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <CheckCircle className="h-4 w-4 shrink-0" />
            Password changed successfully!
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'loading' ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Updating...</>
            ) : (
              'Update Password'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}