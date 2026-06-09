import { useRef, useState, useCallback } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function ServicesSection() {
  const { content } = useContent();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const visibleServices = content.services.items.filter((s) => s.visible);

  const toggleFlip = useCallback((id: string) => {
    setFlippedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <section
      ref={ref}
      id="services"
      className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-[5vw] "
      style={{ background: 'var(--clr-ash-800)' }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="font-cond text-xs tracking-[3px] uppercase text-fire-orange font-bold block mb-3">
            {content.services.eyebrow}
          </span>
          <h2
            className="font-display font-bold uppercase mb-4 text-white text-center"
            style={{ fontSize: 'clamp(1.6rem, 4.5vw, 3rem)' }}
          >
            {content.services.title}{' '}
            <span className="text-fire-orange">{content.services.titleHighlight}</span>
          </h2>
          <p className="text-ash-200  mx-auto text-sm sm:text-base font-light text-center px-2">
            {content.services.subtitle}
          </p>
        </motion.div>

        {/* Flip Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {visibleServices.map((service, idx) => {
            const isFlipped = flippedCards.has(service.id);

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + idx * 0.08, duration: 0.5 }}
                className="perspective-[1000px] min-h-[320px] sm:min-h-[360px] cursor-pointer"
                onClick={() => toggleFlip(service.id)}
                role="button"
                tabIndex={0}
                aria-label={`Flip card: ${service.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFlip(service.id);
                  }
                }}
              >
                <div
                  className="relative w-full h-full min-h-[320px] sm:min-h-[360px] transition-transform duration-700 ease-in-out"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >

                  {/* ── FRONT FACE ── */}
                  <div
                    className="absolute inset-0 rounded-lg overflow-hidden bg-ash-900 border border-white/[0.06]"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  >
                    {/* Image top */}
                    <div className="relative h-36 sm:h-44 overflow-hidden">
                      <img
                        src={service.imageUrl || 'https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=600&q=80'}
                        alt={service.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ash-900 via-ash-900/60 to-transparent" />
                      {/* Watermark number */}
                      <span className="absolute top-3 right-4 font-display text-[42px] font-black text-white/[0.06] select-none">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {/* Icon */}
                      {/* <div className="absolute bottom-3 left-4 w-11 h-11 sm:w-12 sm:h-12 rounded bg-fire-orange/10 border border-fire-orange/20 flex items-center justify-center text-xl sm:text-2xl backdrop-blur-sm">
                        {service.icon}
                      </div> */}
                    </div>

                    {/* Text bottom */}
                    <div className="p-4 sm:p-5 pt-3 sm:pt-4 text-center">
                      <h3 className="font-cond text-base sm:text-lg tracking-[1px] uppercase font-bold text-white mb-2">
                        {service.title}
                      </h3>
                      <p className="text-xs text-ash-200 font-light leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                      <span className="mt-3 sm:mt-4 inline-flex items-center gap-1 font-cond text-[10px] tracking-[2px] uppercase font-bold text-fire-orange">
                        Tap to flip →
                      </span>
                    </div>

                    {/* Top border accent */}
                    <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-fire-orange to-fire-gold" style={{ opacity: isFlipped ? 1 : 0, transition: 'opacity 0.3s' }} />
                  </div>

                  {/* ── BACK FACE ── */}
                  <div
                    className="absolute inset-0 rounded-lg overflow-hidden bg-ash-900 border border-fire-orange/20 p-5 sm:p-6 flex flex-col justify-between"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    {/* Top */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-2xl sm:text-3xl">{service.icon}</span>
                        <h3 className="font-cond text-base sm:text-lg tracking-[1px] uppercase font-bold text-white">
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-sm text-ash-100 font-light leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Bottom CTA */}
                    <div className="text-center mt-4">
                      <a
                        href="#contact"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 font-cond text-[11px] tracking-[2px] uppercase font-bold text-fire-orange hover:text-fire-gold transition-colors group/link"
                      >
                        Request Quote
                        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                      </a>
                      <div className="mt-3">
                        <span className="font-cond text-[10px] tracking-[2px] uppercase text-ash-400">
                          Tap to flip back
                        </span>
                      </div>
                    </div>

                    {/* Orange glow */}
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-fire-orange/[0.08] rounded-full blur-3xl pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
