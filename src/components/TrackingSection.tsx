import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Clock, RefreshCw, Lock, ArrowRight } from 'lucide-react';
import MagneticButton from '../animations/MagneticButton';
import TiltCard from '../animations/TiltCard';
import { useContent } from '../hooks/useContent';

const icons = [Clock, RefreshCw, Lock];

const defaultData = {
  sectionTitle: 'TRACK YOUR SHIPMENT & GET SUPPORT',
  sectionDescription: 'Real-time tracking updates and 24/7 professional assistance for all your cargo needs.',
  badge1: 'Real-Time Updates',
  badge2: '24/7 Coordination',
  badge3: 'Secure Information',
  ctaText: 'TRACK & SUPPORT',
  bottomText: 'Join 1m+ yearly shipments tracked with confidence',
};

export default function TrackingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { content } = useContent('tracking', defaultData);
  const data = { ...defaultData, ...content };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const cardY = useTransform(scrollYProgress, [0.2, 0.6], [80, 0]);
  const cardRotate = useTransform(scrollYProgress, [0.2, 0.6], [3, 0]);
  const badgeScale = useTransform(scrollYProgress, [0.3, 0.7], [0.8, 1]);

  const badges = [
    { icon: icons[0], label: data.badge1 },
    { icon: icons[1], label: data.badge2 },
    { icon: icons[2], label: data.badge3 },
  ];

  return (
    <section
      ref={sectionRef}
      id="tracking"
      className="relative w-full text-white overflow-hidden flex items-center justify-center py-12 md:py-16 min-h-[70vh]"
    >
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/bg.jpg')",
          y: bgY,
        }}
      />
      <div className="absolute inset-0 bg-[#EBEBEB]/90 backdrop-blur-[2px]" />

      {/* Animated Grid */}
      <motion.div
        className="absolute inset-0 opacity-15 pointer-events-none"
        animate={{ backgroundPosition: ['0px 0px', '60px 60px'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage:
            'linear-gradient(to right, #0B2545 1px, transparent 1px), linear-gradient(to bottom, #0B2545 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* 3D Glass Content Card with parallax */}
      <motion.div style={{ y: cardY, rotateX: cardRotate }} className="relative z-10 mx-6">
        <TiltCard className="group" maxTilt={5} glare={true}>
          <div className="p-10 bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl max-w-2xl text-center shadow-2xl relative overflow-hidden group-hover:shadow-3xl transition-shadow duration-500">
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-cyan-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm pointer-events-none" />
            
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors" />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />

            <h2 className="text-4xl md:text-5xl font-black uppercase text-[#0B2545] tracking-tighter mb-4 relative z-10">
              {data.sectionTitle}
            </h2>
            <p className="text-[#0B2545]/80 mb-8 text-lg font-bold relative z-10">
              {data.sectionDescription}
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8 relative z-10">
              {badges.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 bg-[#0B2545]/10 text-[#0B2545] px-4 py-2 rounded-full text-sm font-extrabold backdrop-blur-sm"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </motion.div>
              ))}
            </div>

            <Link to="/tracking" className="relative z-10 inline-block">
              <MagneticButton className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-full font-bold text-white flex items-center gap-2 mx-auto shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow">
                {data.ctaText} <ArrowRight className="w-5 h-5" />
              </MagneticButton>
            </Link>
          </div>
        </TiltCard>
      </motion.div>

      {/* 3D Security Badge */}
      <motion.div
        style={{ scale: badgeScale }}
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-20 left-10 z-20"
      >
        <TiltCard maxTilt={15} glare={true}>
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg flex items-center justify-center">
            <motion.div
              className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Lock className="w-6 h-6 text-[#0B2545]" />
            </motion.div>
          </div>
        </TiltCard>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="absolute bottom-6 w-full text-center text-sm font-bold text-[#0B2545]/80 z-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1 }}
      >
        {data.bottomText}
      </motion.div>
    </section>
  );
}
