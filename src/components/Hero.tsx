import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../animations/gsap';
import { useIsMobile } from '../hooks/useMediaQuery';
import { ChevronDown, ArrowRight, Compass } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { useQuote } from '../context/QuoteContext';
import MagneticButton from '../animations/MagneticButton';

const defaultData = {
  title: 'PRECISION DELIVERY',
  subtitle: 'Your trusted partner in global freight forwarding and logistics solutions.',
  ctaText: 'Get a Quote',
  backgroundVideoUrl: [
    'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/afterbgvdo.mp4',
    'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/bg.jpg'
  ] as any,
  backgroundPosterUrl: '',
  useDarkOverlay: true,
};

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { openModal } = useQuote();
  const { content, loading } = useContent('hero', defaultData);
  const data = { ...defaultData, ...content };

  const { scrollY } = useScroll();
  const mediaScale = useTransform(scrollY, [0, 600], [1, 1.12]);
  const mediaOpacity = useTransform(scrollY, [0, 500], [1, 0.25]);
  const titleY = useTransform(scrollY, [0, 400], [0, 80]);
  const contentFadeY = useTransform(scrollY, [0, 300], [0, 40]);
  const contentOpacity = useTransform(scrollY, [0, 350], [1, 0]);

  // Support both single media links and arrays/comma lists without modifying original backend keys
  const backgroundMedia = useMemo(() => {
    const val = data.backgroundVideoUrl;
    if (Array.isArray(val)) {
      return val.filter(Boolean);
    }
    if (typeof val === 'string') {
      return val
        .split(',')
        .map((u) => u.trim())
        .filter(Boolean);
    }
    return ['https://assets.mixkit.co/videos/20179/20179-720.mp4'];
  }, [data.backgroundVideoUrl]);

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Auto-cycling background slideshow
  useEffect(() => {
    if (backgroundMedia.length <= 1) return;

    const currentUrl = backgroundMedia[activeMediaIndex] || '';
    const isVideo = urlIsVideo(currentUrl);

    const duration = isVideo ? 12000 : 6000;
    const timer = setTimeout(() => {
      setActiveMediaIndex((prev) => (prev + 1) % backgroundMedia.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [activeMediaIndex, backgroundMedia]);

  function urlIsVideo(url: string): boolean {
    return (
      url.match(/\.(mp4|webm|ogg|mov)($|\?)/i) !== null ||
      url.includes('video') ||
      url.includes('mixkit.co')
    );
  }

  // GSAP text split reveal
  useEffect(() => {
    if (!titleRef.current) return;

    const chars = titleRef.current.querySelectorAll('.hero-char');
    const anim = gsap.fromTo(
      chars,
      { opacity: 0, y: isMobile ? 30 : 80, rotateX: isMobile ? 0 : -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: isMobile ? 0.6 : 0.8,
        stagger: 0.03,
        ease: 'power3.out',
        delay: 0.3,
      }
    );

    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isMobile, data.title]);

  if (loading) {
    return <div className="w-full h-screen bg-[#0B2545]" />;
  }

  return (
    <section ref={sectionRef} id="home" className="relative w-full h-screen overflow-hidden">
      {/* Background Slideshow Layer */}
      <motion.div
        className="absolute inset-0 z-0 bg-black overflow-hidden"
        style={{ scale: mediaScale, opacity: mediaOpacity }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMediaIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {(() => {
              const url = backgroundMedia[activeMediaIndex] || '';
              const safeUrl = url.replace(/ /g, '%20');
              if (urlIsVideo(url)) {
                return (
                  <video
                    className="w-full h-full object-cover"
                    src={safeUrl}
                    autoPlay
                    playsInline
                    loop
                    muted
                    preload="auto"
                  />
                );
              } else {
                return (
                  <img
                    className="w-full h-full object-cover"
                    src={safeUrl}
                    alt="Alliance Freight Background"
                  />
                );
              }
            })()}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Dark Overlay Layer */}
      {(data.useDarkOverlay === true ||
        data.useDarkOverlay === 'true' ||
        data.useDarkOverlay === 1) && (
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/35 to-black/70" />
        )}

      {/* Hero Title - Navy blue theme color text color and outlines */}
      <motion.div
        className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none px-4 -translate-y-24 md:-translate-y-36"
        style={{ y: titleY }}
      >
        <h1
          ref={titleRef}
          className="uppercase font-black text-[#0B2545] w-full text-center text-[14vw] sm:text-[12vw] md:text-[11vw] lg:text-[10vw] tracking-[0.01em] leading-[0.82] select-none whitespace-normal pointer-events-auto"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            perspective: '600px',
            textShadow: `
              3px 0 0 rgba(255,255,255,0.95),
              -3px 0 0 rgba(255,255,255,0.95),
              0 3px 0 rgba(255,255,255,0.95),
              0 -3px 0 rgba(255,255,255,0.95),
              2px 2px 0 rgba(255,255,255,0.95),
              -2px -2px 0 rgba(255,255,255,0.95),
              2px -2px 0 rgba(255,255,255,0.95),
              -2px 2px 0 rgba(255,255,255,0.95),
              0 8px 24px rgba(0,0,0,0.50)
            `,
          }}
        >
          {data.title.split('').map((char: string, i: number) => (
            <span
              key={i}
              className="hero-char inline-block"
              style={{ display: 'inline-block', willChange: 'transform, opacity' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
      </motion.div>

      {/* Hero Overlaid Texts & Premium Buttons */}
      <motion.div
        style={{ y: contentFadeY, opacity: contentOpacity }}
        className="absolute inset-x-0 bottom-[22%] md:bottom-[16%] z-[30] flex flex-col items-center justify-center text-center px-6 max-w-3xl mx-auto pointer-events-auto"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-white text-sm md:text-lg font-bold tracking-wide uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] mb-6 max-w-xl text-center leading-relaxed"
        >
          {data.subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center pointer-events-auto"
        >
          <MagneticButton
            onClick={openModal}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold rounded-full transition-all shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 tracking-wider text-xs uppercase flex items-center justify-center gap-2 border border-white/10"
          >
            {data.ctaText} <ArrowRight className="w-4 h-4" />
          </MagneticButton>

          <MagneticButton
            onClick={() => navigate('/tracking')}
            className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-extrabold rounded-full transition-all shadow-xl hover:shadow-white/10 tracking-wider text-xs uppercase flex items-center justify-center gap-2"
          >
            Track Shipment <Compass className="w-4 h-4" />
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <span className="text-white/50 text-[9px] uppercase tracking-[0.35em] font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
