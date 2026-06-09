import { useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, useInView } from 'motion/react';
import { Shield, Sparkles, Zap, Award, Compass, HeartHandshake } from 'lucide-react';

const icons = [Shield, Sparkles, Zap, Award, Compass, HeartHandshake];

export default function WhyChooseSection() {
  const { content } = useContent();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // Map icons dynamically to whyUs items
  const items = content.whyUs.items.map((item, idx) => ({
    ...item,
    Icon: icons[idx % icons.length],
  }));

  return (
    <section
      ref={ref}
      id="why"
      className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-[5vw] overflow-hidden"
      style={{ background: 'var(--clr-ash-800)' }}
    >
      {/* Background subtle glowing lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-fire-orange/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-fire-gold/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="font-cond text-xs tracking-[3px] uppercase text-fire-orange font-bold block mb-3">
            {content.whyUs.eyebrow}
          </span>
          <h2
            className="font-display font-bold uppercase mb-4"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}
          >
            {content.whyUs.title}{' '}
            <span className="text-fire-orange">{content.whyUs.titleHighlight}</span>
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-fire-orange to-fire-gold mx-auto" />
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="group relative bg-ash-900 border border-white/[0.03] hover:border-fire-orange/20 p-8 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            >
              {/* Card top border accent */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-fire-orange to-fire-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

              {/* Icon Wrap */}
              <div className="w-12 h-12 rounded bg-fire-orange/[0.04] border border-fire-orange/10 group-hover:bg-fire-orange/10 group-hover:border-fire-orange/25 flex items-center justify-center text-fire-orange mb-6 transition-all duration-300">
                <item.Icon size={22} className="group-hover:scale-110 transition-transform duration-300" />
              </div>

              {/* Text content */}
              <h3 className="font-cond text-lg tracking-[1px] uppercase font-bold text-white mb-3 group-hover:text-fire-gold transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-ash-200 font-light leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
