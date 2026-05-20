import { useSettings } from '../context/SettingsContext';
import { motion } from 'motion/react';
import { Truck } from 'lucide-react';

export default function LoadingScreen() {
  const { logoUrl } = useSettings();

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0B2545] flex flex-col items-center justify-center">
      {/* Logo */}
      <motion.img
        src={logoUrl}
        alt="Alliance Freight"
        className="h-16 w-auto mb-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Immersive Cargo Track Loader */}
      <div className="relative w-72 flex flex-col items-center">
        {/* Track Line */}
        <div className="w-full h-1 bg-white/10 rounded-full relative">
          {/* Glowing Progress Fill */}
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
            animate={{ width: ['0%', '100%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Moving Cargo Truck */}
          <motion.div
            className="absolute -top-6 -translate-x-1/2 flex flex-col items-center"
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Truck className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
            {/* Small bounce animation under truck */}
            <motion.div 
              className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-0.5"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </div>

      {/* Loading text */}
      <motion.p
        className="mt-8 text-white/50 text-xs font-bold tracking-[0.3em] uppercase animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Precision Delivery Loading
      </motion.p>
    </div>
  );
}
