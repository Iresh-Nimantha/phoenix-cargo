import { motion, useScroll, useTransform } from 'motion/react';

export default function FloatingContainer() {
  const { scrollY } = useScroll();
  const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  // Stays in middle for the first 400px of scroll, then moves
  const xOffset = useTransform(scrollY, [0, 400, 900], [0, 0, -500], { ease: easeInOut });
  const opacity = useTransform(scrollY, [0, 700, 900], [1, 1, 0], { ease: easeInOut });
  const rotate = useTransform(scrollY, [0, 400, 900], [0, 0, -5]);
  const scale = useTransform(scrollY, [0, 400, 900], [1.55, 1.55, 1.2]);

  return (
    <div className="hidden md:flex fixed inset-0 z-[20] items-center justify-center pointer-events-none">
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          y: -30,
          scale: scale,
          x: xOffset,
          opacity,
          rotateZ: rotate,
          willChange: 'transform, opacity',
        }}
        className="w-[260px] md:w-[460px] lg:w-[620px]"
      >
        <img
          src="https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/container.png"
          alt="Phoenix Cargo Container"
          className="w-full h-auto object-contain drop-shadow-2xl"
          referrerPolicy="no-referrer"
        />
        {/* Dynamic shadow beneath container */}
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-4 bg-black/10 rounded-full blur-lg"
          animate={{ scaleX: [0.9, 1.1, 0.9], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  );
}
