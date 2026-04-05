import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, Map } from 'lucide-react';
import { places, CATEGORIES, searchPlaces } from '../data/places';
import PlaceCard from '../components/PlaceCard';
import MapModal from '../components/MapModal';

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

const PRICE_FILTERS = ['£', '££', '£££'];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const filteredPlaces = useMemo(() => {
    let results = query ? searchPlaces(query) : [...places];

    if (selectedCategory) {
      results = results.filter((p) => p.category === selectedCategory);
    }
    if (selectedPrice) {
      results = results.filter((p) => p.priceRange === selectedPrice);
    }

    results.sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'reviews': return b.reviewCount - a.reviewCount;
        case 'price_low': return a.priceRange.length - b.priceRange.length;
        case 'price_high': return b.priceRange.length - a.priceRange.length;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

    return results;
  }, [query, selectedCategory, selectedPrice, sortBy]);

  const handleCategoryClick = (catId) => {
    const newCat = selectedCategory === catId ? '' : catId;
    setSelectedCategory(newCat);
    setSearchParams((prev) => {
      if (newCat) prev.set('category', newCat);
      else prev.delete('category');
      return prev;
    });
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedPrice('');
    setSortBy('rating');
    setSearchParams({});
  };

  const hasFilters = query || selectedCategory || selectedPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 pb-24 md:pb-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Explore</h1>
        <p className="text-gray-500 mt-1">Find and book at {places.length} places near you</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, area, or category..."
          className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
            <X size={18} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-base">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between mt-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-600 hover:border-gray-300 transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>

          {/* Price filter pills */}
          {showFilters && PRICE_FILTERS.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPrice(selectedPrice === p ? '' : p)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedPrice === p
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {p}
            </button>
          ))}

          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-primary-600 hover:text-primary-700 font-medium ml-1">
              Clear all
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'} found
      </p>

      {/* Results grid */}
      {filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No places found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700">
            Clear all filters
          </button>
        </div>
      )}

      {/* Floating "View on map" button */}
      {filteredPlaces.length > 0 && (
        <button
          onClick={() => setShowMap(true)}
          className="fixed bottom-24 md:bottom-8 right-6 z-30 flex items-center gap-2 px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-xl text-sm font-semibold transition-colors"
        >
          <Map size={16} />
          View on map
        </button>
      )}

      {/* Map modal */}
      {showMap && (
        <MapModal
          places={filteredPlaces}
          title={`${filteredPlaces.length} places`}
          subtitle={selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.name : 'All categories'}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
}
