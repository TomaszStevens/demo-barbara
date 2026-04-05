import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, X, CalendarX, ChevronRight } from 'lucide-react';
import { getUpcomingBookings, getPastBookings, cancelBooking } from '../store/bookings';
import { getPlaceById } from '../data/places';
import MapModal from '../components/MapModal';
import { format } from 'date-fns';

export default function MyBookingsPage() {
  const [tab, setTab] = useState('upcoming');
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [cancelId, setCancelId] = useState(null);
  const [mapBooking, setMapBooking] = useState(null);

  useEffect(() => {
    setUpcoming(getUpcomingBookings());
    setPast(getPastBookings());
  }, []);

  const handleCancel = (id) => {
    cancelBooking(id);
    setUpcoming(getUpcomingBookings());
    setPast(getPastBookings());
    setCancelId(null);
  };

  const bookings = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8 pb-24 md:pb-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">My Bookings</h1>
      <p className="text-gray-500 text-sm mb-6">Manage your appointments</p>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setTab('upcoming')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === 'upcoming'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          onClick={() => setTab('past')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === 'past'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Past ({past.length})
        </button>
      </div>

      {/* Bookings list */}
      {bookings.length > 0 ? (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm ${
                booking.status === 'cancelled' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex">
                {/* Color strip */}
                <div
                  className="w-1.5 flex-shrink-0"
                  style={{ background: booking.status === 'cancelled' ? '#9ca3af' : booking.placeGradient || '#7c6bf1' }}
                />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{booking.placeIcon || '📍'}</span>
                        <Link
                          to={`/place/${booking.placeId}`}
                          className="text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                        >
                          {booking.placeName}
                        </Link>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{booking.serviceName}</p>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={12} />
                          {format(new Date(booking.date), 'EEE d MMM yyyy')}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          {booking.time} ({booking.duration} min)
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <User size={12} />
                          {booking.staffName}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-sm font-bold text-primary-600">
                        {booking.price === 0 ? 'Free' : `£${booking.price}`}
                      </p>
                      {booking.status === 'cancelled' ? (
                        <span className="inline-block mt-1 text-[10px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          Cancelled
                        </span>
                      ) : booking.status === 'confirmed' && tab === 'upcoming' ? (
                        <span className="inline-block mt-1 text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          Confirmed
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Actions */}
                  {tab === 'upcoming' && booking.status !== 'cancelled' && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                      <Link
                        to={`/place/${booking.placeId}`}
                        className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-0.5"
                      >
                        View place <ChevronRight size={12} />
                      </Link>
                      <span className="text-gray-200">|</span>
                      <button
                        onClick={() => setMapBooking(booking)}
                        className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-0.5"
                      >
                        <MapPin size={11} /> View on map
                      </button>
                      <span className="text-gray-200">|</span>
                      {cancelId === booking.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Cancel this booking?</span>
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="text-xs font-medium text-red-600 hover:text-red-700"
                          >
                            Yes, cancel
                          </button>
                          <button
                            onClick={() => setCancelId(null)}
                            className="text-xs font-medium text-gray-500 hover:text-gray-700"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCancelId(booking.id)}
                          className="text-xs font-medium text-red-500 hover:text-red-600"
                        >
                          Cancel booking
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <CalendarX size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {tab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {tab === 'upcoming'
              ? 'Find a place you love and book your first appointment'
              : 'Your completed bookings will appear here'}
          </p>
          {tab === 'upcoming' && (
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Explore places
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      )}

      {/* Map modal for a booking */}
      {mapBooking && (() => {
        const place = getPlaceById(mapBooking.placeId);
        if (!place) return null;
        return (
          <MapModal
            places={[place]}
            title={mapBooking.placeName}
            subtitle={`${place.address}, ${place.area}, ${place.city}`}
            onClose={() => setMapBooking(null)}
          />
        );
      })()}
    </div>
  );
}
