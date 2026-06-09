import { useContent } from '../context/ContentContext';
import { motion } from 'motion/react';

export default function Footer() {
  const { content } = useContent();

  return (
    <footer
      className="relative pt-16 sm:pt-24 pb-10 sm:pb-12 px-4 sm:px-[5vw] overflow-hidden"
      style={{
        background: 'var(--clr-ash-900)',
        borderTop: '1px solid rgba(232,97,10,0.1)'
      }}
    >
      {/* Background Watermark */}
      <span className="absolute bottom-1/3 left-1/2 -translate-x-1/2 font-display text-[clamp(4rem,10vw,12rem)] font-black text-fire-orange/[0.01] tracking-wider whitespace-nowrap select-none pointer-events-none z-0">
        PHOENIX CARGO
      </span>

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Footer main grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 pb-12 sm:pb-16 border-b border-white/5">
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo1.png"
                alt="Phoenix Cargo Brand Logo"
                onError={(e) => { e.currentTarget.src = '/logo1.png'; }}
                className="h-18 w-auto rounded"
              />
              <span className="font-display text-md font-black text-white tracking-wider">
                PHOENIX CARGO
              </span>
            </div>
            <p className="text-sm text-ash-400 font-light leading-relaxed max-w-[360px]">
              {content.footer.description}
            </p>
            <p className="font-cond text-xs tracking-[2px] uppercase text-fire-amber font-semibold">
              {content.footer.tagline}
            </p>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="font-cond text-xs tracking-[2px] uppercase text-white font-bold mb-6">
              Services
            </h4>
            <ul className="flex flex-col gap-3">
              {content.footer.serviceLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-sm text-ash-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-cond text-xs tracking-[2px] uppercase text-white font-bold mb-6">
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {content.footer.companyLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-sm text-ash-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Certifications */}
          <div>
            <h4 className="font-cond text-xs tracking-[2px] uppercase text-white font-bold mb-6">
              Compliance
            </h4>
            <div className="flex flex-col gap-2.5">
              {content.footer.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="border border-white/5 rounded px-3 py-2 text-[10px] font-cond tracking-[1px] uppercase text-ash-300 bg-ash-800/60 text-center"
                >
                  {cert}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 pt-8 sm:pt-10 text-[11px] sm:text-xs text-ash-300 text-center md:text-left">
          <span>{content.footer.copyrightText}</span>

          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="font-cond text-[10px] tracking-[2px] uppercase text-fire-orange font-bold"
          >
            {content.footer.footerBadge}
          </motion.span>

          <span className="italic text-ash-400/70">{content.footer.footerNote}</span>
        </div>
      </div>
    </footer>
  );
}
