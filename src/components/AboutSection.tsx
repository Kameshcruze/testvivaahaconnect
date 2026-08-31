import { motion } from 'motion/react';
import { ShieldCheck, Heart, Users, Lock } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="relative py-8 sm:py-12 lg:py-14 overflow-hidden bg-gradient-to-b from-[#FFF9F5] via-[#F8E8DA]/30 to-[#FFF9F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6A1E2C]/10 border border-[#6A1E2C]/20 text-[#6A1E2C] text-xs font-semibold uppercase tracking-wider mb-4">
            <Heart className="w-3.5 h-3.5 text-[#C89B63] fill-[#C89B63]" /> About Vivaaha Connect
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#6A1E2C] leading-tight tracking-tight mb-4">
            Trusted Kongu Vellalar Matrimony
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-[#222222]/85 leading-relaxed font-normal mb-6">
            Vivaaha Connect is exclusively dedicated to Kongu Vellalar Gounder families. We help brides and grooms discover highly compatible life partners honoring traditional Kulam customs, verified professional backgrounds, and complete family privacy.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#C89B63]/30 text-xs sm:text-sm font-bold text-[#6A1E2C] shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#C89B63]" /> 100% Verified Profiles
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#C89B63]/30 text-xs sm:text-sm font-bold text-[#6A1E2C] shadow-sm">
              <Users className="w-4 h-4 text-[#C89B63]" /> Kongu Vellalar Only
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#C89B63]/30 text-xs sm:text-sm font-bold text-[#6A1E2C] shadow-sm">
              <Lock className="w-4 h-4 text-[#C89B63]" /> Privacy Assured
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
