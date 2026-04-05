const BOOKINGS_KEY = 'barbara_bookings';
const FAVOURITES_KEY = 'barbara_favourites';

function read(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getBookings() {
  return read(BOOKINGS_KEY).sort(
    (a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
  );
}

export function getUpcomingBookings() {
  const now = new Date();
  return getBookings().filter(
    (b) => new Date(`${b.date}T${b.time}`) >= now && b.status !== 'cancelled'
  );
}

export function getPastBookings() {
  const now = new Date();
  return getBookings().filter(
    (b) => new Date(`${b.date}T${b.time}`) < now || b.status === 'cancelled'
  );
}

export function addBooking(booking) {
  const bookings = read(BOOKINGS_KEY);
  const newBooking = {
    ...booking,
    id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  write(BOOKINGS_KEY, bookings);
  return newBooking;
}

export function cancelBooking(id) {
  const bookings = read(BOOKINGS_KEY);
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx !== -1) {
    bookings[idx].status = 'cancelled';
    write(BOOKINGS_KEY, bookings);
  }
  return bookings[idx];
}

export function getFavourites() {
  return read(FAVOURITES_KEY);
}

export function toggleFavourite(placeId) {
  const favs = read(FAVOURITES_KEY);
  const idx = favs.indexOf(placeId);
  if (idx === -1) {
    favs.push(placeId);
  } else {
    favs.splice(idx, 1);
  }
  write(FAVOURITES_KEY, favs);
  return favs;
}

export function isFavourite(placeId) {
  return read(FAVOURITES_KEY).includes(placeId);
}
