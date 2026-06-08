import { motion } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuote } from '../context/QuoteContext';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { useSettings } from '../context/SettingsContext';
import MagneticButton from '../animations/MagneticButton';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'Tracking', href: '#tracking' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { openModal } = useQuote();
  const { scrollDirection, isAtTop } = useScrollDirection();
  const { logoUrl } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const isVisible = scrollDirection === 'up' || isAtTop;
  const isScrolled = !isAtTop;

  const scrollToSection = (href: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        if (href === '#home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } else {
      if (href === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? 'bg-[#800C30]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/10'
          : 'bg-transparent border-b border-white/10'
      }`}
    >
      <div className="flex items-center justify-between py-4 px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <motion.img
            src={logoUrl}
            alt="Phoenix Cargo Logo"
            className="h-12 sm:h-14 md:h-16 w-auto object-contain bg-white p-1 rounded-xl shadow-sm transition-all"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <motion.button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="relative px-4 py-2 text-xs tracking-wider font-semibold uppercase text-white/80 hover:text-white transition-colors"
              whileHover={{ y: -1 }}
            >
              {link.label}
              <motion.div
                className="absolute bottom-0 left-1/2 h-[2px] bg-cyan-400 rounded-full"
                initial={{ width: 0, x: '-50%' }}
                whileHover={{ width: '60%', x: '-50%' }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* CTA Button */}
          <MagneticButton
            onClick={openModal}
            className="px-5 py-2.5 text-xs font-bold uppercase bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 tracking-wider"
          >
            Get a Quote
          </MagneticButton>
        </div>
      </div>
    </motion.header>
  );
}
