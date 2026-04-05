import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, List, X, MapPin } from 'lucide-react';
import { places, CATEGORIES } from '../data/places';
import MapView from '../components/MapView';
import StarRating from '../components/StarRating';

export default function MapPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showList, setShowList] = useState(false);

  const filteredPlaces = useMemo(() => {
    let results = [...places];
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q) ||
          p.categoryInfo.name.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      results = results.filter((p) => p.category === selectedCategory);
    }
    return results;
  }, [query, selectedCategory]);

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] relative flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`
          ${showList ? 'translate-y-0' : 'translate-y-[calc(100%-56px)]'}
          md:translate-y-0
          fixed md:relative bottom-0 left-0 right-0 md:bottom-auto
          z-20 md:z-auto
          bg-white md:bg-white
          rounded-t-2xl md:rounded-none
          shadow-2xl md:shadow-none
          transition-transform duration-300 md:transition-none
          w-full md:w-96 md:border-r border-gray-200
          flex flex-col
          max-h-[70vh] md:max-h-none md:h-full
        `}
      >
        {/* Mobile drag handle */}
        <button
          onClick={() => setShowList(!showList)}
          className="md:hidden flex items-center justify-center py-2"
        >
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </button>

        {/* Mobile toggle bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-2">
          <span className="text-sm font-medium text-gray-900">
            {filteredPlaces.length} places
          </span>
          <button
            onClick={() => setShowList(!showList)}
            className="flex items-center gap-1 text-sm text-primary-600 font-medium"
          >
            <List size={16} />
            {showList ? 'Hide list' : 'Show list'}
          </button>
        </div>

        {/* Search and filters */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search on map..."
              className="w-full pl-9 pr-8 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={14} className="text-gray-400" />
              </button>
            )}
          </div>
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setSelectedCategory('')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !selectedCategory ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Place list */}
        <div className="flex-1 overflow-y-auto">
          {filteredPlaces.map((place) => (
            <Link
              key={place.id}
              to={`/place/${place.id}`}
              className="flex gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: place.gradient }}
              >
                <span className="text-xl opacity-60">{place.categoryInfo.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">{place.name}</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <StarRating rating={place.rating} size={11} />
                  <span className="text-[10px] text-gray-400">({place.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <MapPin size={11} />
                  {place.area}, {place.city}
                </div>
              </div>
              <span className="text-xs font-medium text-primary-600 self-center">{place.priceRange}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapView places={filteredPlaces} />
      </div>
    </div>
  );
}
