import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Copy, Check, X, ShieldCheck, Clock, Send } from 'lucide-react';
import { PHONE_NUMBER, PHONE_RAW } from '../types';
import { submitEnquiryRecord } from '../lib/supabase';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CallModal({ isOpen, onClose }: CallModalProps) {
  const [copied, setCopied] = useState(false);
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PHONE_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectCallClick = () => {
    // Record direct call intent into enquiries
    submitEnquiryRecord({
      type: 'phone_call',
      source: 'Call Modal Direct Call Button',
      message: `User clicked direct helpline dial: ${PHONE_NUMBER}`,
    }).catch(() => {});
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim() || !candidateName.trim()) return;

    setIsSubmitting(true);

    try {
      // 1. Submit to database / Admin enquiries
      await submitEnquiryRecord({
        type: 'callback_request',
        name: candidateName.trim(),
        phone: phoneInput.trim(),
        source: 'Call Modal Quick Callback Form',
        message: 'Requested immediate phone callback from matrimony consultant',
      });

      // 2. Also open WhatsApp for instant transmission
      try {
        const textMessage = `Hello Vivaaha Connect,\n\nI would like to request a quick callback:\n\n• Name: ${candidateName}\n• Phone: ${phoneInput}`;
        const whatsappUrl = `https://wa.me/919486955380?text=${encodeURIComponent(textMessage)}`;
        window.open(whatsappUrl, '_blank');
      } catch {}

      setCallbackRequested(true);
    } catch (err) {
      console.error('Callback error:', err);
      setCallbackRequested(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setCallbackRequested(false);
    setCandidateName('');
    setPhoneInput('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-[#C89B63]/30 p-5 sm:p-7 shadow-2xl box-border"
          >
            {/* Close button */}
            <button
              onClick={resetAndClose}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full text-[#6A1E2C]/70 hover:text-[#6A1E2C] hover:bg-[#F8E8DA]/50 transition z-10"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pr-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-[#6A1E2C] text-[#FFF9F5] flex items-center justify-center shadow-lg shadow-[#6A1E2C]/20">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-heading font-bold text-[#6A1E2C] leading-snug">
                  Call Vivaaha Connect
                </h3>
                <p className="text-xs text-[#222222]/70">
                  Coimbatore Matrimony Desk
                </p>
              </div>
            </div>

            {!callbackRequested ? (
              <div className="space-y-5">
                <p className="text-sm text-[#222222]/80 leading-relaxed">
                  Speak directly with our experienced matrimony consultants for profile guidance, consultation, or registration help.
                </p>

                {/* Number card */}
                <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#C89B63]/30 flex items-center justify-between shadow-inner">
                  <div>
                    <span className="text-xs text-[#C89B63] font-semibold uppercase tracking-wider block">
                      Direct Helpline
                    </span>
                    <span className="text-xl font-bold text-[#6A1E2C] tracking-wide">
                      {PHONE_NUMBER}
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[#6A1E2C]/10 text-[#6A1E2C] hover:bg-[#6A1E2C] hover:text-white transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>

                {/* Immediate Call CTA */}
                <a
                  href={`tel:${PHONE_RAW}`}
                  onClick={handleDirectCallClick}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#6A1E2C] via-[#8C283B] to-[#6A1E2C] text-white font-semibold shadow-xl shadow-[#6A1E2C]/25 hover:brightness-110 active:scale-[0.99] transition"
                >
                  <Phone className="w-4 h-4 animate-bounce" /> Call {PHONE_NUMBER}
                </a>

                {/* Divider */}
                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#C89B63]/20" />
                  </div>
                  <span className="relative bg-white px-3 text-xs text-[#C89B63] font-medium uppercase tracking-widest">
                    OR Request Quick Callback
                  </span>
                </div>

                {/* Quick Callback Form */}
                <form onSubmit={handleCallbackSubmit} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#C89B63]/30 bg-[#FFF9F5]/50 text-sm focus:outline-none focus:border-[#6A1E2C] transition"
                  />
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="tel"
                      required
                      placeholder="Phone / WhatsApp Number"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-[#C89B63]/30 bg-[#FFF9F5]/50 text-sm focus:outline-none focus:border-[#6A1E2C] transition min-w-0"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#C89B63] hover:bg-[#b0844d] text-white font-semibold text-sm flex items-center justify-center gap-1.5 transition shrink-0 active:scale-[0.98] cursor-pointer disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Request
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="flex items-center justify-between text-xs text-[#222222]/60 pt-2 border-t border-[#C89B63]/10">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C89B63]" /> 9:00 AM - 8:00 PM IST
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Confidential
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-heading font-bold text-[#6A1E2C]">
                  Callback Requested!
                </h4>
                <p className="text-sm text-[#222222]/80 leading-relaxed max-w-xs mx-auto">
                  Thank you{candidateName ? `, ${candidateName}` : ''}! Our matrimony consultant will call you shortly at <strong className="text-[#6A1E2C]">{phoneInput}</strong>.
                </p>
                <button
                  onClick={resetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-[#6A1E2C] text-white text-sm font-semibold hover:bg-[#8C283B] transition"
                >
                  Close Window
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
