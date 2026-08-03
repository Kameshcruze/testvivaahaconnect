import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Search, PhoneCall } from 'lucide-react';
import { FAQ_DATA, PHONE_NUMBER } from '../types';

interface FAQSectionProps {
  onOpenCallModal: () => void;
}

export default function FAQSection({ onOpenCallModal }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>("faq-1");
  const [searchTerm, setSearchTerm] = useState("");

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = FAQ_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="faq" className="relative py-20 lg:py-28 bg-gradient-to-b from-[#FFF9F5] via-[#F8E8DA]/20 to-[#FFF9F5] overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6A1E2C]/10 border border-[#6A1E2C]/20 text-[#6A1E2C] text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#C89B63]" /> Got Questions?
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-[#6A1E2C] tracking-tight"
          >
            Frequently Asked <span className="gold-gradient-text italic">Questions</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-3 text-base sm:text-lg text-[#222222]/75"
          >
            Everything you need to know about registering and finding your life partner with Vivaaha Connect.
          </motion.p>

          {/* Quick Search Bar */}
          <div className="mt-8 relative max-w-md mx-auto">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#C89B63]" />
            <input
              type="text"
              placeholder="Search questions (e.g. privacy, communities, call)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-[#C89B63]/30 text-sm focus:outline-none focus:border-[#6A1E2C] shadow-sm transition"
            />
          </div>
        </div>

        {/* Accordions List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="glass-card rounded-2xl overflow-hidden border border-[#C89B63]/30 transition-all"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-white/60 transition"
                  >
                    <span className="flex items-center gap-3 text-base sm:text-lg font-heading font-bold text-[#6A1E2C]">
                      <HelpCircle className="w-5 h-5 text-[#C89B63] shrink-0" />
                      {faq.question}
                    </span>
                    <div
                      className={`p-2 rounded-full bg-[#F8E8DA] text-[#6A1E2C] transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180 bg-[#6A1E2C] text-white' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 sm:p-6 pt-0 text-sm sm:text-base text-[#222222]/85 leading-relaxed border-t border-[#C89B63]/15 mt-1 bg-white/40">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8 text-[#222222]/60">
              No matching questions found for "{searchTerm}".
            </div>
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-12 p-6 rounded-3xl bg-white border border-[#C89B63]/30 text-center shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-lg font-heading font-bold text-[#6A1E2C]">
              Have a specific question not listed here?
            </h4>
            <p className="text-xs text-[#222222]/70">
              Our Coimbatore team is available on phone to clarify all your doubts.
            </p>
          </div>
          <button
            onClick={onOpenCallModal}
            className="px-5 py-2.5 rounded-xl bg-[#6A1E2C] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#8C283B] transition shrink-0"
          >
            <PhoneCall className="w-4 h-4 text-[#C89B63]" /> Call {PHONE_NUMBER}
          </button>
        </div>

      </div>
    </section>
  );
}
