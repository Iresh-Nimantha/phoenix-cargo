/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { AuthProvider } from './context/AuthContext';
import { QuoteProvider } from './context/QuoteContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import MobileBottomNav from './components/MobileBottomNav';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FloatingContainer from './components/FloatingContainer';
import AboutSection from './components/AboutSection';
import OurServices from './components/OurServices';
import IndustriesSection from './components/IndustriesSection';
import WhyChooseSection from './components/WhyChooseSection';
import TrackingSection from './components/TrackingSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Lazy loaded pages
const TrackingDashboard = lazy(() => import('./components/TrackingDashboard'));
const RequestQuoteSection = lazy(() => import('./components/RequestQuoteSection'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));

function MainPage() {
  return (
    <div className="relative w-full min-h-screen bg-black text-gray-900 font-sans pb-16 md:pb-0">
      <Navbar />
      <Hero />
      <FloatingContainer />
      <AboutSection />
      <OurServices />
      <IndustriesSection />
      <WhyChooseSection />
      <TrackingSection />
      <ContactSection />
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/tracking"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <TrackingDashboard />
            </Suspense>
          }
        />
        <Route
          path="/request-quote"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <RequestQuoteSection />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <AdminDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QuoteProvider>
          <AnimatedRoutes />
          <Chatbot />
        </QuoteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
