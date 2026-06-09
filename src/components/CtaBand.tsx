import { useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, useInView } from 'motion/react';

export default function CtaBand() {
  const { content } = useContent();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      ref={ref}
      className="relative py-14 sm:py-20 lg:py-24 px-4 sm:px-[5vw] text-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--clr-fire-dark) 0%, var(--clr-fire-maroon) 50%, var(--clr-fire-dark) 100%)',
      }}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at center, rgba(232,97,10,0.18) 0%, transparent 60%)'
      }} />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-fire-gold/30 animate-pulse"
            style={{
              left: `${10 + i * 11}%`,
              top: `${15 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2.5 + i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-[800px] mx-auto"
      >
        <h2
          className="font-display font-bold uppercase text-white mb-4"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
        >
          {content.cta.heading}
        </h2>
        <p className="text-ash-100 text-sm sm:text-base font-light mb-6 sm:mb-8 max-w-[500px] mx-auto">
          {content.cta.subtext}
        </p>
        <a
          href={content.cta.buttonHref}
          className="inline-block font-cond text-sm tracking-[1px] uppercase font-bold text-white px-10 py-4 rounded bg-gradient-to-r from-fire-crimson to-fire-orange shadow-[0_4px_20px_rgba(232,97,10,0.3)] hover:shadow-[0_8px_40px_rgba(232,97,10,0.5)] hover:-translate-y-0.5 transition-all duration-300"
        >
          {content.cta.buttonLabel}
        </a>
      </motion.div>
    </section>
  );
}
