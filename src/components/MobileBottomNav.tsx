import { useState, useEffect } from 'react';
import { Home, PackageSearch, FileText, Phone, ShipWheel } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide bottom nav on scroll down, show on scroll up to maximize screen real estate
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    {
      icon: ShipWheel,
      label: 'Services',
      action: () => {
        if (location.pathname !== '/') {
          navigate('/');
          setTimeout(() => {
            document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        } else {
          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    { icon: PackageSearch, label: 'Track', path: '/tracking' },
    { icon: FileText, label: 'Quote', path: '/request-quote' },
    {
      icon: Phone,
      label: 'Contact',
      action: () => {
        if (location.pathname !== '/') {
          navigate('/');
          setTimeout(() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        } else {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
  ];

  // Don't show bottom nav inside the admin dashboard
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="md:hidden fixed bottom-4 left-4 right-4 z-50"
        >
          <div className="bg-[#0B2545]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex justify-between items-center px-2">
            {navItems.map((item, idx) => {
              const isActive = item.path && location.pathname === item.path;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.path) navigate(item.path);
                    if (item.action) item.action();
                  }}
                  className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all relative ${
                    isActive ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[10px] font-bold">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute bottom-1 w-1 h-1 rounded-full bg-cyan-400"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
