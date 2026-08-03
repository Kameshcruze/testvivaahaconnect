import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, MousePointerClick, ShieldCheck, Heart, Users, Award } from 'lucide-react';
import { GOOGLE_FORM_URL } from '../types';

export default function RegistrationProcess() {
  const steps = [
    {
      step: 1,
      title: "Register Online",
      description: "Fill out our simple online form with basic candidate details and partner preferences.",
      icon: MousePointerClick,
    },
    {
      step: 2,
      title: "Profile Review",
      description: "Our verification team reviews submitted details to ensure complete authenticity.",
      icon: ShieldCheck,
    },
    {
      step: 3,
      title: "Suitable Matches",
      description: "Receive handpicked prospective profile matches tailored to your expectations.",
      icon: Heart,
    },
    {
      step: 4,
      title: "Family Discussion",
      description: "Connect and discuss with interested candidate families through mutual consent.",
      icon: Users,
    },
    {
      step: 5,
      title: "Begin Your Journey",
      description: "Proceed towards a blissful union with confidence, clarity, and blessings.",
      icon: Award,
    },
  ];

  return (
    <section id="registration" className="relative py-16 lg:py-24 bg-[#FFF9F5] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8E8DA] border border-[#C89B63]/30 text-[#6A1E2C] text-xs font-semibold uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C89B63]" /> Simple Registration
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#6A1E2C] tracking-tight">
            How Vivaaha Connect Works
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 relative">
          {steps.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card rounded-3xl p-6 flex flex-col justify-between border border-[#C89B63]/25 bg-white/80 relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-[#6A1E2C] text-[#C89B63] font-bold text-xs flex items-center justify-center">
                      0{item.step}
                    </span>
                    <IconComp className="w-5 h-5 text-[#C89B63]" />
                  </div>

                  <h3 className="text-lg font-bold text-[#6A1E2C] mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#222222]/80 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick CTA Banner */}
        <div className="mt-12 text-center p-8 rounded-3xl bg-gradient-to-r from-[#6A1E2C] via-[#8C283B] to-[#6A1E2C] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left max-w-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Ready to Register Your Profile?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 mt-1">
              Takes only 3 minutes to submit candidate details and preferences online.
            </p>
          </div>

          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#C89B63] hover:bg-[#b0844d] text-white font-bold text-xs sm:text-sm shadow-md transition"
          >
            <span>Register Profile Online</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
