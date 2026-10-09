import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, onRate = null, readonly = false, size = 20 }) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating || rating;

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isFilled = starIndex <= displayRating;
        return (
          <Star
            key={starIndex}
            size={size}
            className={`star-icon ${isFilled ? 'star-filled' : 'star-empty'}`}
            style={{ cursor: readonly ? 'default' : 'pointer' }}
            onMouseEnter={() => !readonly && setHoverRating(starIndex)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            onClick={() => !readonly && onRate && onRate(starIndex)}
          />
        );
      })}
    </div>
  );
}
