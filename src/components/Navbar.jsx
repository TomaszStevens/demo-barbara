import { Link, useLocation } from 'react-router-dom';
import { Search, MapPin, Calendar, Home, Compass } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navClass = (path) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-primary-50 text-primary-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;

  const mobileNavClass = (path) =>
    `flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors ${
      isActive(path)
        ? 'text-primary-600'
        : 'text-gray-400'
    }`;

  return (
    <>
      {/* Desktop navbar */}
      <nav className="hidden md:block sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg">
              B
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Barbara</span>
          </Link>

          <div className="flex items-center gap-1">
            <Link to="/" className={navClass('/')}>
              <Home size={18} />
              Home
            </Link>
            <Link to="/explore" className={navClass('/explore')}>
              <Compass size={18} />
              Explore
            </Link>
            <Link to="/map" className={navClass('/map')}>
              <MapPin size={18} />
              Map
            </Link>
            <Link to="/bookings" className={navClass('/bookings')}>
              <Calendar size={18} />
              My Bookings
            </Link>
          </div>

          <Link
            to="/explore"
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-sm text-gray-500 transition-colors w-56"
          >
            <Search size={16} />
            Search places...
          </Link>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-200/60 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around px-2 py-2">
          <Link to="/" className={mobileNavClass('/')}>
            <Home size={22} />
            Home
          </Link>
          <Link to="/explore" className={mobileNavClass('/explore')}>
            <Search size={22} />
            Explore
          </Link>
          <Link to="/map" className={mobileNavClass('/map')}>
            <MapPin size={22} />
            Map
          </Link>
          <Link to="/bookings" className={mobileNavClass('/bookings')}>
            <Calendar size={22} />
            Bookings
          </Link>
        </div>
      </nav>
    </>
  );
}
