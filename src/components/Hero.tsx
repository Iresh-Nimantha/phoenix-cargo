import { useRef, lazy, Suspense } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, useInView } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';

const EarthScene = lazy(() => import('../three/EarthScene'));

export default function HeroSection() {
  const { content } = useContent();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden pt-[72px]"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 60% 80% at 20% 50%, rgba(155,34,24,0.18) 0%, transparent 70%),
          radial-gradient(ellipse 40% 60% at 80% 30%, rgba(232,97,10,0.06) 0%, transparent 60%),
          repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 80px),
          repeating-linear-gradient(90deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 80px),
          linear-gradient(160deg, #09090b 0%, #0d0c0b 100%)
        `,
      }}
    >
      {/* Two-column grid */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-[5vw] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-[calc(100vh-72px)]">

        {/* ── LEFT: Copy ── */}
        <div className="lg:col-span-5 flex flex-col justify-center py-12 lg:py-0 relative z-20">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="font-cond text-xs tracking-[3.5px] uppercase text-ash-400 font-bold">
              {content.hero.eyebrow}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
            className="font-display font-bold leading-[1.08] tracking-tight uppercase mb-6 text-white"
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)' }}
          >
            {content.hero.headingLine1}
            <br />
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r from-fire-orange via-fire-amber to-fire-gold inline-block"
              style={{ filter: 'drop-shadow(0 2px 15px rgba(232,97,10,0.35))' }}
            >
              {content.hero.headingLine2}
            </span>
            <br />
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r from-fire-orange via-fire-amber to-fire-gold inline-block"
              style={{ filter: 'drop-shadow(0 2px 15px rgba(232,97,10,0.35))' }}
            >
              {content.hero.headingLine3}
            </span>
          </motion.h1>

          {/* Body text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-[15px] font-light text-ash-400 leading-relaxed max-w-[480px] mb-10"
          >
            {content.hero.subtext}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <a
              href={content.hero.ctaPrimaryHref}
              className="group flex items-center gap-2 font-cond text-xs tracking-[1.5px] uppercase font-bold text-white px-8 py-3.5 rounded-full bg-gradient-to-r from-fire-orange to-fire-amber shadow-[0_4px_20px_rgba(232,97,10,0.4)] hover:shadow-[0_8px_40px_rgba(232,97,10,0.6)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {content.hero.ctaPrimaryLabel.replace('→', '').trim()}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={content.hero.ctaSecondaryHref}
              className="font-cond text-xs tracking-[1.5px] uppercase font-bold text-white px-8 py-3.5 rounded-full border border-white/20 hover:border-fire-orange/50 hover:text-fire-amber hover:bg-white/[0.02] transition-all duration-300"
            >
              {content.hero.ctaSecondaryLabel}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex gap-8 flex-wrap"
          >
            {content.stats.items.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-display text-2xl lg:text-3xl font-bold bg-gradient-to-r from-fire-orange to-fire-gold bg-clip-text text-transparent">
                  {stat.number}
                </span>
                <span className="font-cond text-[10px] tracking-[2px] uppercase text-ash-400 mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT: 3D Earth ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 1.1, ease: 'easeOut' }}
          className="lg:col-span-7 relative flex items-center justify-center"
        >
          {/* Glow backdrop */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[65%] h-[65%] rounded-full bg-fire-orange/[0.05] blur-[130px]" />
          </div>

          {/* Canvas container */}
          <div className="w-full h-[50vh] lg:h-[82vh] max-h-[720px]
            max-lg:absolute max-lg:inset-0 max-lg:opacity-20 max-lg:pointer-events-none max-lg:h-full">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-20 h-20 border-2 border-fire-orange/30 border-t-fire-orange rounded-full animate-spin" />
              </div>
            }>
              <EarthScene />
            </Suspense>
          </div>
        </motion.div>
      </div>

      {/* Decorative star */}
      <div className="absolute bottom-16 right-[12vw] pointer-events-none opacity-20 hidden lg:block animate-pulse">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z" fill="url(#sg)" />
          <defs>
            <linearGradient id="sg" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--clr-fire-orange)" />
              <stop offset="100%" stopColor="var(--clr-fire-gold)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="font-cond text-[9px] tracking-[3px] uppercase text-ash-400">Scroll</span>
        <ChevronDown size={16} className="text-fire-orange animate-bounce" />
      </motion.div>
    </section>
  );
}
