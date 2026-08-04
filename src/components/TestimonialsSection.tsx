import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote, Heart, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../types';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  const current = TESTIMONIALS_DATA[currentIndex];

  return (
    <section className="relative py-8 sm:py-12 lg:py-14 bg-[#FFF9F5] overflow-hidden">
      {/* Background Decorative Lighting */}
      <div className="hidden sm:block absolute top-1/4 left-10 w-96 h-96 bg-[#C89B63]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8E8DA] border border-[#C89B63]/30 text-[#6A1E2C] text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Heart className="w-3.5 h-3.5 text-[#C89B63] fill-[#C89B63]" /> Real Stories
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-[#6A1E2C] tracking-tight"
          >
            Happy Couples <span className="gold-gradient-text italic pr-2 inline-block">& Blessed Families</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-base sm:text-lg text-[#222222]/75"
          >
            Read how Vivaaha Connect guided brides and grooms toward their lifelong marital journey.
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-4xl mx-auto relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="glass-card rounded-3xl p-8 sm:p-12 border-2 border-[#C89B63]/30 shadow-2xl relative bg-white/90"
            >
              <Quote className="absolute top-6 right-8 w-16 h-16 text-[#C89B63]/15 pointer-events-none" />

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
                
                {/* Photo Column */}
                <div className="sm:col-span-4 flex flex-col items-center text-center">
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#C89B63]/40 shadow-xl mb-3">
                    <img
                      src={current.image}
                      alt={current.names}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#6A1E2C]/10 text-[#6A1E2C] text-[11px] font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {current.matchType}
                  </span>
                </div>

                {/* Content Column */}
                <div className="sm:col-span-8 space-y-4">
                  {/* Star rating */}
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(current.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-base sm:text-lg text-[#222222]/90 italic font-serif leading-relaxed">
                    "{current.quote}"
                  </p>

                  <div className="pt-2 border-t border-[#C89B63]/20">
                    <h3 className="text-xl font-heading font-bold text-[#6A1E2C]">
                      {current.names}
                    </h3>
                    <p className="text-xs text-[#222222]/70 font-medium">
                      {current.role} • {current.location}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-2">
              {TESTIMONIALS_DATA.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-8 bg-[#6A1E2C]'
                      : 'w-2.5 bg-[#C89B63]/40 hover:bg-[#C89B63]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={prevSlide}
                className="p-3 rounded-full bg-white border border-[#C89B63]/40 text-[#6A1E2C] hover:bg-[#6A1E2C] hover:text-white transition shadow-md"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 rounded-full bg-white border border-[#C89B63]/40 text-[#6A1E2C] hover:bg-[#6A1E2C] hover:text-white transition shadow-md"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
