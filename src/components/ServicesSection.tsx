import { motion } from 'motion/react';
import { UserCheck, PhoneCall, ExternalLink, Phone, Heart, Check, MessageCircle } from 'lucide-react';
import { GOOGLE_FORM_URL, PHONE_NUMBER } from '../types';

interface ServicesSectionProps {
  onOpenCallModal: () => void;
}

export default function ServicesSection({ onOpenCallModal }: ServicesSectionProps) {
  return (
    <section id="services" className="relative py-8 sm:py-12 lg:py-14 bg-gradient-to-b from-[#FFF9F5] via-[#F8E8DA]/30 to-[#FFF9F5]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6A1E2C]/10 border border-[#6A1E2C]/20 text-[#6A1E2C] text-xs font-semibold uppercase tracking-wider mb-3"
          >
            <Heart className="w-3.5 h-3.5 text-[#C89B63] fill-[#C89B63]" /> Our Services
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#6A1E2C] tracking-tight"
          >
            Dedicated Matrimony Solutions for <span className="text-[#C89B63] italic pr-2 inline-block">Kongu Vellalar Gounder Families</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-3 text-sm sm:text-base text-[#222222]/75"
          >
            Choose your registration path or connect directly with our dedicated Kongu Vellalar Gounder matrimony consultants.
          </motion.p>
        </div>

        {/* 3 Large Premium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Bride Registration */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-2 border-[#C89B63]/30 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#F8E8DA] rounded-bl-full pointer-events-none -z-10" />

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6A1E2C] to-[#8C283B] text-[#FFF9F5] flex items-center justify-center shadow-lg shadow-[#6A1E2C]/20">
                  <Heart className="w-6 h-6 text-[#C89B63] fill-[#C89B63]/30" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F8E8DA] text-[#6A1E2C] text-xs font-bold uppercase tracking-wider">
                  For Brides
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#6A1E2C] mb-2">
                Bride Registration
              </h3>

              <p className="text-xs sm:text-sm text-[#222222]/80 leading-relaxed mb-5">
                Register Kongu Vellalar Gounder bride profiles with complete confidentiality. Connect with educated, well-settled grooms from compatible Kulams across Tamil Nadu & worldwide.
              </p>

              <ul className="space-y-2 mb-6 text-xs font-medium text-[#222222]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Privacy & Protected Photos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Professional Backgrounds</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kongu Vellalar Gounder Kulam Compatibility</span>
                </li>
              </ul>
            </div>

            <a
              href="/registration"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#6A1E2C] text-white font-semibold text-xs sm:text-sm hover:bg-[#8C283B] shadow-md transition-all group"
            >
              <span>Register Bride Profile</span>
              <ExternalLink className="w-4 h-4 text-[#C89B63]" />
            </a>
          </motion.div>

          {/* Card 2: Groom Registration */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-2 border-[#C89B63]/30 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#F8E8DA] rounded-bl-full pointer-events-none -z-10" />

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6A1E2C] to-[#8C283B] text-[#FFF9F5] flex items-center justify-center shadow-lg shadow-[#6A1E2C]/20">
                  <UserCheck className="w-6 h-6 text-[#C89B63]" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F8E8DA] text-[#6A1E2C] text-xs font-bold uppercase tracking-wider">
                  For Grooms
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#6A1E2C] mb-2">
                Groom Registration
              </h3>

              <p className="text-xs sm:text-sm text-[#222222]/80 leading-relaxed mb-5">
                Register Kongu Vellalar Gounder groom profiles to discover compatible, cultured brides. Tailored matchmaking based on educational, professional, and traditional family values.
              </p>

              <ul className="space-y-2 mb-6 text-xs font-medium text-[#222222]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Genuine Verified Candidate Profiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kulam & Horoscope Matching</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct Family-to-Family Connect</span>
                </li>
              </ul>
            </div>

            <a
              href="/registration"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#6A1E2C] text-white font-semibold text-xs sm:text-sm hover:bg-[#8C283B] shadow-md transition-all group"
            >
              <span>Register Groom Profile</span>
              <ExternalLink className="w-4 h-4 text-[#C89B63]" />
            </a>
          </motion.div>

          {/* Card 3: Consultation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-2 border-[#6A1E2C] relative overflow-hidden shadow-2xl bg-gradient-to-b from-white via-[#FFF9F5] to-[#F8E8DA]/40"
          >
            <div className="absolute top-0 right-0 px-3.5 py-1 bg-[#6A1E2C] text-[#C89B63] text-[10px] font-bold uppercase tracking-widest rounded-bl-2xl">
              Recommended for Parents
            </div>

            <div>
              <div className="flex items-center justify-between mb-5 mt-2">
                <div className="w-12 h-12 rounded-2xl bg-[#C89B63] text-white flex items-center justify-center shadow-lg shadow-[#C89B63]/30">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#6A1E2C] text-[#FFF9F5] text-xs font-bold uppercase tracking-wider">
                  Personal Help
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#6A1E2C] mb-2">
                Consultation
              </h3>

              <p className="text-xs sm:text-sm text-[#222222]/85 leading-relaxed mb-5 font-medium">
                Need guidance before registering? Speak directly with our senior matrimony consultant for friendly, confidential advice.
              </p>

              <div className="p-3.5 rounded-2xl bg-white/80 border border-[#C89B63]/30 mb-6 text-xs text-[#6A1E2C] font-medium leading-relaxed flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-[#C89B63] shrink-0 mt-0.5" />
                <span>Ideal for parents, guardians, and candidates seeking custom criteria discussion or second marriage matchmaking.</span>
              </div>
            </div>

            <button
              onClick={onOpenCallModal}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#C89B63] to-[#b0844d] text-white font-bold text-xs sm:text-sm shadow-md transition-all group"
            >
              <Phone className="w-4 h-4 text-white" />
              <span>Call Now {PHONE_NUMBER}</span>
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
