import { Star } from "lucide-react";

export function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= Math.round(rating) ? "text-secondary-500 fill-secondary-500" : "text-gray-300"}`}
        />
      ))}
      <span className="text-sm text-[#6B7280] ml-1">
        {rating.toFixed(1)}{count !== undefined ? ` (${count})` : ""}
      </span>
    </div>
  );
}
