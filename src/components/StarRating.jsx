import { Star } from 'lucide-react';

export default function StarRating({ rating, size = 16, showValue = true }) {
  const stars = [];
  const full = Math.floor(rating);
  const partial = rating - full;

  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(
        <Star key={i} size={size} className="fill-amber-400 text-amber-400" />
      );
    } else if (i === full && partial >= 0.5) {
      stars.push(
        <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
          <Star size={size} className="text-gray-300 absolute" />
          <span className="absolute overflow-hidden" style={{ width: '50%' }}>
            <Star size={size} className="fill-amber-400 text-amber-400" />
          </span>
        </span>
      );
    } else {
      stars.push(
        <Star key={i} size={size} className="text-gray-300" />
      );
    }
  }

  return (
    <span className="inline-flex items-center gap-0.5">
      {stars}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-gray-700">{rating}</span>
      )}
    </span>
  );
}
