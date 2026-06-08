import { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const { content } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[72px] px-[5vw] transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(13,12,11,0.97)] backdrop-blur-xl border-b border-fire-orange/15 shadow-[0_4px_30px_rgba(0,0,0,0.25)]'
          : 'bg-white/5 backdrop-blur-md border-b border-white/5'
      }`}
    >
      {/* Logo */}
      <a href="#" className="flex items-center gap-3 group">
        <img
          src="/images/phoenix-cargo-logo.jpeg"
          alt={content.nav.logoAlt}
          onError={(e) => { e.currentTarget.src = '/logo.png'; }}
          className="h-10 w-auto rounded"
        />
        <span className="font-display text-lg font-bold tracking-[1.5px] text-white hidden sm:block uppercase">
          PHOENIX CARGO
        </span>
      </a>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-8">
        {content.nav.links.map((link, i) => (
          <motion.a
            key={i}
            href={link.href}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i + 0.3, duration: 0.4 }}
            className="group relative font-cond text-[13px] tracking-[1.5px] uppercase font-semibold text-ash-200 hover:text-white transition-colors py-1"
          >
            {link.label}
            <span className="absolute inset-x-0 -bottom-1 h-[2px] bg-gradient-to-r from-fire-orange to-fire-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
          </motion.a>
        ))}
        <motion.a
          href={content.nav.ctaHref}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="relative font-cond text-xs tracking-[1.5px] uppercase font-extrabold text-white px-6 py-2.5 rounded-full bg-gradient-to-r from-fire-orange to-fire-amber hover:shadow-[0_4px_24px_rgba(232,97,10,0.5)] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_2px_12px_rgba(232,97,10,0.3)]"
        >
          {content.nav.ctaLabel}
        </motion.a>
      </nav>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden p-2 text-ash-200 hover:text-white transition-colors"
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[72px] bg-ash-900/98 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 p-8"
          >
            {content.nav.links.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="font-cond text-2xl tracking-[2px] uppercase font-semibold text-ash-200 hover:text-fire-orange transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href={content.nav.ctaHref}
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="w-full max-w-xs text-center font-cond text-base tracking-[1px] uppercase font-bold text-white px-8 py-4 rounded bg-gradient-to-r from-fire-crimson to-fire-orange mt-4"
            >
              {content.nav.ctaLabel}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
