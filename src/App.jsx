import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import MyBookingsPage from './pages/MyBookingsPage';

// Lazy-load pages that depend on Leaflet to keep the initial bundle small
const MapPage = lazy(() => import('./pages/MapPage'));
const PlaceDetailPage = lazy(() => import('./pages/PlaceDetailPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/place/:id" element={<PlaceDetailPage />} />
            <Route path="/bookings" element={<MyBookingsPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
