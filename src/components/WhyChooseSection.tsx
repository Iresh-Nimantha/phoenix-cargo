import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import {
  Globe,
  Ship,
  Network,
  TrendingDown,
  PackageCheck,
  ShieldCheck,
  Users,
  Clock,
} from 'lucide-react';
import TiltCard from '../animations/TiltCard';
import { staggerContainer } from '../animations/variants';
import { useContent } from '../hooks/useContent';

const icons = [
  Globe,
  Ship,
  Network,
  TrendingDown,
  PackageCheck,
  ShieldCheck,
  Users,
  Clock,
];

const colors = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-indigo-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-amber-500',
  'from-red-500 to-pink-500',
  'from-teal-500 to-cyan-500',
  'from-indigo-500 to-blue-500',
  'from-yellow-500 to-orange-500',
];

const defaultData = {
  sectionTitle: 'WHY CHOOSE ALLIANCE FREIGHT',
  sectionDescription: 'In freight forwarding, performance matters. Alliance Freight (Pvt) Ltd is committed to delivering professional shipping and cargo solutions.',
  ctaMessage: 'Alliance Freight (Pvt) Ltd is not just a service provider — we are your long-term shipping and freight forwarding partner.',
  backgroundImageUrl: 'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/bg.jpg',
  strength1: 'Export, Import & Cross Trading Expertise',
  strength2: 'Sea Freight, Air Freight, Courier, Road & Rail Options',
  strength3: 'Strong Worldwide Agent Network',
  strength4: 'Competitive Freight Rates & Reliable Carriers',
  strength5: 'Specialized Handling (Project / Pharmaceutical / Hazardous Cargo)',
  strength6: 'Fast Import & Export Customs Clearance',
  strength7: 'Well-Educated, Experienced Operations Team',
  strength8: '24 Hours Customer Service & Shipment Updates',
};

const itemVariants = {
  hidden: { opacity: 0, x: 30, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function WhyChooseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { content } = useContent('whychoose', defaultData);
  const data = { ...defaultData, ...content };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const leftXVal = useTransform(scrollYProgress, [0, 0.5], [-30, 0]);
  const rightXVal = useTransform(scrollYProgress, [0, 0.5], [30, 0]);
  const leftX = isMobile ? 0 : leftXVal;
  const rightX = isMobile ? 0 : rightXVal;

  // Build dynamic strength cards
  const strengths = Array.from({ length: 8 }).map((_, idx) => {
    const key = `strength${idx + 1}` as keyof typeof data;
    return {
      icon: icons[idx],
      title: data[key],
      color: colors[idx],
    };
  });

  return (
    <section
      ref={sectionRef}
      className="relative w-full px-4 md:px-16 flex items-center justify-center overflow-hidden select-none text-[#0B2545] py-12 md:py-16"
    >
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${data.backgroundImageUrl}')`,
          y: bgY,
        }}
      />
      <div className="absolute inset-0 bg-[#EBEBEB]/90 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left - with parallax slide */}
        <motion.div
          style={{ x: leftX }}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="space-y-8"
        >
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-tight break-words text-center lg:text-left px-4 lg:px-0 text-[#0B2545]">
            {data.sectionTitle}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed font-semibold text-center lg:text-left px-2 sm:px-4 lg:px-0">
            {data.sectionDescription}
          </p>

          {/* 3D CTA Card */}
          <div className="px-4 sm:px-0">
            <TiltCard className="group animate-glow" maxTilt={6} glare={true}>
              <div className="bg-[#0B2545] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group-hover:shadow-2xl group-hover:shadow-[#0B2545]/30 transition-shadow duration-300">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl group-hover:bg-cyan-500/25 transition-colors" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />
                <p className="text-lg font-semibold relative z-10 text-center lg:text-left">
                  {data.ctaMessage}
                </p>
              </div>
            </TiltCard>
          </div>
        </motion.div>

        {/* Right - with parallax slide */}
        <motion.div
          style={{ x: rightX }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-3"
        >
          {strengths.map((strength, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ x: 8, backgroundColor: 'rgba(255,255,255,0.95)', scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group bg-white/70 backdrop-blur-sm border border-white/60 p-4 rounded-xl shadow-sm hover:border-cyan-300/50 hover:shadow-lg flex items-center gap-4 transition-all cursor-default"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div
                className={`p-2.5 bg-gradient-to-br ${strength.color} bg-opacity-10 rounded-lg text-white shadow-sm`}
                whileHover={{ rotate: 10, scale: 1.15 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <strength.icon className="w-5 h-5 stroke-[1.5]" />
              </motion.div>
              <span className="font-bold text-[#0B2545] text-sm">{strength.title}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
