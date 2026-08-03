import { motion } from 'motion/react';
import { ArrowRight, Phone, Heart } from 'lucide-react';
import { GOOGLE_FORM_URL } from '../types';

interface FinalCTAProps {
  onOpenCallModal: () => void;
}

export default function FinalCTA({ onOpenCallModal }: FinalCTAProps) {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-[#2D0A11] text-[#FFF9F5]">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,155,99,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Heart Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-14 h-14 mx-auto rounded-2xl bg-[#C89B63] text-white flex items-center justify-center shadow-xl mb-6"
        >
          <Heart className="w-7 h-7 fill-white/30" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFF9F5] leading-tight tracking-tight mb-4"
        >
          Ready to Meet Your Perfect Match?
        </motion.h2>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-xl text-[#F8E8DA]/90 max-w-xl mx-auto mb-8 font-normal"
        >
          Join hundreds of happy families who trust Vivaaha Connect.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Register Profile */}
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#C89B63] hover:bg-[#b0844d] text-[#2D0A11] text-base font-bold shadow-xl transition-all duration-300"
          >
            <span>Register Profile</span>
            <ArrowRight className="w-5 h-5" />
          </a>

          {/* Call Now */}
          <button
            onClick={onOpenCallModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white/10 border border-white/30 text-white text-base font-bold hover:bg-white hover:text-[#2D0A11] transition-all duration-300"
          >
            <Phone className="w-5 h-5 text-[#C89B63]" />
            <span>Call Now</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
