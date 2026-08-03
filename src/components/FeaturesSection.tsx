import { motion } from 'motion/react';
import { 
  UserCheck, 
  Globe, 
  HeartHandshake, 
  ShieldAlert, 
  BadgeCheck, 
  PhoneCall, 
  Laptop, 
  PhoneForwarded, 
  Map, 
  Compass, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { FEATURES_LIST } from '../types';

export default function FeaturesSection() {
  const iconMap: Record<string, any> = {
    UserCheck,
    Globe,
    HeartHandshake,
    ShieldAlert,
    BadgeCheck,
    PhoneCall,
    Laptop,
    PhoneForwarded,
    Map,
    Compass,
    Clock,
    ShieldCheck
  };

  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-b from-[#FFF9F5] via-[#F8E8DA]/20 to-[#FFF9F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6A1E2C]/10 border border-[#6A1E2C]/20 text-[#6A1E2C] text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C89B63]" /> Everything You Need
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-[#6A1E2C] tracking-tight"
          >
            Comprehensive Features for <span className="gold-gradient-text italic">Peace of Mind</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-base sm:text-lg text-[#222222]/75"
          >
            Designed to protect candidate dignity while facilitating meaningful family connections.
          </motion.p>
        </div>

        {/* 12 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {FEATURES_LIST.map((feat, idx) => {
            const IconComponent = iconMap[feat.iconName] || ShieldCheck;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="glass-card rounded-2xl p-6 border border-[#C89B63]/25 flex flex-col justify-between hover:border-[#6A1E2C]/40 hover:shadow-xl transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#6A1E2C] text-[#FFF9F5] flex items-center justify-center shadow-md shadow-[#6A1E2C]/15 group-hover:bg-[#C89B63] transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {feat.tag && (
                      <span className="text-[10px] font-bold text-[#6A1E2C] bg-[#F8E8DA] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {feat.tag}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-heading font-bold text-[#6A1E2C] mb-2 group-hover:text-[#8C283B] transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-[#222222]/80 leading-relaxed">
                    {feat.description}
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
