// components/feature/ReviewsSection.tsx
'use client';

import { Star, ThumbsUp, Flag, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  images?: string[];
  createdAt: string;
  helpful: number;
}

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onHelpfulClick?: (reviewId: string) => void;
}

export default function ReviewsSection({ reviews, averageRating, totalReviews, onHelpfulClick }: ReviewsSectionProps) {
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

  const handleHelpfulClick = (reviewId: string) => {
    if (!helpfulClicked.has(reviewId)) {
      setHelpfulClicked(prev => new Set(prev).add(reviewId));
      onHelpfulClick?.(reviewId);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
          <span className="text-sm text-gray-500">({totalReviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-gray-900">{averageRating}</div>
          {renderStars(Math.floor(averageRating))}
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">{review.userName}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-full transition">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Rating */}
            <div className="mb-2">
              {renderStars(review.rating)}
            </div>

            {/* Review Content */}
            <p className="text-gray-700 mb-3">{review.content}</p>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mb-3">
                {review.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`Review image ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                  />
                ))}
              </div>
            )}

            {/* Helpful Button */}
            <button
              onClick={() => handleHelpfulClick(review.id)}
              disabled={helpfulClicked.has(review.id)}
              className={`flex items-center gap-1 text-xs transition ${
                helpfulClicked.has(review.id)
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <ThumbsUp className="w-3 h-3" />
              <span>Helpful ({review.helpful + (helpfulClicked.has(review.id) ? 1 : 0)})</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}