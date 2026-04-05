import { useEffect, useRef, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
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

function FitBounds({ places }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (places.length > 0 && !fitted.current) {
      const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      fitted.current = true;
    }
  }, [places, map]);

  return null;
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

export default function MapView({ places, center, zoom = 13, className = '' }) {
  const defaultCenter = center || [55.9533, -3.1883]; // Edinburgh

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
      <FitBounds places={places} />
      {places.map((place) => (
        <PlaceMarker key={place.id} place={place} />
      ))}
    </MapContainer>
  );
}
