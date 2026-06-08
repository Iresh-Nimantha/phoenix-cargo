import { useSettings } from '../context/SettingsContext';
import { motion } from 'motion/react';
import { Truck } from 'lucide-react';

export default function LoadingScreen() {
  const { logoUrl } = useSettings();

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0d0c0b] flex flex-col items-center justify-center">
      {/* Logo Container with white backing to ensure transparent/bg-removed logos are always clear */}
      <div className="bg-white p-4 rounded-2xl shadow-2xl flex items-center justify-center mb-10 max-w-[200px] border border-white/20">
        <motion.img
          src={logoUrl}
          alt="Phoenix Cargo"
          className="h-12 w-auto object-contain"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Immersive Cargo Track Loader */}
      <div className="relative w-72 flex flex-col items-center">
        {/* Track Line */}
        <div className="w-full h-1.5 bg-white/10 rounded-full relative">
          {/* Glowing Progress Fill (Fire Theme) */}
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-fire-orange to-fire-amber rounded-full"
            animate={{ width: ['0%', '100%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Moving Cargo Truck (Fire Theme) */}
          <motion.div
            className="absolute -top-6 -translate-x-1/2 flex flex-col items-center"
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Truck className="w-5 h-5 text-fire-orange drop-shadow-[0_0_8px_rgba(232,97,10,0.6)]" />
            {/* Small bounce animation under truck */}
            <motion.div 
              className="w-1.5 h-1.5 bg-fire-orange rounded-full mt-0.5"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </div>

      {/* Loading text */}
      <motion.p
        className="mt-8 text-white/40 text-xs font-bold tracking-[0.3em] uppercase animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Precision Delivery Loading
      </motion.p>
    </div>
  );
}
