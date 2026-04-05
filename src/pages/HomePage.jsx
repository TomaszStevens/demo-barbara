import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, MapPin, Calendar, Star, Shield, Clock, ChevronRight } from 'lucide-react';
import { CATEGORIES, getPopularPlaces } from '../data/places';
import PlaceCard from '../components/PlaceCard';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const popular = getPopularPlaces(8);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Book local.
              <br />
              <span className="text-primary-200">Feel amazing.</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-primary-100 max-w-lg">
              Discover and book appointments at the best salons, spas, barbers, and wellness spots near you.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mt-8 flex items-center gap-2">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search salons, barbers, spas..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-300 shadow-xl"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-4 bg-accent-500 hover:bg-accent-600 rounded-2xl text-sm font-semibold transition-colors shadow-xl hidden md:block"
              >
                Search
              </button>
            </form>

            {/* Quick stats */}
            <div className="mt-8 flex items-center gap-6 text-sm text-primary-200">
              <span className="flex items-center gap-1.5">
                <MapPin size={16} /> Edinburgh & beyond
              </span>
              <span className="flex items-center gap-1.5">
                <Star size={16} /> 4.7 avg rating
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={16} /> Book instantly
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Browse by category</h2>
            <p className="text-gray-500 mt-1">Find exactly what you're looking for</p>
          </div>
          <Link to="/explore" className="hidden md:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
            View all <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/explore?category=${cat.id}`}
              className="group relative p-5 rounded-2xl bg-white border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 text-center"
            >
              <div
                className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform"
                style={{ background: `linear-gradient(135deg, ${cat.gradient[0]}20, ${cat.gradient[1]}20)` }}
              >
                {cat.icon}
              </div>
              <p className="text-sm font-medium text-gray-900">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Places */}
      <section className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popular near you</h2>
            <p className="text-gray-500 mt-1">Top-rated places in Edinburgh</p>
          </div>
          <Link to="/explore" className="hidden md:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
            Explore all <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {popular.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </section>

      {/* Map CTA */}
      <section className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <Link
          to="/map"
          className="block relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 md:p-12 group"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-20 w-48 h-48 bg-accent-500 rounded-full blur-3xl" />
          </div>
          <div className="relative flex items-center justify-between">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Explore the map</h3>
              <p className="text-gray-300 max-w-md">
                Find places near you with our interactive map. See what's available in your neighbourhood.
              </p>
            </div>
            <div className="hidden md:flex w-16 h-16 rounded-2xl bg-white/10 items-center justify-center group-hover:bg-white/20 transition-colors">
              <MapPin size={28} />
            </div>
          </div>
        </Link>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How Barbara works</h2>
          <p className="text-gray-500 mt-2">Book your next appointment in three easy steps</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Search, title: 'Discover', desc: 'Browse through local salons, spas, barbers, and more. Filter by category, location, or rating.' },
            { icon: Calendar, title: 'Book', desc: 'Choose your service, pick a team member, select your preferred date and time. Simple as that.' },
            { icon: Shield, title: 'Enjoy', desc: 'Turn up for your appointment and enjoy. Manage all your bookings in one place.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="text-center p-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
                <Icon size={28} className="text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
              B
            </div>
            <span className="text-sm text-gray-500">Barbara — Demo Booking Platform</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span>Edinburgh, Scotland</span>
            <span>Demo Site</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
