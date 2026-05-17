// src/components/feature/ReviewModal.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Star, Camera, Upload, Trash2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  handymanName: string;
  handymanId: string;
  /** Pass true if the current user has already reviewed this handyman */
  alreadyReviewed?: boolean;
  onSubmit: (rating: number, reviewText: string, images?: File[]) => Promise<void>;
}

interface ImageFile {
  file: File;
  preview: string;
}

export default function ReviewModal({
  isOpen,
  onClose,
  handymanName,
  handymanId,
  alreadyReviewed = false,
  onSubmit,
}: ReviewModalProps) {
  const { user } = useAuth();
  const [rating, setRating]               = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [reviewText, setReviewText]       = useState<string>('');
  const [images, setImages]               = useState<ImageFile[]>([]);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitError, setSubmitError]     = useState<string | null>(null);
  const [errors, setErrors]               = useState<{ rating?: string; reviewText?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setHoveredRating(0);
      setReviewText('');
      setImages([]);
      setErrors({});
      setSubmitError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { rating?: string; reviewText?: string } = {};
    if (rating === 0) newErrors.rating = 'Please select a rating';
    if (!reviewText.trim()) {
      newErrors.reviewText = 'Please share your experience';
    } else if (reviewText.trim().length < 10) {
      newErrors.reviewText = 'Review must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(rating, reviewText, images.map(img => img.file));
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
      return;
    }
    const newImages: ImageFile[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].preview);
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const StarRating = () => (
    <div className="flex items-center gap-1" style={{ userSelect: 'none' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => { setRating(star); if (errors.rating) setErrors({ ...errors, rating: undefined }); }}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none transition-transform hover:scale-110"
          aria-label={`${star} star`}
        >
          <svg focusable="false" width="34" height="34" viewBox="0 0 40 40" className="transition-colors">
            <path
              d="M30.1738537,33.7654006 L27.0921483,24.1156159 C26.959813,23.7012327 27.1105413,23.2488331 27.4649676,22.9966268 L35.4477621,17.3161477 C35.8977477,16.9959424 36.0029553,16.3715793 35.68275,15.9215937 C35.4950528,15.6578223 35.1912764,15.5012346 34.8675395,15.5013769 L25.0804893,15.5056789 C24.6453619,15.5058702 24.2600542,15.2246667 24.1275461,14.8102063 L20.9521753,4.87824826 C20.7839895,4.35219504 20.2211976,4.06208615 19.6951444,4.23027193 C19.3871406,4.32874458 19.1457633,4.57007364 19.047229,4.87805774 L15.8695464,14.8103968 C15.7369778,15.2247605 15.3517177,15.5058702 14.916664,15.5056789 L5.13246101,15.5013772 C4.58017631,15.5011344 4.13226426,15.9486528 4.13202145,16.5009375 C4.13187911,16.8246744 4.28846681,17.1284508 4.55223829,17.316148 L12.5352875,22.9968084 C12.8895911,23.2489273 13.0403512,23.7011146 12.908231,24.1154083 L9.83068127,33.7657819 C9.66288114,34.2919582 9.95340248,34.8545373 10.4795788,35.0223375 C10.7880012,35.1206948 11.1249561,35.0636649 11.3838335,34.8692915 L19.3997363,28.8506971 C19.7553884,28.5836621 20.2446591,28.5835988 20.6003804,28.8505416 L28.6210329,34.8694549 C29.0627701,35.2009464 29.6895959,35.1115746 30.0210874,34.6698373 C30.2154254,34.4108674 30.2723531,34.073833 30.1738537,33.7654006 Z"
              fill={star <= (hoveredRating || rating) ? '#fabb05' : '#80868b'}
            />
          </svg>
        </button>
      ))}
    </div>
  );

  // ── Already reviewed state ──
  if (alreadyReviewed) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
            <button onClick={onClose} className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Already Reviewed</h3>
            <p className="text-gray-500 text-sm">You have already submitted a review for {handymanName}.</p>
            <button
              onClick={onClose}
              className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-[700px] w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 flex-none py-4 px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Write a Review for {handymanName}</h2>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">Share your experience to help others</p>
          </div>

          {/* Content */}
          <div className="w-full overflow-y-auto flex-1 py-6 px-6">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-600 shrink-0">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                    {user?.name?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{user?.name ?? 'You'}</div>
                <div className="text-xs text-gray-500">Posting publicly</div>
              </div>
            </div>

            {/* Error banner */}
            {submitError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {submitError}
              </div>
            )}

            {/* Stars */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <StarRating />
              {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
            </div>

            {/* Review text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => {
                  setReviewText(e.target.value);
                  if (errors.reviewText) setErrors({ ...errors, reviewText: undefined });
                }}
                placeholder="Share details of your own experience with this handyman..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y ${
                  errors.reviewText ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.reviewText && <p className="text-red-500 text-sm mt-1">{errors.reviewText}</p>}
            </div>

            {/* Photo upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Photos (Optional)
              </label>
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img src={image.preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= 5}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-2 text-gray-600 group-hover:text-blue-600">
                  <Camera className="w-5 h-5" />
                  <span>{images.length >= 5 ? 'Maximum 5 photos reached' : 'Click to add photos'}</span>
                  {images.length < 5 && <Upload className="w-4 h-4" />}
                </div>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              <p className="text-xs text-gray-500 mt-2">You can upload up to 5 photos (JPEG, PNG)</p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 flex-none py-4 px-6">
            <div className="flex w-full gap-3">
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
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting...' : 'Post Review'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}