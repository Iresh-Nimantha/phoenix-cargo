import { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const { content } = useContent();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[64px] md:h-[72px] px-4 sm:px-6 lg:px-[5vw] transition-all duration-300 ${scrolled
        ? 'bg-[rgba(13,12,11,0.97)] backdrop-blur-xl border-b border-fire-orange/15 shadow-[0_4px_30px_rgba(0,0,0,0.25)]'
        : 'bg-white/5 backdrop-blur-md border-b border-white/5'
        }`}
    >
      {/* Logo */}
      <a href="#" className="flex items-center gap-2 sm:gap-3 group">
        <img
          src="/images/logo1.png"
          alt={content.nav.logoAlt}
          onError={(e) => {
            e.currentTarget.src = '/logo1.png';
          }}
          className="h-12 sm:h-12 w-auto rounded flex-shrink-0"
        />

        <span className="font-display text-xs sm:text-sm md:text-lg font-bold tracking-[1px] sm:tracking-[1.5px] text-white uppercase whitespace-nowrap">
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
            transition={{
              delay: 0.1 * i + 0.3,
              duration: 0.4,
            }}
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
          transition={{
            delay: 0.7,
            duration: 0.4,
          }}
          className="relative font-cond text-xs tracking-[1.5px] uppercase font-extrabold text-white px-6 py-2.5 rounded-full bg-gradient-to-r from-fire-orange to-fire-amber hover:shadow-[0_4px_24px_rgba(232,97,10,0.5)] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_2px_12px_rgba(232,97,10,0.3)]"
        >
          {content.nav.ctaLabel}
        </motion.a>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden relative z-[60] p-2 text-white"
        aria-label="Toggle navigation"
      >
        <AnimatePresence mode="wait">
          {mobileOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Menu size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 220,
              }}
              className="
                fixed
                top-0
                right-0
                h-screen
                w-[85%]
                max-w-[380px]
                z-50
                lg:hidden
                bg-[rgba(13,12,11,0.98)]
                backdrop-blur-2xl
                border-l
                border-fire-orange/10
                shadow-[-20px_0_60px_rgba(0,0,0,0.5)]
                flex
                flex-col
              "
            >
              {/* Drawer Header */}
              <div className="h-[64px] md:h-[72px] flex items-center gap-3 px-6 border-b border-white/5">
                <img
                  src="/logo1.png"
                  alt={content.nav.logoAlt}
                  className="h-10 w-auto flex-shrink-0"
                />

                <span className="font-display text-sm sm:text-base font-bold tracking-[1.5px] text-white uppercase leading-none">
                  PHOENIX CARGO
                </span>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-6">
                <nav className="flex flex-col">
                  {content.nav.links.map((link, i) => (
                    <motion.a
                      key={i}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        delay: i * 0.08,
                      }}
                      className="
                        group
                        flex
                        items-center
                        justify-between
                        px-6
                        py-5
                        border-b
                        border-white/5
                        text-white
                        font-cond
                        uppercase
                        tracking-[2px]
                        text-sm
                        hover:bg-fire-orange/5
                        transition-all
                      "
                    >
                      {link.label}

                      <span className="w-2 h-2 rounded-full bg-fire-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  ))}
                </nav>
              </div>

              {/* CTA */}
              <div className="p-6 border-t border-white/5">
                <motion.a
                  href={content.nav.ctaHref}
                  onClick={() => setMobileOpen(false)}
                  whileTap={{ scale: 0.98 }}
                  className="
                    block
                    w-full
                    text-center
                    py-4
                    rounded-xl
                    font-cond
                    font-bold
                    uppercase
                    tracking-[1.5px]
                    text-white
                    bg-gradient-to-r
                    from-fire-orange
                    to-fire-amber
                    shadow-[0_10px_30px_rgba(232,97,10,0.35)]
                  "
                >
                  {content.nav.ctaLabel}
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}