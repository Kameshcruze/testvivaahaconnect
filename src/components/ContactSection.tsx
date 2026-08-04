import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PHONE_NUMBER, PHONE_RAW, EMAIL_ADDRESS, LOCATION_ADDRESS } from '../types';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    community: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-8 sm:py-12 lg:py-14 bg-[#FFF9F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8E8DA] border border-[#C89B63]/30 text-[#6A1E2C] text-xs font-semibold uppercase tracking-wider mb-4">
            <Phone className="w-3.5 h-3.5 text-[#C89B63]" /> Get In Touch
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-[#6A1E2C] tracking-tight">
            Contact <span className="gold-gradient-text italic">Vivaaha Connect</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#222222]/75">
            Our matrimony desk in Coimbatore is happy to assist families across Tamil Nadu and India.
          </p>
        </div>

        {/* Grid: Left Contact Info Cards & Right Enquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Headquarters Card */}
            <div className="glass-card rounded-3xl p-7 border border-[#C89B63]/30 shadow-xl space-y-6 bg-white/90">
              <div className="border-b border-[#C89B63]/20 pb-4">
                <h3 className="text-2xl font-heading font-bold text-[#6A1E2C]">
                  Vivaaha Connect
                </h3>
                <p className="text-xs text-[#C89B63] font-bold uppercase tracking-wider mt-0.5">
                  Matrimony Desk • Coimbatore
                </p>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#6A1E2C] text-[#FFF9F5] flex items-center justify-center shrink-0 shadow-md">
                  <MapPin className="w-5 h-5 text-[#C89B63]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#6A1E2C]">Headquarters Location</h4>
                  <p className="text-sm text-[#222222]/80 font-medium">
                    {LOCATION_ADDRESS}
                  </p>
                  <p className="text-xs text-[#222222]/60 mt-0.5">
                    Coimbatore City, Tamil Nadu, India
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#6A1E2C] text-[#FFF9F5] flex items-center justify-center shrink-0 shadow-md">
                  <Phone className="w-5 h-5 text-[#C89B63]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#6A1E2C]">Direct Helpline & WhatsApp</h4>
                  <a
                    href={`tel:${PHONE_RAW}`}
                    className="text-base font-bold text-[#6A1E2C] hover:text-[#C89B63] transition"
                  >
                    {PHONE_NUMBER}
                  </a>
                  <p className="text-xs text-emerald-600 font-medium mt-0.5">
                    Available for call or WhatsApp enquiry
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#6A1E2C] text-[#FFF9F5] flex items-center justify-center shrink-0 shadow-md">
                  <Mail className="w-5 h-5 text-[#C89B63]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#6A1E2C]">Email Desk</h4>
                  <a
                    href={`mailto:${EMAIL_ADDRESS}`}
                    className="text-sm font-semibold text-[#222222]/80 hover:text-[#6A1E2C] transition"
                  >
                    {EMAIL_ADDRESS}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4 pt-2 border-t border-[#C89B63]/15">
                <div className="w-10 h-10 rounded-2xl bg-[#F8E8DA] text-[#6A1E2C] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#6A1E2C]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#6A1E2C]">Working Hours</h4>
                  <p className="text-xs text-[#222222]/75">
                    Monday – Sunday: 9:00 AM – 8:00 PM IST
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Guarantee Note */}
            <div className="p-4 rounded-2xl bg-[#F8E8DA]/80 border border-[#C89B63]/30 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#6A1E2C] shrink-0" />
              <p className="text-xs text-[#6A1E2C] font-medium leading-tight">
                All family communications and contact details submitted to Vivaaha Connect are kept 100% strictly confidential.
              </p>
            </div>

          </div>

          {/* Right Column: Quick Callback / Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-3xl p-8 border-2 border-[#C89B63]/30 shadow-2xl bg-white">
              
              {!submitted ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-2xl font-heading font-bold text-[#6A1E2C]">
                      Request Immediate Callback
                    </h3>
                    <p className="text-xs text-[#222222]/70 mt-1">
                      Prefer us to call you? Fill out this 30-second enquiry form and our matrimony team will reach out.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1">
                          Your Name (Candidate / Parent)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. S. Ramanathan"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5] text-sm focus:outline-none focus:border-[#6A1E2C] transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1">
                          Phone / WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder=""
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5] text-sm focus:outline-none focus:border-[#6A1E2C] transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1">
                        Community / Religion (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Any community / Hindu / Muslim / Christian"
                        value={formData.community}
                        onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5] text-sm focus:outline-none focus:border-[#6A1E2C] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1">
                        Brief Details / Preferred Call Time
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Looking for bride, BE graduate, Coimbatore. Please call in evening."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5] text-sm focus:outline-none focus:border-[#6A1E2C] transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6A1E2C] via-[#8C283B] to-[#6A1E2C] text-white font-bold text-sm shadow-xl hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" /> Send Callback Request
                    </button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-4"
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-[#6A1E2C]">
                    Enquiry Received Successfully!
                  </h3>
                  <p className="text-sm text-[#222222]/80 leading-relaxed max-w-md mx-auto">
                    Thank you {formData.name ? formData.name : ''}! Our Coimbatore matrimony team will call you at <strong className="text-[#6A1E2C]">{formData.phone}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', community: '', notes: '' });
                    }}
                    className="px-6 py-2.5 rounded-2xl bg-[#6A1E2C] text-white text-xs font-bold hover:bg-[#8C283B] transition"
                  >
                    Submit Another Enquiry
                  </button>
                </motion.div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
