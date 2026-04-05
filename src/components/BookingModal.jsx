import { useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Clock, User, Calendar, CreditCard, MapPin } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { generateTimeSlots } from '../data/places';
import { addBooking } from '../store/bookings';
import MapModal from './MapModal';

const STEPS = ['Service', 'Staff', 'Date & Time', 'Confirm'];

export default function BookingModal({ place, initialService = null, onClose, onBooked }) {
  const [step, setStep] = useState(initialService ? 1 : 0);
  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [booked, setBooked] = useState(false);

  const dates = useMemo(() => {
    const d = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      d.push(addDays(today, i));
    }
    return d;
  }, []);

  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return generateTimeSlots(selectedDate, place.openingHours);
  }, [selectedDate, place.openingHours]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(1);
  };

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleConfirm = () => {
    const booking = addBooking({
      placeId: place.id,
      placeName: place.name,
      placeCategory: place.category,
      placeGradient: place.gradient,
      placeIcon: place.categoryInfo.icon,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      staffId: selectedStaff?.id || 'any',
      staffName: selectedStaff?.name || 'Any available',
      placeAddress: place.address,
      placeArea: place.area,
      placeCity: place.city,
      placePostcode: place.postcode,
      placeLat: place.lat,
      placeLng: place.lng,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      duration: selectedService.duration,
      price: selectedService.price,
    });
    setBooked(true);
    if (onBooked) onBooked(booking);
  };

  const canGoNext = () => {
    if (step === 0) return !!selectedService;
    if (step === 1) return true; // staff is optional (Any available)
    if (step === 2) return !!selectedDate && !!selectedTime;
    return true;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full md:w-[520px] md:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-hidden animate-slide-up md:animate-scale-in shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {step > 0 && !booked && (
              <button onClick={() => setStep(step - 1)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">
                {booked ? 'Booking Confirmed!' : `Book at ${place.name}`}
              </h3>
              {!booked && (
                <p className="text-xs text-gray-500 mt-0.5">{STEPS[step]}</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Progress bar */}
        {!booked && (
          <div className="flex gap-1 px-5 pt-3">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full flex-1 transition-colors ${
                  i <= step ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="px-5 py-4 overflow-y-auto max-h-[60vh]">
          {booked ? (
            <SuccessScreen
              place={place}
              service={selectedService}
              staff={selectedStaff}
              date={selectedDate}
              time={selectedTime}
              onClose={onClose}
            />
          ) : step === 0 ? (
            <ServiceStep services={place.services} selected={selectedService} onSelect={handleServiceSelect} />
          ) : step === 1 ? (
            <StaffStep staff={place.staff} selected={selectedStaff} onSelect={handleStaffSelect} />
          ) : step === 2 ? (
            <DateTimeStep
              dates={dates}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              timeSlots={timeSlots}
              onDateSelect={handleDateSelect}
              onTimeSelect={handleTimeSelect}
            />
          ) : (
            <ConfirmStep
              place={place}
              service={selectedService}
              staff={selectedStaff}
              date={selectedDate}
              time={selectedTime}
              onConfirm={handleConfirm}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceStep({ services, selected, onSelect }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500 mb-3">Choose a service to book</p>
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => onSelect(service)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
            selected?.id === service.id
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-100 hover:border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">{service.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} /> {service.duration} min
                </span>
              </div>
            </div>
            <span className="text-sm font-semibold text-primary-600">
              {service.price === 0 ? 'Free' : `£${service.price}`}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

function StaffStep({ staff, selected, onSelect }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500 mb-3">Choose a team member (or skip for any available)</p>
      <button
        onClick={() => onSelect(null)}
        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
          selected === null
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-100 hover:border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={18} className="text-gray-500" />
          </div>
          <div>
            <p className="font-medium text-sm text-gray-900">Any available</p>
            <p className="text-xs text-gray-500">First available team member</p>
          </div>
        </div>
      </button>
      {staff.map((member) => (
        <button
          key={member.id}
          onClick={() => onSelect(member)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
            selected?.id === member.id
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-100 hover:border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{ background: member.avatar }}
            >
              {member.avatarInitials}
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900">{member.name}</p>
              <p className="text-xs text-gray-500">{member.role}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function DateTimeStep({ dates, selectedDate, selectedTime, timeSlots, onDateSelect, onTimeSelect }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-3">Pick a date and time</p>

      {/* Date scroller */}
      <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar">
        {dates.map((date) => {
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateSelect(date)}
              className={`flex-shrink-0 w-16 py-3 rounded-xl text-center transition-all ${
                isSelected
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className={`text-[10px] font-medium ${isSelected ? 'text-primary-100' : 'text-gray-400'}`}>
                {format(date, 'EEE')}
              </div>
              <div className="text-lg font-bold mt-0.5">{format(date, 'd')}</div>
              <div className={`text-[10px] ${isSelected ? 'text-primary-100' : 'text-gray-400'}`}>
                {format(date, 'MMM')}
              </div>
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Available times</p>
          {timeSlots.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">Closed on this day</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map(({ time, available }) => (
                <button
                  key={time}
                  disabled={!available}
                  onClick={() => onTimeSelect(time)}
                  className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-200'
                      : available
                      ? 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ConfirmStep({ place, service, staff, date, time, onConfirm }) {
  const [showMap, setShowMap] = useState(false);

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">Review your booking details</p>

      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ background: place.gradient }}>
            <span className="text-sm">{place.categoryInfo.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900">{place.name}</p>
            <p className="text-xs text-gray-500">{place.address}, {place.area}</p>
          </div>
          <button
            onClick={() => setShowMap(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-colors flex-shrink-0"
          >
            <MapPin size={12} />
            Map
          </button>
        </div>

      {showMap && (
        <MapModal
          places={[place]}
          title={place.name}
          subtitle={`${place.address}, ${place.area}, ${place.city}`}
          onClose={() => setShowMap(false)}
        />
      )}

        <div className="border-t border-gray-200 pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 flex items-center gap-2">
              <CreditCard size={14} /> Service
            </span>
            <span className="text-sm font-medium text-gray-900">{service.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 flex items-center gap-2">
              <User size={14} /> With
            </span>
            <span className="text-sm font-medium text-gray-900">{staff?.name || 'Any available'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 flex items-center gap-2">
              <Calendar size={14} /> Date
            </span>
            <span className="text-sm font-medium text-gray-900">{format(date, 'EEE d MMM yyyy')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 flex items-center gap-2">
              <Clock size={14} /> Time
            </span>
            <span className="text-sm font-medium text-gray-900">{time}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 flex items-center gap-2">
              <Clock size={14} /> Duration
            </span>
            <span className="text-sm font-medium text-gray-900">{service.duration} min</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Total</span>
          <span className="text-lg font-bold text-primary-600">
            {service.price === 0 ? 'Free' : `£${service.price}`}
          </span>
        </div>
      </div>

      <button
        onClick={onConfirm}
        className="w-full mt-4 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-primary-200"
      >
        Confirm Booking
      </button>
    </div>
  );
}

function SuccessScreen({ place, service, staff, date, time, onClose }) {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
        <Check size={32} className="text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">You're all set!</h3>
      <p className="text-sm text-gray-500 mb-6">Your appointment has been confirmed</p>

      <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-6">
        <p className="font-medium text-sm">{service.name}</p>
        <p className="text-xs text-gray-500">at {place.name}</p>
        <p className="text-xs text-gray-500">with {staff?.name || 'Any available'}</p>
        <p className="text-sm font-medium text-primary-600">
          {format(date, 'EEEE d MMMM')} at {time}
        </p>
        <button
          onClick={() => setShowMap(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 mt-1"
        >
          <MapPin size={12} />
          View on map
        </button>
      </div>

      <button
        onClick={onClose}
        className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold text-sm transition-colors"
      >
        Done
      </button>

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
