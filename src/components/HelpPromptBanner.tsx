import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MessageCircle, X, Headphones } from 'lucide-react';
import { PHONE_NUMBER, PHONE_RAW } from '../types';

interface HelpPromptBannerProps {
  onOpenCallModal: () => void;
}

export default function HelpPromptBanner({ onOpenCallModal }: HelpPromptBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if previously dismissed in this browser session
    const dismissedSession = sessionStorage.getItem('vivaaha_help_banner_dismissed');
    if (dismissedSession) {
      return;
    }

    // Trigger popup after exactly 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    try {
      sessionStorage.setItem('vivaaha_help_banner_dismissed', 'true');
    } catch (e) {
      // ignore
    }
  };

  const handleWhatsApp = () => {
    const textMessage = `Hello Vivaaha Connect,\n\nI need help and guidance regarding Kongu Vellalar Matrimony registration and matchmaking services.`;
    const whatsappUrl = `https://wa.me/919486955380?text=${encodeURIComponent(textMessage)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCall = () => {
    onOpenCallModal();
  };

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-50 max-w-[340px] sm:max-w-sm w-[calc(100%-2rem)] sm:w-auto"
        >
          <div className="relative rounded-3xl bg-white/95 backdrop-blur-md border-2 border-[#C89B63]/40 shadow-2xl p-4 sm:p-5 text-[#222222] overflow-hidden">
            {/* Ambient accent top bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#6A1E2C] via-[#C89B63] to-[#6A1E2C]" />

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              aria-label="Dismiss help popup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Avatar info */}
            <div className="flex items-start gap-3.5 pr-6">
              <div className="relative shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-2xl bg-[#6A1E2C] text-[#C89B63] flex items-center justify-center shadow-md">
                  <Headphones className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white" />
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#C89B63] uppercase tracking-wider">
                    Live Support
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold font-heading text-[#6A1E2C] leading-tight">
                  Need Help with Registration?
                </h4>
                <p className="text-xs text-[#222222]/75 mt-0.5 leading-relaxed">
                  Our matchmaking counselors are ready to assist you or register on your behalf.
                </p>
              </div>
            </div>

            {/* Action buttons: Call Us & WhatsApp */}
            <div className="mt-3.5 pt-3 border-t border-[#C89B63]/20 flex items-center gap-2">
              {/* Call Us Button */}
              <button
                onClick={handleCall}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#6A1E2C] text-white text-xs font-bold shadow-md hover:bg-[#521722] active:scale-[0.98] transition"
              >
                <Phone className="w-3.5 h-3.5 text-[#C89B63]" />
                <span>Call Us</span>
              </button>

              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsApp}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-md hover:bg-[#1EBE5B] active:scale-[0.98] transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>

            {/* Helpline quick display */}
            <div className="mt-2 text-center">
              <a
                href={`tel:${PHONE_RAW}`}
                className="text-[11px] font-semibold text-[#6A1E2C] hover:underline"
              >
                Direct Helpline: {PHONE_NUMBER}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
