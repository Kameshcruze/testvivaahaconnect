import { motion } from 'motion/react';
import { ShieldCheck, Heart, Users, Lock } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="relative py-10 sm:py-16 lg:py-20 overflow-hidden bg-gradient-to-b from-[#FFF9F5] via-[#F8E8DA]/30 to-[#FFF9F5]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Side: Image Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#C89B63]/30 aspect-[4/3] sm:aspect-[16/11] bg-white">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=900"
                  alt="Vivaaha Connect Matchmaking"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#6A1E2C]/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl glass-card text-[#6A1E2C] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#6A1E2C] text-[#C89B63] flex items-center justify-center shrink-0">
                    <Heart className="w-4 h-4 fill-[#C89B63]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6A1E2C] block">Family-Centric Matrimony</span>
                    <span className="text-[11px] text-[#222222]/70 font-medium">Connecting Genuine Hearts</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Exact Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6A1E2C]/10 border border-[#6A1E2C]/20 text-[#6A1E2C] text-xs font-semibold uppercase tracking-wider self-start mb-3">
              <Heart className="w-3.5 h-3.5 text-[#C89B63] fill-[#C89B63]" /> About Vivaaha Connect
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#6A1E2C] leading-tight tracking-tight mb-4">
              Trusted Matrimony for Every Family
            </h2>

            {/* Exact Paragraph Requested */}
            <p className="text-sm sm:text-lg lg:text-xl text-[#222222]/85 leading-relaxed font-normal mb-5">
              Vivaaha Connect helps brides and grooms from all communities find compatible life partners through verified profiles, personalized guidance, and complete privacy. We make the matchmaking journey simple, trusted, and family-friendly.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#C89B63]/30 text-xs font-bold text-[#6A1E2C] shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C89B63]" /> 100% Verified Profiles
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#C89B63]/30 text-xs font-bold text-[#6A1E2C] shadow-sm">
                <Users className="w-3.5 h-3.5 text-[#C89B63]" /> Open to All Communities
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#C89B63]/30 text-xs font-bold text-[#6A1E2C] shadow-sm">
                <Lock className="w-3.5 h-3.5 text-[#C89B63]" /> Privacy Assured
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
