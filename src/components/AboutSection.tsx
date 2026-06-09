import { useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, useInView } from 'motion/react';

export default function AboutSection() {
  const { content } = useContent();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      id="about"
      className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-[5vw]"
      style={{ background: 'var(--clr-ash-900)' }}
    >
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20 items-center">
        {/* Left Visual Panel */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative bg-ash-800 border border-fire-orange/10 rounded-lg p-8 sm:p-14 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] overflow-hidden"
        >
          {/* Badge pill */}
          <div className="absolute top-5 right-5 bg-gradient-to-r from-fire-crimson to-fire-orange text-white font-cond text-[10px] font-bold tracking-[1.5px] uppercase px-3.5 py-1.5 rounded-full">
            {content.about.badge}
          </div>

          {/* Logo */}
          <img
            src="/images/logo1.png"
            alt="Phoenix Cargo Brand Logo"
            onError={(e) => { e.currentTarget.src = '/logo1.png'; }}
            className="max-h-[140px] w-auto rounded-lg mb-6 relative z-10"
          />

          {/* Tagline */}
          <p className="font-cond text-sm tracking-[3px] uppercase text-fire-amber font-semibold relative z-10 text-center">
            {content.about.tagline}
          </p>

          {/* Giant watermark */}
          <span className="absolute -bottom-5 inset-x-0 text-center font-display text-[68px] font-black text-fire-orange/[0.02] tracking-wider whitespace-nowrap select-none pointer-events-none">
            PHOENIX CARGO
          </span>
        </motion.div>

        {/* Right Text Panel */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
        >
          <span className="font-cond text-xs tracking-[3px] uppercase text-fire-orange font-bold block mb-3 text-center lg:text-left">
            {content.about.eyebrow}
          </span>
          <h2
            className="font-display font-bold uppercase leading-[1.1] mb-5 text-white text-center lg:text-left"
            style={{ fontSize: 'clamp(1.6rem, 4.5vw, 3rem)' }}
          >
            {content.about.headingLine1}{' '}
            <span className="text-fire-orange">{content.about.headingLine2}</span>
          </h2>
          <p className="text-sm sm:text-[15px] text-ash-200 font-light leading-relaxed mb-6 sm:mb-8 text-center lg:text-left">
            {content.about.subtext}
          </p>

          {/* Feature List */}
          <ul className="flex flex-col gap-4 mb-10">
            {content.about.features.map((feat, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                className="flex items-start gap-3 text-sm font-medium text-ash-100"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-fire-orange mt-2 shrink-0" />
                <span>{feat}</span>
              </motion.li>
            ))}
          </ul>

          <div className="text-center lg:text-left">
          <a
            href={content.about.ctaHref}
            className="inline-block font-cond text-sm tracking-[1px] uppercase font-bold text-white px-8 py-4 rounded bg-gradient-to-r from-fire-crimson to-fire-orange hover:shadow-[0_4px_20px_rgba(232,97,10,0.35)] hover:-translate-y-0.5 transition-all duration-300"
          >
            {content.about.ctaLabel}
          </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}