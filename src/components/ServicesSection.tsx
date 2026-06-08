import { useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function ServicesSection() {
  const { content } = useContent();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const visibleServices = content.services.items.filter((s) => s.visible);

  return (
    <section
      ref={ref}
      id="services"
      className="relative py-24 lg:py-32 px-[5vw]"
      style={{ background: 'var(--clr-ash-800)' }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-cond text-xs tracking-[3px] uppercase text-fire-orange font-bold block mb-3">
            {content.services.eyebrow}
          </span>
          <h2
            className="font-display font-bold uppercase mb-4"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}
          >
            {content.services.title}{' '}
            <span className="text-fire-orange">{content.services.titleHighlight}</span>
          </h2>
          <p className="text-ash-400 max-w-[600px] mx-auto text-base font-light">
            {content.services.subtitle}
          </p>
        </motion.div>

        {/* Flip Card Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {visibleServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + idx * 0.08, duration: 0.5 }}
              className="group perspective-[1000px] min-h-[360px]"
            >
              <div className="relative w-full h-full min-h-[360px] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

                {/* ── FRONT FACE ── */}
                <div className="absolute inset-0 [backface-visibility:hidden] rounded-lg overflow-hidden bg-ash-900 border border-white/[0.04]">
                  {/* Image top */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={service.imageUrl || 'https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=600&q=80'}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ash-900 via-ash-900/60 to-transparent" />
                    {/* Watermark number */}
                    <span className="absolute top-3 right-4 font-display text-[42px] font-black text-white/[0.06] select-none">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {/* Icon */}
                    <div className="absolute bottom-3 left-4 w-12 h-12 rounded bg-fire-orange/10 border border-fire-orange/20 flex items-center justify-center text-2xl backdrop-blur-sm">
                      {service.icon}
                    </div>
                  </div>

                  {/* Text bottom */}
                  <div className="p-5 pt-4">
                    <h3 className="font-cond text-lg tracking-[1px] uppercase font-bold text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs text-ash-400 font-light leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 font-cond text-[10px] tracking-[2px] uppercase font-bold text-fire-orange">
                      Flip for details →
                    </span>
                  </div>

                  {/* Top border accent */}
                  <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-fire-orange to-fire-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                </div>

                {/* ── BACK FACE ── */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg overflow-hidden bg-ash-900 border border-fire-orange/20 p-6 flex flex-col justify-between">
                  {/* Top */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{service.icon}</span>
                      <h3 className="font-cond text-lg tracking-[1px] uppercase font-bold text-white">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-sm text-ash-200 font-light leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Bottom CTA */}
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 font-cond text-[11px] tracking-[2px] uppercase font-bold text-fire-orange hover:text-fire-gold transition-colors mt-6 group/link"
                  >
                    Request Quote
                    <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </a>

                  {/* Orange glow */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-fire-orange/[0.08] rounded-full blur-3xl pointer-events-none" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
