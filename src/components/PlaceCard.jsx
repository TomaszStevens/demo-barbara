import { Link } from 'react-router-dom';
import { MapPin, Clock, Heart } from 'lucide-react';
import StarRating from './StarRating';
import { toggleFavourite, isFavourite } from '../store/bookings';
import { useState } from 'react';

export default function PlaceCard({ place, compact = false }) {
  const [fav, setFav] = useState(() => isFavourite(place.id));

  const handleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavourite(place.id);
    setFav(!fav);
  };

  return (
    <Link
      to={`/place/${place.id}`}
      className={`group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 ${
        compact ? '' : ''
      }`}
    >
      {/* Thumbnail */}
      <div
        className={`relative overflow-hidden ${compact ? 'h-36' : 'h-44'}`}
        style={{ background: place.gradient }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${compact ? 'text-5xl' : 'text-6xl'} opacity-40 group-hover:scale-110 transition-transform duration-300`}>
            {place.categoryInfo.icon}
          </span>
        </div>
        {/* Favourite button */}
        <button
          onClick={handleFav}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <Heart
            size={16}
            className={fav ? 'fill-accent-500 text-accent-500' : 'text-gray-500'}
          />
        </button>
        {/* Category pill */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 shadow-sm">
            {place.categoryInfo.name}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className={`${compact ? 'p-3' : 'p-4'}`}>
        <h3 className={`font-semibold text-gray-900 group-hover:text-primary-600 transition-colors ${compact ? 'text-sm' : 'text-base'}`}>
          {place.name}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <StarRating rating={place.rating} size={14} />
          <span className="text-xs text-gray-400">({place.reviewCount})</span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-gray-500">
          <MapPin size={13} className="shrink-0" />
          <span className="text-xs truncate">{place.area}, {place.city}</span>
        </div>
        {!compact && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs font-medium text-primary-600">{place.priceRange}</span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock size={12} />
              {place.openingHours.Mon !== 'Closed' ? place.openingHours.Mon : 'See hours'}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
