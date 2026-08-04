import { Phone } from 'lucide-react';

interface FloatingActionsProps {
  onOpenCallModal: () => void;
}

export default function FloatingActions({ onOpenCallModal }: FloatingActionsProps) {
  return (
    <div className="fixed inset-x-0 bottom-3 sm:bottom-5 z-40 pointer-events-none px-3 sm:px-6 max-w-[1400px] mx-auto flex items-center justify-end gap-3">
      
      {/* Bottom Right Floating Call Now Button */}
      <div className="pointer-events-auto">
        <button
          onClick={onOpenCallModal}
          className="group inline-flex items-center gap-2 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-full bg-[#C89B63] text-white text-xs sm:text-sm font-extrabold shadow-xl shadow-[#C89B63]/40 border border-white/40 hover:scale-105 active:scale-95 transition-all duration-300"
          aria-label="Call Now"
        >
          <Phone className="w-3.5 h-3.5 text-white" />
          <span>Call Now</span>
        </button>
      </div>

    </div>
  );
}
