import { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, CheckCircle2, ArrowRight, ShieldCheck, Heart, ExternalLink, UserCheck } from 'lucide-react';
import { GOOGLE_FORM_URL } from '../types';

interface HeroProps {
  onOpenCallModal: () => void;
}

export default function Hero({ onOpenCallModal }: HeroProps) {
  const [activeTab, setActiveTab] = useState<'bride' | 'groom'>('bride');

  const trustPoints = [
    "Verified Profiles",
    "All Communities Welcome",
    "Complete Privacy",
    "Personal Matchmaking Support",
  ];

  return (
    <section id="home" className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 flex items-center justify-center overflow-hidden">
      {/* Background Radial Glow & Soft Ambient Lighting */}
      <div className="absolute top-1/4 left-1/6 w-[450px] h-[450px] sm:w-[550px] sm:h-[550px] bg-[#C89B63]/15 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#6A1E2C]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Decorative Vector Icons */}
      <div className="absolute top-28 right-12 text-[#C89B63]/30 animate-float-slow pointer-events-none hidden sm:block">
        <Heart className="w-8 h-8 fill-[#C89B63]/20" />
      </div>
      <div className="absolute bottom-16 left-8 text-[#6A1E2C]/20 animate-float-reverse pointer-events-none hidden sm:block">
        <Heart className="w-10 h-10 fill-[#6A1E2C]/20" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Left Column: Content (45% Width on Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[45%] flex flex-col justify-center text-left"
          >
            {/* Small Label */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#C89B63]/30 shadow-sm backdrop-blur-md self-start mb-3"
            >
              <span className="text-xs sm:text-sm font-semibold text-[#6A1E2C]">
                Trusted Matrimony Across Tamil Nadu & India
              </span>
            </motion.div>

            {/* Sub Heading */}
            <div className="mb-2 flex items-center flex-wrap gap-2 text-xs sm:text-sm">
              <span className="font-bold text-[#C89B63] uppercase tracking-wider">
                Vivaaha Connect
              </span>
              <span className="text-[#6A1E2C]/30">•</span>
              <span className="font-medium text-[#6A1E2C]">
                Connecting Hearts • Building Families
              </span>
            </div>

            {/* Main Heading (Desktop ~64px-72px, Mobile ~36px-42px) */}
            <h1 className="text-3xl sm:text-5xl lg:text-[68px] font-bold text-[#6A1E2C] leading-[1.1] tracking-tight mb-4">
              Find Your <span className="text-[#C89B63]">Perfect</span> Life Partner
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-[18px] text-[#222222]/80 leading-relaxed mb-4 max-w-[520px]">
              We help brides and grooms from all communities find genuine, verified life partners through a trusted and personalized matchmaking service.
            </p>

            {/* Elegant Open to All Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F8E8DA]/80 border border-[#C89B63]/30 backdrop-blur-sm self-start mb-5 text-xs sm:text-sm font-semibold text-[#6A1E2C]">
              <UserCheck className="w-4 h-4 text-[#C89B63] shrink-0" />
              <span>Open to All Communities Across Tamil Nadu & India</span>
            </div>

            {/* Trust Card (4 points) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-[#C89B63]/25 shadow-sm backdrop-blur-md mb-6 max-w-[520px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {trustPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B63] shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-[#222222]">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Primary Register Profile */}
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#6A1E2C] hover:bg-[#8C283B] text-white text-sm sm:text-base font-bold shadow-lg shadow-[#6A1E2C]/20 hover:shadow-xl hover:shadow-[#6A1E2C]/30 transition-all duration-300"
              >
                <span>Register Profile</span>
                <ArrowRight className="w-4 h-4 text-[#C89B63] group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Call Now */}
              <button
                onClick={onOpenCallModal}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white border border-[#C89B63]/40 text-[#6A1E2C] text-sm sm:text-base font-bold shadow-sm hover:bg-[#6A1E2C] hover:text-white hover:border-[#6A1E2C] transition-all duration-300 group"
              >
                <Phone className="w-4 h-4 text-[#C89B63] group-hover:text-white transition-colors" />
                <span>Call Now</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Visual Image & Matchmaking Registration Card (55% Width on Desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="w-full lg:w-[55%] flex flex-col gap-6"
          >
            {/* Visual Hero Image Container */}
            <div className="relative w-full rounded-3xl overflow-hidden border border-[#C89B63]/30 shadow-xl bg-[#6A1E2C]/5 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10]">
              <img
                src="https://images.unsplash.com/photo-BDWH_GDKVCI?auto=format&fit=crop&q=80&w=1200"
                alt="Traditional Indian Bride and Groom - Vivaaha Connect"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              
              {/* Subtle Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D0A11]/80 via-transparent to-transparent" />

              {/* Bottom Image Badge */}
              <div className="absolute bottom-4 left-4 right-4 text-white p-3 sm:p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C89B63]">
                    Matchmaking Excellence
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white mt-0.5">
                    Traditional Trust • Personalized Care
                  </h4>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#6A1E2C] flex items-center justify-center text-[#C89B63] border border-[#C89B63]/40 shrink-0">
                  <Heart className="w-4 h-4 fill-[#C89B63]" />
                </div>
              </div>

              {/* Top Floating Badge */}
              <div className="absolute top-4 right-4 glass-card rounded-xl px-3 py-1.5 shadow-md border border-[#C89B63]/40 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C89B63]" />
                <span className="text-xs font-bold text-[#6A1E2C]">100% Confidential</span>
              </div>
            </div>

            {/* Quick Registration Cards (Matching Image 1 Aesthetic) */}
            <div className="rounded-3xl bg-white/95 border border-[#C89B63]/30 shadow-xl p-5 sm:p-6 backdrop-blur-lg relative overflow-hidden">
              {/* Card Header & Tab Switcher */}
              <div className="flex items-center justify-between mb-4 border-b border-[#C89B63]/15 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#6A1E2C] text-[#C89B63] flex items-center justify-center shadow-md">
                    <Heart className="w-5 h-5 fill-[#C89B63]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#6A1E2C] leading-none">
                      {activeTab === 'bride' ? 'Bride Registration' : 'Groom Registration'}
                    </h3>
                    <p className="text-[11px] text-[#222222]/60 font-medium mt-1">
                      Quick & Confidential Matchmaking
                    </p>
                  </div>
                </div>

                {/* Tab Switcher */}
                <div className="inline-flex p-1 rounded-xl bg-[#6A1E2C]/10 border border-[#C89B63]/20">
                  <button
                    onClick={() => setActiveTab('bride')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'bride'
                        ? 'bg-[#6A1E2C] text-white shadow-sm'
                        : 'text-[#6A1E2C] hover:bg-white/50'
                    }`}
                  >
                    FOR BRIDES
                  </button>
                  <button
                    onClick={() => setActiveTab('groom')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'groom'
                        ? 'bg-[#6A1E2C] text-white shadow-sm'
                        : 'text-[#6A1E2C] hover:bg-white/50'
                    }`}
                  >
                    FOR GROOMS
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <p className="text-xs sm:text-sm text-[#222222]/80 leading-relaxed mb-4">
                {activeTab === 'bride'
                  ? 'Register bride profiles with complete confidentiality. Connect with educated, well-settled grooms across all communities in Tamil Nadu and India.'
                  : 'Register groom profiles with complete confidentiality. Connect with educated, well-settled brides across all communities in Tamil Nadu and India.'}
              </p>

              {/* Bullet Points */}
              <div className="space-y-2 mb-5 text-xs sm:text-sm font-semibold text-[#222222]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Privacy & Protected Photos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Professional Backgrounds</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>All Castes & Sub-castes Welcome</span>
                </div>
              </div>

              {/* Direct Card Action Button */}
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#6A1E2C] hover:bg-[#8C283B] text-white font-bold text-xs sm:text-sm shadow-md transition"
              >
                <span>
                  {activeTab === 'bride' ? 'Register Bride Profile' : 'Register Groom Profile'}
                </span>
                <ExternalLink className="w-4 h-4 text-[#C89B63]" />
              </a>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
