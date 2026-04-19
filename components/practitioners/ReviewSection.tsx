"use client";

import { useState, useEffect, useCallback } from "react";
import { Star } from "lucide-react";

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Props {
  practitionerId: string;
  practitionerName: string;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="focus:outline-none"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              star <= (hovered || value)
                ? "text-secondary-500 fill-secondary-500"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E5E7EB]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
            {review.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm text-[#1A1A2E]">{review.name}</p>
            <div className="flex gap-0.5 mt-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${s <= review.rating ? "text-secondary-500 fill-secondary-500" : "text-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <span className="text-xs text-[#6B7280] flex-shrink-0">{date}</span>
      </div>
      <p className="mt-3 text-sm text-[#374151] leading-relaxed">{review.comment}</p>
    </div>
  );
}

export function ReviewSection({ practitionerId, practitionerName }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?practitionerId=${practitionerId}`);
      const data = await res.json();
      setReviews(data.reviews ?? []);
    } finally {
      setLoading(false);
    }
  }, [practitionerId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!rating) { setError("Please select a star rating."); return; }
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!comment.trim()) { setError("Please write a review."); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ practitionerId, name, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }

      setSuccess(true);
      setName("");
      setRating(0);
      setComment("");
      setShowForm(false);
      await fetchReviews();
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-playfair text-xl font-bold text-[#1A1A2E]">
            Client Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= Math.round(avgRating) ? "text-secondary-500 fill-secondary-500" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#6B7280]">
                {avgRating.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setSuccess(false); setError(""); }}
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-400 px-4 py-2 rounded-xl transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Success banner */}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
          Thank you! Your review has been posted.
        </div>
      )}

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-[#FAFAF8] rounded-xl border border-[#E5E7EB] p-5 space-y-4">
          <h3 className="font-semibold text-sm text-[#1A1A2E]">
            Review {practitionerName}
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-2">Your Rating *</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">Your Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah M."
              maxLength={100}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">Your Review *</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              maxLength={1000}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none bg-white"
            />
            <p className="text-right text-xs text-[#9CA3AF] mt-0.5">{comment.length}/1000</p>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              {submitting ? "Posting…" : "Post Review"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setError(""); }}
              className="text-sm text-[#6B7280] hover:text-[#374151] px-4 py-2.5 rounded-xl border border-[#E5E7EB] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-[#F3F4F6] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10">
          <Star className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-[#6B7280]">No reviews yet. Be the first to leave one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
