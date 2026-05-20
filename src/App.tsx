/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { AuthProvider } from './context/AuthContext';
import { QuoteProvider } from './context/QuoteContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import MobileBottomNav from './components/MobileBottomNav';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

import AboutSection from './components/AboutSection';
import OurServices from './components/OurServices';
import IndustriesSection from './components/IndustriesSection';
import WhyChooseSection from './components/WhyChooseSection';
import TrackingSection from './components/TrackingSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

import { doc, getDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const preloadImages = [
      'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/logonogb.png',
      'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/bg.jpg',
      'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/about.png',
    ];

    let imagesLoaded = false;
    let windowLoaded = false;
    let cmsLoaded = false;

    const checkLoadState = () => {
      if (imagesLoaded && windowLoaded && cmsLoaded) {
        setTimeout(() => {
          setIsPageLoading(false);
        }, 1500); // 1.5 seconds of buffer to guarantee rich loading presentation
      }
    };

    // 1. Check window load state
    if (document.readyState === 'complete') {
      windowLoaded = true;
    } else {
      const handleWindowLoad = () => {
        windowLoaded = true;
        checkLoadState();
        window.removeEventListener('load', handleWindowLoad);
      };
      window.addEventListener('load', handleWindowLoad);
    }

    // 2. Preload primary image assets
    let loadedCount = 0;
    const totalToLoad = preloadImages.length;

    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalToLoad) {
          imagesLoaded = true;
          checkLoadState();
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalToLoad) {
          imagesLoaded = true;
          checkLoadState();
        }
      };
    });

    // 3. Preload Firestore documents to populate offline cache
    const preloadCMS = async () => {
      try {
        await Promise.all([
          getDoc(doc(db, 'content', 'hero')),
          getDoc(doc(db, 'content', 'about'))
        ]);
      } catch (err) {
        console.error('Firestore cache pre-loading failure', err);
      } finally {
        cmsLoaded = true;
        checkLoadState();
      }
    };
    preloadCMS();

    // 4. Robust fallback safety timer
    const fallbackTimer = setTimeout(() => {
      imagesLoaded = true;
      windowLoaded = true;
      cmsLoaded = true;
      checkLoadState();
    }, 4500);

    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <QuoteProvider>
          <AnimatePresence mode="wait">
            {isPageLoading && <LoadingScreen key="global-preloader" />}
          </AnimatePresence>
          {!isPageLoading && (
            <>
              <AnimatedRoutes />
              <Chatbot />
            </>
          )}
        </QuoteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
