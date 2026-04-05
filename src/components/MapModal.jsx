import { lazy, Suspense } from 'react';
import { X, MapPin, Navigation } from 'lucide-react';

// Lazy-load so Leaflet isn't pulled in until the modal actually opens
const MapView = lazy(() => import('./MapView'));

export default function MapModal({ places, title, subtitle, onClose }) {
  return (
    <div className="fixed inset-0 z-[90] flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative flex flex-col m-3 md:m-8 flex-1 rounded-2xl overflow-hidden shadow-2xl animate-scale-in bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
              <MapPin size={16} className="text-primary-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{title}</h3>
              {subtitle && (
                <p className="text-xs text-gray-500 truncate">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                  <span className="text-sm text-gray-400">Loading map...</span>
                </div>
              </div>
            }
          >
            <MapView
              places={places}
              center={places.length === 1 ? [places[0].lat, places[0].lng] : undefined}
              zoom={places.length === 1 ? 16 : 13}
            />
          </Suspense>
        </div>

        {/* Footer — single-place mode shows address + directions hint */}
        {places.length === 1 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-white flex items-center justify-between">
            <div className="text-xs text-gray-500 flex items-center gap-1.5">
              <Navigation size={12} />
              {places[0].address}, {places[0].area}, {places[0].city} {places[0].postcode}
            </div>
            <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
              {places[0].lat.toFixed(4)}, {places[0].lng.toFixed(4)}
            </span>
          </div>
        )}
        {places.length > 1 && (
          <div className="px-4 py-2.5 border-t border-gray-100 bg-white">
            <p className="text-xs text-gray-500 text-center">
              Showing {places.length} {places.length === 1 ? 'place' : 'places'} — click a marker for details
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
