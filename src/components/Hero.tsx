import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../animations/gsap';
import { useIsMobile } from '../hooks/useMediaQuery';
import { ChevronDown, ArrowRight, Compass } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { useQuote } from '../context/QuoteContext';
import MagneticButton from '../animations/MagneticButton';

const HeroScene = lazy(() => import('../three/HeroScene'));

const defaultData = {
  title: 'PRECISION DELIVERY',
  subtitle: 'Your trusted partner in global freight forwarding and logistics solutions.',
  ctaText: 'Get a Quote',
  backgroundVideoUrl: 'https://assets.mixkit.co/videos/20179/20179-720.mp4',
  backgroundPosterUrl: 'https://assets.mixkit.co/videos/20179/20179-thumb-720-0.jpg',
};

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { openModal } = useQuote();
  const { content } = useContent('hero', defaultData);
  const data = { ...defaultData, ...content };

  const { scrollY } = useScroll();
  const videoScale = useTransform(scrollY, [0, 600], [1, 1.15]);
  const videoOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const titleY = useTransform(scrollY, [0, 400], [0, 80]);
  const contentFadeY = useTransform(scrollY, [0, 300], [0, 40]);
  const contentOpacity = useTransform(scrollY, [0, 350], [1, 0]);

  // GSAP text split reveal
  useEffect(() => {
    if (!titleRef.current || isMobile) return;

    const chars = titleRef.current.querySelectorAll('.hero-char');
    gsap.fromTo(
      chars,
      { opacity: 0, y: 80, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: 'power3.out',
        delay: 0.3,
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isMobile, data.title]);

  return (
    <section ref={sectionRef} id="home" className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: videoScale, opacity: videoOpacity }}>
        <video
          key={data.backgroundVideoUrl}
          className="w-full h-full object-cover"
          poster={data.backgroundPosterUrl}
          src={data.backgroundVideoUrl}
          autoPlay
          playsInline
          loop
          muted
        />
      </motion.div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-black/15 to-black/50" />

      {/* 3D Scene Layer */}
      {!isMobile && (
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      )}

      {/* Hero Title */}
      <motion.div
        className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none px-4 -translate-y-24 md:-translate-y-36"
        style={{ y: titleY }}
      >
        <h1
          ref={titleRef}
          className="uppercase font-black text-black w-full text-center text-[14vw] sm:text-[12vw] md:text-[11vw] lg:text-[10vw] tracking-[0.01em] leading-[0.82] select-none whitespace-normal pointer-events-auto"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            perspective: '600px',
            textShadow: `
              2px 0 0 rgba(255,255,255,0.75),
              -2px 0 0 rgba(255,255,255,0.75),
              0 2px 0 rgba(255,255,255,0.75),
              0 -2px 0 rgba(255,255,255,0.75),
              0 0 8px rgba(255,255,255,0.15),
              0 8px 24px rgba(0,0,0,0.40)
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

      {/* Hero Overlaid Texts & Premium Buttons - Positioned on z-[30] to be on top of FloatingContainer z-[20] */}
      <motion.div
        style={{ y: contentFadeY, opacity: contentOpacity }}
        className="absolute inset-x-0 bottom-[14%] md:bottom-[16%] z-[30] flex flex-col items-center justify-center text-center px-6 max-w-3xl mx-auto pointer-events-auto"
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
