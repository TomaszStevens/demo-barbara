import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Phone, Clock, Star, Heart, Share2,
  ChevronRight, Calendar, Users, MessageSquare, Info
} from 'lucide-react';
import { getPlaceById } from '../data/places';
import StarRating from '../components/StarRating';
import BookingModal from '../components/BookingModal';
import MapView from '../components/MapView';
import MapModal from '../components/MapModal';
import { toggleFavourite, isFavourite } from '../store/bookings';
import { format } from 'date-fns';

const TABS = [
  { id: 'services', label: 'Services', icon: Calendar },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  { id: 'info', label: 'Info', icon: Info },
];

export default function PlaceDetailPage() {
  const { id } = useParams();
  const place = getPlaceById(id);
  const [activeTab, setActiveTab] = useState('services');
  const [bookingService, setBookingService] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [fav, setFav] = useState(() => isFavourite(id));
  const navigate = useNavigate();

  if (!place) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Place not found</h2>
        <Link to="/explore" className="text-primary-600 text-sm font-medium">Back to Explore</Link>
      </div>
    );
  }

  const handleBook = (service = null) => {
    setBookingService(service);
    setShowBooking(true);
  };

  const handleFav = () => {
    toggleFavourite(place.id);
    setFav(!fav);
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = dayNames[new Date().getDay()];

  return (
    <div className="pb-24 md:pb-8 animate-fade-in">
      {/* Hero */}
      <div className="relative h-56 md:h-72" style={{ background: place.gradient }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl md:text-9xl opacity-30">{place.categoryInfo.icon}</span>
        </div>
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFav}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            >
              <Heart size={18} className={fav ? 'fill-accent-500 text-accent-500' : 'text-gray-600'} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors">
              <Share2 size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Place header */}
        <div className="-mt-8 relative">
          <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md text-xs font-medium" style={{
                    background: `${place.categoryInfo.gradient[0]}15`,
                    color: place.categoryInfo.gradient[0]
                  }}>
                    {place.categoryInfo.name}
                  </span>
                  <span className="text-xs text-gray-400">{place.priceRange}</span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">{place.name}</h1>
                <p className="text-sm text-gray-500 mt-1">{place.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-1">
                <StarRating rating={place.rating} size={16} />
                <span className="text-sm text-gray-500">({place.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin size={14} />
                {place.address}, {place.area}, {place.city}
                <button
                  onClick={() => setShowMap(true)}
                  className="ml-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                >
                  View on map
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Clock size={14} className="text-green-500" />
                <span>
                  {place.openingHours[today] === 'Closed' ? (
                    <span className="text-red-500 font-medium">Closed today</span>
                  ) : (
                    <>Open today: <span className="font-medium">{place.openingHours[today]}</span></>
                  )}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleBook()}
              className="mt-5 w-full md:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-primary-200"
            >
              Book Appointment
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <div className="flex gap-1 overflow-x-auto hide-scrollbar">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={16} />
                {label}
                {id === 'reviews' && (
                  <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{place.reviews.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {activeTab === 'services' && (
            <ServicesTab services={place.services} onBook={handleBook} />
          )}
          {activeTab === 'team' && (
            <TeamTab staff={place.staff} />
          )}
          {activeTab === 'reviews' && (
            <ReviewsTab reviews={place.reviews} rating={place.rating} reviewCount={place.reviewCount} />
          )}
          {activeTab === 'info' && (
            <InfoTab place={place} />
          )}
        </div>
      </div>

      {/* Booking modal */}
      {showBooking && (
        <BookingModal
          place={place}
          initialService={bookingService}
          onClose={() => setShowBooking(false)}
        />
      )}

      {/* Map modal */}
      {showMap && (
        <MapModal
          places={[place]}
          title={place.name}
          subtitle={`${place.address}, ${place.area}, ${place.city}`}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
}

function ServicesTab({ services, onBook }) {
  return (
    <div className="space-y-3">
      {services.map((service) => (
        <div
          key={service.id}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
        >
          <div className="flex-1 mr-4">
            <h4 className="text-sm font-semibold text-gray-900">{service.name}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={12} /> {service.duration} min
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold text-primary-600">
              {service.price === 0 ? 'Free' : `£${service.price}`}
            </p>
            <button
              onClick={() => onBook(service)}
              className="mt-2 px-4 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Book
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamTab({ staff }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {staff.map((member) => (
        <div key={member.id} className="bg-white rounded-xl p-5 border border-gray-100 text-center">
          <div
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-xl mb-3"
            style={{ background: member.avatar }}
          >
            {member.avatarInitials}
          </div>
          <h4 className="text-sm font-semibold text-gray-900">{member.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{member.role}</p>
        </div>
      ))}
    </div>
  );
}

function ReviewsTab({ reviews, rating, reviewCount }) {
  return (
    <div>
      {/* Summary */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 mb-6 flex items-center gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">{rating}</div>
          <StarRating rating={rating} size={14} showValue={false} />
          <p className="text-xs text-gray-500 mt-1">{reviewCount} reviews</p>
        </div>
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter((r) => r.rating === stars).length;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500 w-3">{stars}</span>
                <Star size={10} className="fill-amber-400 text-amber-400" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-6">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                  {review.author.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{review.author}</p>
                  <p className="text-[10px] text-gray-400">{format(new Date(review.date), 'd MMM yyyy')}</p>
                </div>
              </div>
              <StarRating rating={review.rating} size={12} showValue={false} />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoTab({ place }) {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Opening hours */}
      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock size={16} /> Opening Hours
        </h3>
        <div className="space-y-2">
          {dayNames.map((day, i) => (
            <div
              key={day}
              className={`flex items-center justify-between py-1.5 text-sm ${
                i === todayIdx ? 'font-semibold text-primary-600' : 'text-gray-600'
              }`}
            >
              <span className="flex items-center gap-2">
                {day}
                {i === todayIdx && (
                  <span className="text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full font-medium">
                    Today
                  </span>
                )}
              </span>
              <span>{place.openingHours[day]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={16} /> Location
          </h3>
          <p className="text-sm text-gray-600">{place.address}</p>
          <p className="text-sm text-gray-600">{place.area}, {place.city}</p>
          <p className="text-sm text-gray-600">{place.postcode}</p>
          <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-2">
            <Phone size={13} /> {place.phone}
          </p>
        </div>

        {/* Mini map */}
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 h-48">
          <MapView
            places={[place]}
            center={[place.lat, place.lng]}
            zoom={15}
          />
        </div>
      </div>
    </div>
  );
}
