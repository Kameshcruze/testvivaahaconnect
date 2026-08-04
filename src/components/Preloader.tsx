import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

export default function Preloader() {
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem('vivaaha_preloaded');
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (loading) {
      try {
        sessionStorage.setItem('vivaaha_preloaded', 'true');
      } catch {
        // ignore quota/security errors
      }
      const timer = setTimeout(() => {
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleDismiss = () => {
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[#3B0E17] text-[#FFF9F5] overflow-hidden cursor-pointer selection:bg-transparent"
        >
          {/* Animated Background Aura */}
          <div className="absolute w-96 h-96 bg-[#C89B63]/20 rounded-full blur-3xl animate-pulse-glow" />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center text-center px-6"
          >
            {/* Logo Emblem */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full border border-[#C89B63]/40 bg-[#6A1E2C]/80 backdrop-blur-md flex items-center justify-center shadow-2xl">
                <Heart className="w-10 h-10 text-[#C89B63] fill-[#C89B63]/20 animate-pulse" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 border border-dashed border-[#C89B63]/30 rounded-full pointer-events-none"
              />
            </div>

            {/* Brand Title */}
            <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[#FFF9F5]">
              Vivaaha <span className="text-[#C89B63]">Connect</span>
            </h1>

            <p className="mt-2 text-sm text-[#F8E8DA]/80 tracking-widest uppercase font-medium flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C89B63]" />
              Connecting Hearts • Building Families
              <Sparkles className="w-3.5 h-3.5 text-[#C89B63]" />
            </p>

            {/* Tamil Tagline */}
            <p className="mt-3 text-xs font-tamil text-[#C89B63] opacity-90 tracking-wide">
              நம்பிக்கையான திருமணப் சேவை
            </p>

            {/* Progress indicator bar */}
            <div className="mt-8 w-48 h-1 bg-[#6A1E2C] rounded-full overflow-hidden border border-[#C89B63]/30">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-[#C89B63] via-[#F8E8DA] to-[#C89B63]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
