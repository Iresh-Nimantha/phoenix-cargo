import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { useContent } from '../hooks/useContent';
import TiltCard from '../animations/TiltCard';
import { staggerContainer, fadeSlideUp } from '../animations/variants';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const defaultData = {
  sectionTitle: 'ABOUT ALLIANCE FREIGHT',
  description1: 'Alliance Freight is a professional logistics and freight company that provides unique freight solutions. We enter anew, our company Alliance Freight leads for you, introduced with its solution professional with a profound dedication and their team, that pure, living solutions in air, ocean, and land freight transport.',
  description2: 'Alliance Freight was built on a custom history of logistics and freight and solutions. The strength of our expertise denies the professional freight clouds for any company, built with a strong logistics base and a network designed to ensure operations with local presence. We enhance a grand concentration on global networks and trading with professional empowerment.',
  stat1Label: 'Global Partners',
  stat1Value: '5000',
  stat2Label: 'Logistics Routes',
  stat2Value: '25',
  stat3Label: 'Yearly Shipments',
  stat3Value: '1000000',
  feature1Title: 'Global Reach',
  feature1Description: 'Global reach, effective conservation, connecting production cost movements.',
  feature2Title: 'Advanced Tracking',
  feature2Description: 'Advanced tracking, access to status, checkout and constant tracking.',
  feature3Title: 'Custom Solutions',
  feature3Description: 'Custom solutions, expert sort level for trading and transport solutions.',
};

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { content, loading } = useContent('about', defaultData);
  const data = { ...defaultData, ...content };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax transforms
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const contentYVal = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const contentY = isMobile ? 0 : contentYVal;
  const titleScale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);

  if (loading) {
    return <div className="w-full min-h-[400px] bg-[#EBEBEB]/90" />;
  }

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full text-[#0B2545] px-6 md:px-16 flex flex-col items-center justify-center overflow-hidden select-none py-8 sm:py-12"
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

      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center space-y-6 md:space-y-10">
        {/* Title with natural layout flow */}
        <motion.h2
          style={{ scale: titleScale }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter uppercase text-center leading-tight break-words"
        >
          {data.sectionTitle.split(' ').map((word: string, idx: number) => (
            <span key={idx} className="text-[#0B2545] ml-2">
              {word}
            </span>
          ))}
        </motion.h2>

        {/* Content with parallax slide */}
        <motion.div
          style={{ y: contentY }}
          className="w-full grid grid-cols-1 lg:grid-cols-2 gap-y-12 xl:gap-x-16 items-center pt-2"
        >
          {/* Left: About image entrance animation - scale/increase from left bottom corner */}
          <div className="hidden lg:flex w-full h-full items-center justify-center relative min-h-[350px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.3, x: -100, y: 100 }}
              whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              style={{ transformOrigin: 'left bottom' }}
              transition={{
                duration: 1.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative w-full max-w-[550px] flex justify-center items-center"
            >
              <img
                src="https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/about.png"
                alt="Alliance Freight About"
                className="w-full h-auto object-contain drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

        {/* Right: Content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col justify-center space-y-5 xl:space-y-6 py-4"
        >
          {/* Description */}
          <motion.div
            variants={fadeSlideUp}
            className="space-y-3 text-gray-700 text-xs xl:text-sm leading-relaxed font-medium"
          >
            <p>{data.description1}</p>
            <p>{data.description2}</p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={fadeSlideUp}
            className="grid grid-cols-3 gap-4 border-t border-gray-400/30 pt-4"
          >
            {[
              { title: data.feature1Title, desc: data.feature1Description },
              { title: data.feature2Title, desc: data.feature2Description },
              { title: data.feature3Title, desc: data.feature3Description },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <h4 className="font-bold text-xs xl:text-sm text-[#0B2545] mb-0.5">{item.title}</h4>
                <p className="text-[10px] xl:text-xs text-gray-600 leading-snug">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* 3D Stats Cards */}
          <motion.div
            variants={fadeSlideUp}
            className="grid grid-cols-3 gap-3 xl:gap-4 pt-2"
          >
            <TiltCard className="group" maxTilt={12} glare={true}>
              <div className="bg-[#0B2545] text-white p-4 xl:p-5 rounded-xl flex flex-col justify-between h-24 xl:h-28 shadow-md group-hover:shadow-xl group-hover:shadow-[#0B2545]/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/15 rounded-full blur-2xl group-hover:bg-cyan-500/30 transition-colors" />
                <div className="flex justify-between items-start relative z-10">
                  <span className="text-2xl xl:text-3xl font-bold tracking-tight">
                    <AnimatedCounter target={parseInt(data.stat1Value) || 5000} suffix={parseInt(data.stat1Value) >= 1000 ? 'k+' : '+'} />
                  </span>
                  <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <span className="text-[11px] xl:text-xs font-semibold opacity-90 leading-tight relative z-10">
                  {data.stat1Label}
                </span>
              </div>
            </TiltCard>

            <TiltCard className="group" maxTilt={12} glare={true}>
              <div className="bg-white/90 backdrop-blur-sm text-[#0B2545] border border-gray-300/50 p-4 xl:p-5 rounded-xl flex flex-col justify-between h-24 xl:h-28 shadow-md group-hover:shadow-xl group-hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden">
                <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
                <div className="flex justify-between items-start relative z-10">
                  <span className="text-2xl xl:text-3xl font-bold tracking-tight">
                    <AnimatedCounter target={parseInt(data.stat2Value) || 25} suffix="+" />
                  </span>
                  <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-[11px] xl:text-xs font-bold opacity-80 leading-tight relative z-10">
                  {data.stat2Label}
                </span>
              </div>
            </TiltCard>

            <TiltCard className="group" maxTilt={12} glare={true}>
              <div className="bg-white/90 backdrop-blur-sm text-[#0B2545] border border-gray-300/50 p-4 xl:p-5 rounded-xl flex flex-col justify-between h-24 xl:h-28 shadow-md group-hover:shadow-xl group-hover:shadow-purple-500/10 transition-all duration-300 relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
                <div className="flex justify-between items-start relative z-10">
                  <span className="text-2xl xl:text-3xl font-bold tracking-tight">
                    <AnimatedCounter target={parseInt(data.stat3Value) >= 1000000 ? 1 : parseInt(data.stat3Value) || 1} suffix={parseInt(data.stat3Value) >= 1000000 ? 'm+' : '+'} />
                  </span>
                  <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-[11px] xl:text-xs font-bold opacity-80 leading-tight relative z-10">
                  {data.stat3Label}
                </span>
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>
      </motion.div>
      </div>
    </section>
  );
}