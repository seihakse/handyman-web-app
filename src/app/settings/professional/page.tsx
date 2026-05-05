// app/settings/professional/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Upload, X, FileCheck, Loader2, CheckCircle,
  AlertCircle, Save, Plus, Trash2
} from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';
type AvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';

interface HandymanForm {
  bio: string;
  skills: string[];
  telegramUsername: string;
  yearsOfExperience: string;
  serviceArea: string;
  availability: AvailabilityStatus;
  certificate: string | null;
  portfolioImage: string | null;
}

export default function ProfessionalInfoPage() {
  const { user, isHandyman, isLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<HandymanForm>({
    bio: '',
    skills: [],
    telegramUsername: '',
    yearsOfExperience: '',
    serviceArea: '',
    availability: 'AVAILABLE',
    certificate: null,
    portfolioImage: null,
  });

  const [newSkill, setNewSkill] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadingCert, setUploadingCert] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [certPreview, setCertPreview] = useState<string | null>(null);
  const [portfolioPreview, setPortfolioPreview] = useState<string | null>(null);

  const certInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  // Redirect non-handymen
  useEffect(() => {
    if (!isLoading && (!user || !isHandyman)) {
      router.push('/settings/edit-profile');
    }
  }, [user, isHandyman, isLoading, router]);

  // Load existing handyman profile
  useEffect(() => {
    if (!user || !isHandyman) return;
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/handyman/update-profile');
        if (res.ok) {
          const data = await res.json();
          setForm({
            bio: data.bio || '',
            skills: data.skills ? data.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
            telegramUsername: data.telegramUsername || '',
            yearsOfExperience: data.yearsOfExperience?.toString() || '',
            serviceArea: data.serviceArea || '',
            availability: data.availability || 'AVAILABLE',
            certificate: data.certificate || null,
            portfolioImage: data.portfolioImage || null,
          });
          setCertPreview(data.certificate || null);
          setPortfolioPreview(data.portfolioImage || null);
        }
      } catch (err) {
        console.error('Failed to load handyman profile:', err);
      }
    };
    loadProfile();
  }, [user, isHandyman]);

  // Upload file to Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.secure_url;
  };

  const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCertPreview(URL.createObjectURL(file));
    setUploadingCert(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm(prev => ({ ...prev, certificate: url }));
    } catch {
      setErrorMsg('Failed to upload certificate.');
      setCertPreview(form.certificate);
    } finally {
      setUploadingCert(false);
    }
  };

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPortfolioPreview(URL.createObjectURL(file));
    setUploadingPortfolio(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm(prev => ({ ...prev, portfolioImage: url }));
    } catch {
      setErrorMsg('Failed to upload portfolio image.');
      setPortfolioPreview(form.portfolioImage);
    } finally {
      setUploadingPortfolio(false);
    }
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
    }
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/handyman/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          skills: form.skills.join(', '),
          yearsOfExperience: form.yearsOfExperience ? parseInt(form.yearsOfExperience) : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  const availabilityOptions: { value: AvailabilityStatus; label: string; color: string }[] = [
    { value: 'AVAILABLE', label: 'Available', color: 'bg-green-100 text-green-800 border-green-300' },
    { value: 'BUSY', label: 'Busy', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { value: 'UNAVAILABLE', label: 'Unavailable', color: 'bg-red-100 text-red-800 border-red-300' },
  ];

  if (isLoading || !user || !isHandyman) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Professional Info</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your handyman profile details</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-7">

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Describe your experience and what you specialize in..."
            rows={4}
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
        </div>

        {/* Telegram Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Telegram Username <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 py-2.5 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500 text-sm">
              @
            </span>
            <input
              type="text"
              value={form.telegramUsername}
              onChange={e => setForm(prev => ({ ...prev, telegramUsername: e.target.value.replace('@', '') }))}
              placeholder="yourusername"
              required
              className="flex-1 px-3 py-2.5 text-sm border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Customers will contact you directly via Telegram</p>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}}
              placeholder="e.g. Plumbing, Electrical..."
              className="flex-1 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={addSkill}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.skills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Experience & Service Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={form.yearsOfExperience}
              onChange={e => setForm(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
              placeholder="e.g. 5"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Service Area
            </label>
            <input
              type="text"
              value={form.serviceArea}
              onChange={e => setForm(prev => ({ ...prev, serviceArea: e.target.value }))}
              placeholder="e.g. Phnom Penh, BKK"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
          <div className="flex gap-3">
            {availabilityOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, availability: opt.value }))}
                className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${
                  form.availability === opt.value
                    ? opt.color + ' ring-2 ring-offset-1 ring-current'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Certificate Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Certificate / Achievement
          </label>
          <p className="text-xs text-gray-400 mb-3">
            Upload your professional certificate or achievement document. Only visible to admins for verification.
          </p>
          <input
            ref={certInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleCertUpload}
          />
          {certPreview ? (
            <div className="relative inline-block">
              <img
                src={certPreview}
                alt="Certificate"
                className="h-40 w-auto rounded-lg border border-gray-200 object-cover"
              />
              {uploadingCert && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              )}
              <button
                type="button"
                onClick={() => { setForm(prev => ({ ...prev, certificate: null })); setCertPreview(null); }}
                className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => certInputRef.current?.click()}
                className="mt-2 block text-xs text-blue-600 hover:underline"
              >
                Replace
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => certInputRef.current?.click()}
              disabled={uploadingCert}
              className="flex flex-col items-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors disabled:opacity-60"
            >
              {uploadingCert ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <FileCheck className="h-8 w-8" />
              )}
              <span className="text-sm">
                {uploadingCert ? 'Uploading...' : 'Click to upload certificate'}
              </span>
              <span className="text-xs">JPG, PNG, PDF accepted</span>
            </button>
          )}
        </div>

        {/* Portfolio Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Portfolio Image
          </label>
          <p className="text-xs text-gray-400 mb-3">
            Showcase your best work — visible on your public profile.
          </p>
          <input
            ref={portfolioInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePortfolioUpload}
          />
          {portfolioPreview ? (
            <div className="relative inline-block">
              <img
                src={portfolioPreview}
                alt="Portfolio"
                className="h-40 w-auto rounded-lg border border-gray-200 object-cover"
              />
              {uploadingPortfolio && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              )}
              <button
                type="button"
                onClick={() => { setForm(prev => ({ ...prev, portfolioImage: null })); setPortfolioPreview(null); }}
                className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => portfolioInputRef.current?.click()}
                className="mt-2 block text-xs text-blue-600 hover:underline"
              >
                Replace
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => portfolioInputRef.current?.click()}
              disabled={uploadingPortfolio}
              className="flex flex-col items-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors disabled:opacity-60"
            >
              {uploadingPortfolio ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <Upload className="h-8 w-8" />
              )}
              <span className="text-sm">
                {uploadingPortfolio ? 'Uploading...' : 'Click to upload portfolio image'}
              </span>
              <span className="text-xs">JPG, PNG accepted</span>
            </button>
          )}
        </div>

        {/* Feedback */}
        {status === 'success' && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <CheckCircle className="h-4 w-4 shrink-0" />
            Professional info updated successfully!
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={status === 'loading' || uploadingCert || uploadingPortfolio}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'loading' ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="h-4 w-4" /> Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}