import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Locate } from 'lucide-react';
import StarRating from './StarRating';

// Fix default marker icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Cache icons by category — only create each once
const iconCache = new Map();

function getCategoryIcon(color, icon) {
  const key = `${color}_${icon}`;
  if (!iconCache.has(key)) {
    iconCache.set(
      key,
      L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 36px; height: 36px;
            background: ${color};
            border-radius: 50% 50% 50% 4px;
            transform: rotate(-45deg);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.25);
            border: 2px solid white;
          ">
            <span style="transform: rotate(45deg); font-size: 16px; line-height: 1;">${icon}</span>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [4, 36],
        popupAnchor: [14, -30],
      })
    );
  }
  return iconCache.get(key);
}

// Blue pulsing dot for user location
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="position:relative; width:20px; height:20px;">
      <div style="
        position:absolute; inset:-8px;
        background: rgba(59,130,246,0.15);
        border-radius: 50%;
        animation: pulse-ring 2s ease-out infinite;
      "></div>
      <div style="
        width:20px; height:20px;
        background: #3b82f6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(59,130,246,0.5);
      "></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function FitBounds({ places, userLocation }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current) return;

    // If we have user location, center on them at a nice zoom
    if (userLocation) {
      map.setView(userLocation, 14);
      fitted.current = true;
      return;
    }

    // Otherwise fit to all places
    if (places.length > 0) {
      const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      fitted.current = true;
    }
  }, [places, userLocation, map]);

  return null;
}

// Re-center map on user when location arrives after initial load
function FlyToUser({ userLocation }) {
  const map = useMap();
  const flown = useRef(false);

  useEffect(() => {
    if (userLocation && !flown.current) {
      map.flyTo(userLocation, 14, { duration: 1.2 });
      flown.current = true;
    }
  }, [userLocation, map]);

  return null;
}

// Button to re-centre on user
function LocateButton({ userLocation, onLocate }) {
  const map = useMap();

  const handleClick = () => {
    if (userLocation) {
      map.flyTo(userLocation, 15, { duration: 0.8 });
    } else if (onLocate) {
      onLocate();
    }
  };

  return (
    <div className="leaflet-top leaflet-right" style={{ pointerEvents: 'auto' }}>
      <button
        onClick={handleClick}
        className="!ml-0 mt-3 mr-3 w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        title="My location"
      >
        <Locate size={18} className={userLocation ? 'text-blue-500' : 'text-gray-500'} />
      </button>
    </div>
  );
}

// Only render popup content when the popup is actually open
function LazyPopup({ place }) {
  const [opened, setOpened] = useState(false);

  return (
    <Popup
      eventHandlers={{ add: () => setOpened(true), remove: () => setOpened(false) }}
    >
      {opened ? (
        <Link to={`/place/${place.id}`} className="block p-3 no-underline">
          <div
            className="w-full h-20 rounded-lg mb-2 flex items-center justify-center"
            style={{ background: place.gradient }}
          >
            <span className="text-3xl opacity-50">{place.categoryInfo.icon}</span>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{place.name}</h3>
          <div className="mb-1">
            <StarRating rating={place.rating} size={12} />
          </div>
          <p className="text-xs text-gray-500">{place.area}, {place.city}</p>
          <p className="text-xs font-medium text-primary-600 mt-1">View & Book &rarr;</p>
        </Link>
      ) : null}
    </Popup>
  );
}

// Memoize individual markers so they don't re-render when siblings change
const PlaceMarker = ({ place }) => {
  const icon = useMemo(
    () => getCategoryIcon(place.categoryInfo.mapColor, place.categoryInfo.icon),
    [place.categoryInfo.mapColor, place.categoryInfo.icon]
  );

  return (
    <Marker position={[place.lat, place.lng]} icon={icon}>
      <LazyPopup place={place} />
    </Marker>
  );
};

export default function MapView({
  places,
  center,
  zoom = 13,
  className = '',
  userLocation = null,
  onRequestLocation,
  showLocateButton = false,
}) {
  const defaultCenter = center || userLocation || [55.9533, -3.1883];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={zoom}
      className={`w-full h-full ${className}`}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <FitBounds places={places} userLocation={userLocation} />
      <FlyToUser userLocation={userLocation} />

      {showLocateButton && (
        <LocateButton userLocation={userLocation} onLocate={onRequestLocation} />
      )}

      {/* User location marker */}
      {userLocation && (
        <>
          <Circle
            center={userLocation}
            radius={120}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.08,
              weight: 1,
              opacity: 0.3,
            }}
          />
          <Marker position={userLocation} icon={userLocationIcon} zIndexOffset={1000}>
            <Popup>
              <div className="p-2 text-center">
                <p className="text-sm font-semibold text-gray-900">You are here</p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        </>
      )}

      {places.map((place) => (
        <PlaceMarker key={place.id} place={place} />
      ))}
    </MapContainer>
  );
}
