// components/feature/ReportModal.tsx
'use client';

import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  handymanName: string;
  handymanId: string;
  onSubmit: (reason: string, description: string) => Promise<void>;
}

const reportReasons = [
  { id: 'suspicious', label: 'Suspicious Account' },
  { id: 'fake_profile', label: 'Fake Profile / Identity Theft' },
  { id: 'unresponsive', label: 'Not responding / Phone unreachable' },
  { id: 'scam_fraud', label: 'Scam/Fraud' },
  { id: 'unprofessional', label: 'Unprofessional Conduct' },
  { id: 'overcharging', label: 'Overcharging / Invalid pricing' },
  { id: 'wrong_category', label: 'Wrong service category' },
  { id: 'duplicate', label: 'Duplicate profile' },
  { id: 'inappropriate', label: 'Inappropriate content' },
  { id: 'other', label: 'Other' }
];

export default function ReportModal({ isOpen, onClose, handymanName, handymanId, onSubmit }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ reason?: string; description?: string }>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { reason?: string; description?: string } = {};
    
    if (!selectedReason) {
      newErrors.reason = 'Please select a reason for reporting';
    }
    
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
    try {
      const reasonLabel = reportReasons.find(r => r.id === selectedReason)?.label || selectedReason;
      await onSubmit(reasonLabel, description);
      // Reset form
      setSelectedReason('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReasonSelect = (reasonId: string) => {
    setSelectedReason(reasonId);
    if (errors.reason) {
      setErrors({ ...errors, reason: undefined });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (errors.description) {
      setErrors({ ...errors, description: undefined });
    }
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
              <h2 className="flex-1 text-lg font-semibold text-gray-900">
                Report {handymanName}
              </h2>
              <button
                onClick={onClose}
                className="btn btn-circle btn-ghost btn-sm absolute right-3 top-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="w-full overflow-y-auto flex-1 py-4 px-6">
            <form id="reportForm" className="space-y-4 w-full">
              {/* Report Reasons */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Reason for Reporting <span className="text-red-600">*</span>
                </label>
                <ul className="w-full text-start border border-gray-200 rounded-lg overflow-hidden">
                  {reportReasons.map((reason) => (
                    <li
                      key={reason.id}
                      onClick={() => handleReasonSelect(reason.id)}
                      className={`py-3 px-4 cursor-pointer flex w-full text-[15px] items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                        selectedReason === reason.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <span className={selectedReason === reason.id ? 'text-blue-700' : 'text-gray-700'}>
                        {reason.label}
                      </span>
                      {selectedReason === reason.id && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </li>
                  ))}
                </ul>
                {errors.reason && (
                  <p className="text-red-600 text-sm mt-1">{errors.reason}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="text-sm font-medium text-gray-700 block mb-2">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  placeholder="Please provide detailed information about your report..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={description}
                  onChange={handleDescriptionChange}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Minimum 10 characters. Please be as specific as possible.
                </p>
              </div>
            </form>
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