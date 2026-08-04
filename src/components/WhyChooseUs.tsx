import { motion } from 'motion/react';
import { ShieldCheck, Lock, Heart, Headphones, Award, Zap } from 'lucide-react';

export default function WhyChooseUs() {
  const cards = [
    {
      title: "Verified Profiles",
      description: "Every profile undergoes authentic verification for complete peace of mind.",
      icon: ShieldCheck,
    },
    {
      title: "Privacy Assured",
      description: "Your contact details are shared only after mutual family approval.",
      icon: Lock,
    },
    {
      title: "Personalized Matches",
      description: "Tailored recommendations based on your preferences and values.",
      icon: Heart,
    },
    {
      title: "Dedicated Support",
      description: "Friendly helpline advisors available to guide you at every step.",
      icon: Headphones,
    },
    {
      title: "Trusted Service",
      description: "Proudly connecting families across all regions of Tamil Nadu.",
      icon: Award,
    },
    {
      title: "Fast Registration",
      description: "Quick and effortless online form completion in just a few minutes.",
      icon: Zap,
    },
  ];

  return (
    <section id="why-choose-us" className="relative py-8 sm:py-12 lg:py-14 bg-[#FFF9F5] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8E8DA] border border-[#C89B63]/30 text-[#6A1E2C] text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-[#C89B63]" /> Why Choose Us
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#6A1E2C] tracking-tight">
            Built on Trust & Integrity
          </h2>
        </div>

        {/* 6 Clean Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const IconComp = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative group border border-[#C89B63]/25 bg-white/80"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6A1E2C] to-[#8C283B] text-[#FFF9F5] flex items-center justify-center mb-5 shadow-md shadow-[#6A1E2C]/15 group-hover:scale-105 transition-transform">
                    <IconComp className="w-6 h-6 text-[#C89B63]" />
                  </div>

                  <h3 className="text-xl font-bold text-[#6A1E2C] mb-2">
                    {card.title}
                  </h3>

                  <p className="text-sm text-[#222222]/80 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
