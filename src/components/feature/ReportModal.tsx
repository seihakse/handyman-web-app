// src/components/feature/ReportModal.tsx
'use client';

import { useState, useRef } from 'react';
import { X, CheckCircle, Camera, Upload, Trash2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  handymanName: string;
  handymanId: string;
  onSubmit: (reason: string, description: string, images?: File[]) => Promise<void>;
}

interface ImageFile {
  file: File;
  preview: string;
}

const reportReasons = [
  { id: 'suspicious',     label: 'Suspicious Account' },
  { id: 'fake_profile',   label: 'Fake Profile / Identity Theft' },
  { id: 'unresponsive',   label: 'Not responding / Phone unreachable' },
  { id: 'scam_fraud',     label: 'Scam/Fraud' },
  { id: 'unprofessional', label: 'Unprofessional Conduct' },
  { id: 'overcharging',   label: 'Overcharging / Invalid pricing' },
  { id: 'wrong_category', label: 'Wrong service category' },
  { id: 'duplicate',      label: 'Duplicate profile' },
  { id: 'inappropriate',  label: 'Inappropriate content' },
  { id: 'other',          label: 'Other' },
];

export default function ReportModal({
  isOpen,
  onClose,
  handymanName,
  handymanId,
  onSubmit,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [description, setDescription]       = useState('');
  const [images, setImages]                 = useState<ImageFile[]>([]);
  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [submitError, setSubmitError]       = useState<string | null>(null);
  const [errors, setErrors]                 = useState<{ reason?: string; description?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { reason?: string; description?: string } = {};
    if (!selectedReason) newErrors.reason = 'Please select a reason for reporting';
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'The description must be at least 10 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const reasonLabel = reportReasons.find(r => r.id === selectedReason)?.label || selectedReason;
      await onSubmit(reasonLabel, description, images.map(i => i.file));
      // Reset on success
      setSelectedReason('');
      setDescription('');
      images.forEach(i => URL.revokeObjectURL(i.preview));
      setImages([]);
      onClose();
    } catch (error: any) {
      setSubmitError(error?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      setSubmitError('You can upload a maximum of 5 photos.');
      e.target.value = '';
      return;
    }
    const newImages: ImageFile[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages]);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].preview);
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-[700px] w-full max-h-[90vh] flex flex-col">

          {/* Header */}
          <div className="border-b border-gray-200 flex-none shadow-sm py-4 px-6">
            <div className="flex items-center justify-between">
              <h2 className="flex-1 text-lg font-semibold text-gray-900">Report {handymanName}</h2>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="w-full overflow-y-auto flex-1 py-4 px-6">

            {/* Error banner */}
            {submitError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {submitError}
              </div>
            )}

            <div className="space-y-5 w-full">

              {/* Reason list */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Reason for Reporting <span className="text-red-600">*</span>
                </label>
                <ul className="w-full text-start border border-gray-200 rounded-lg overflow-hidden">
                  {reportReasons.map((reason) => (
                    <li
                      key={reason.id}
                      onClick={() => {
                        setSelectedReason(reason.id);
                        if (errors.reason) setErrors({ ...errors, reason: undefined });
                      }}
                      className={`py-3 px-4 cursor-pointer flex w-full text-[15px] items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                        selectedReason === reason.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <span className={selectedReason === reason.id ? 'text-blue-700' : 'text-gray-700'}>
                        {reason.label}
                      </span>
                      {selectedReason === reason.id && <CheckCircle className="w-5 h-5 text-blue-600" />}
                    </li>
                  ))}
                </ul>
                {errors.reason && <p className="text-red-600 text-sm mt-1">{errors.reason}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="text-sm font-medium text-gray-700 block mb-2">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="description"
                  rows={5}
                  placeholder="Please provide detailed information about your report..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors({ ...errors, description: undefined });
                  }}
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                <p className="text-gray-500 text-xs mt-1">Minimum 10 characters. Please be as specific as possible.</p>
              </div>

              {/* Proof photos */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Proof Photos <span className="text-gray-400 font-normal">(optional — up to 5 images)</span>
                </label>

                {/* Image preview grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.preview}
                          alt={`Proof ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={images.length >= 5}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-red-400 hover:bg-red-50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-2 text-gray-500 group-hover:text-red-600">
                    <Camera className="w-5 h-5" />
                    <span className="text-sm">
                      {images.length >= 5 ? 'Maximum 5 photos reached' : 'Click to add proof photos'}
                    </span>
                    {images.length < 5 && <Upload className="w-4 h-4" />}
                  </div>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-gray-400 text-xs mt-1.5">
                  Screenshots, photos, or any visual evidence. Max 5MB per image.
                </p>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 flex-none py-4 px-6">
            <div className="flex w-full gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}