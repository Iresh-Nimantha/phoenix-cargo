import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useRef, useEffect } from 'react';
import { useContent } from '../hooks/useContent';

const defaultIndustries = [
  'Importers & Exporters',
  'Apparel & Textile Industry',
  'Manufacturing & Industrial Suppliers',
  'Construction & Engineering Projects',
  'FMCG & Food Products',
  'Pharmaceutical & Healthcare',
  'E-commerce & Retail Businesses',
];

const defaultData = {
  sectionTitle: 'INDUSTRIES WE SERVE',
  sectionDescription: 'Phoenix Cargo (Pvt) Ltd supports a wide range of industries with customized shipping and freight forwarding solutions.',
  industries: 'Importers & Exporters\nApparel & Textile Industry\nManufacturing & Industrial Suppliers\nConstruction & Engineering Projects\nFMCG & Food Products\nPharmaceutical & Healthcare\nE-commerce & Retail Businesses',
  footerNote: 'Our flexible freight solutions allow businesses to expand their global trade operations with confidence.',
  backgroundImageUrl: 'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/bg.jpg',
  mapImageUrl: 'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/map.png',
  shipImageUrl: 'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/ship.png',
};

function KineticGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const mouse = { x: -1000, y: -1000, active: false };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initGrid();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    interface Point {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
    }

    let points: Point[] = [];
    const spacing = 45;

    const initGrid = () => {
      points = [];
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing;
          const y = r * spacing;
          points.push({
            x,
            y,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    initGrid();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const radius = 180;
      const ease = 0.18;
      const friction = 0.83;

      // Update points
      points.forEach((p) => {
        let dx = mouse.x - p.x;
        let dy = mouse.y - p.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius && mouse.active) {
          const force = (radius - dist) / radius;
          const angle = Math.atan2(dy, dx);
          const targetX = p.x - Math.cos(angle) * force * 40;
          const targetY = p.y - Math.sin(angle) * force * 40;
          p.vx += (targetX - p.x) * ease;
          p.vy += (targetY - p.y) * ease;
        }

        let homeDx = p.baseX - p.x;
        let homeDy = p.baseY - p.y;
        p.vx += homeDx * 0.08;
        p.vy += homeDy * 0.08;

        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx;
        p.y += p.vy;
      });

      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      ctx.strokeStyle = 'rgba(11, 37, 69, 0.07)';
      ctx.lineWidth = 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const p = points[idx];
          if (!p) continue;

          if (c < cols - 1) {
            const rightNeighbor = points[idx + 1];
            if (rightNeighbor) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(rightNeighbor.x, rightNeighbor.y);
              ctx.stroke();
            }
          }

          if (r < rows - 1) {
            const bottomNeighbor = points[idx + cols];
            if (bottomNeighbor) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(bottomNeighbor.x, bottomNeighbor.y);
              ctx.stroke();
            }
          }

          ctx.fillStyle = 'rgba(11, 37, 69, 0.16)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto z-0" />;
}

export default function IndustriesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const { content } = useContent('industries', defaultData);
  const data = { ...defaultData, ...content };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const shipX = useTransform(scrollYProgress, [0, 1], [300, -100]);
  const shipScale = useTransform(scrollYProgress, [0.2, 0.8], [0.8, 1.1]);
  const contentYVal = useTransform(scrollYProgress, [0, 0.5], [40, 0]);
  const contentY = isMobile ? 0 : contentYVal;

  const industryList = data.industries
    ? data.industries.split('\n').filter((item: string) => item.trim() !== '')
    : defaultIndustries;

  return (
    <section
      ref={sectionRef}
      id="industries"
      className="relative w-full text-[#800C30] overflow-hidden py-12 md:py-16"
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

      {/* Interactive Kinetic Grid Background */}
      <KineticGrid />

      {/* Global Route Tracker Sketch Parallax Overlay */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.10] mix-blend-multiply z-0 pointer-events-none"
        style={{
          backgroundImage: `url('${data.mapImageUrl}')`,
          y: bgY,
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row lg:items-stretch gap-0 py-16 lg:py-0">
        {/* LEFT with parallax Y */}
        <motion.div style={{ y: contentY }} className="flex-1 flex flex-col justify-center py-20 lg:py-24 pr-0 lg:pr-16 z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            className="mb-10 text-center lg:text-left px-2 sm:px-4"
          >
            <h2 className="text-xl sm:text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 text-center lg:text-left leading-tight break-words px-4 lg:px-0 text-[#800C30] whitespace-pre-wrap">
              {data.sectionTitle}
            </h2>
            <p className="text-gray-600 text-base max-w-xl mx-auto lg:mx-0 font-semibold">
              {data.sectionDescription}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 sm:px-0">
            {industryList.map((industry: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + index * 0.07,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
                whileHover={{
                  x: 6,
                  scale: 1.02,
                  boxShadow: '0 8px 25px rgba(11, 37, 69, 0.08)',
                  rotateY: 3,
                }}
                className="bg-white/80 backdrop-blur-sm border border-white/60 px-4 py-3 rounded-xl shadow-sm flex items-center gap-3 cursor-default transition-colors hover:bg-white hover:border-cyan-200/50"
                style={{ perspective: '600px', transformStyle: 'preserve-3d' }}
              >
                <motion.span
                  className="w-2.5 h-2.5 bg-gradient-to-br from-cyan-500 to-[#800C30] rounded-full shrink-0"
                  whileHover={{ scale: 1.6, rotate: 180 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
                <span className="font-semibold text-gray-800 text-sm md:text-base">{industry}</span>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 text-gray-600 font-medium text-base italic text-center lg:text-left"
          >
            {data.footerNote}
          </motion.p>
        </motion.div>

        {/* RIGHT — Ship with extreme parallax & floating animation */}
        <div className="hidden lg:flex flex-col justify-end items-center relative w-[550px] shrink-0 z-10 pointer-events-none">
          {/* Ripple rings */}
          {isInView && (
            <div className="absolute bottom-[15%] left-[60%] -translate-x-1/2 flex items-end justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border-2 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)_inset]"
                  style={{ bottom: 0, left: '50%', translateX: '-50%', rotateX: 60 }}
                  initial={{ width: 100, height: 100, opacity: 0.8 }}
                  animate={{ width: 800, height: 800, opacity: 0 }}
                  transition={{
                    duration: 4,
                    delay: 0.5 + i * 1.2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          )}

          {/* Ship with extreme parallax */}
          <motion.div
            style={{ x: shipX, scale: shipScale }}
            className="absolute -right-20 bottom-[-5%] w-[120%]"
          >
            <motion.img
              src={data.shipImageUrl}
              alt="Cargo ship"
              className="w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]"
              animate={isInView ? { 
                y: [0, -15, 0], 
                rotate: [-0.5, 1, -0.5],
              } : {}}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}