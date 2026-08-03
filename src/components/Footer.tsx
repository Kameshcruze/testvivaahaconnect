import React, { useState } from 'react';
import { Heart, ExternalLink, Phone, Mail, MapPin, ShieldCheck, ArrowUp } from 'lucide-react';
import { GOOGLE_FORM_URL, PHONE_NUMBER, EMAIL_ADDRESS, LOCATION_ADDRESS } from '../types';

export default function Footer() {
  const [modalOpen, setModalOpen] = useState<'privacy' | 'terms' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#2D0A11] text-[#FAF3EB] pt-16 pb-12 border-t border-[#C89B63]/20 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-[#C89B63]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#C89B63]/15">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#6A1E2C] border border-[#C89B63]/40 flex items-center justify-center text-[#C89B63] shadow-md">
                <Heart className="w-5 h-5 fill-[#C89B63]" />
              </div>
              <div>
                <span className="text-2xl font-heading font-bold text-[#FFF9F5] tracking-tight">
                  Vivaaha <span className="text-[#C89B63]">Connect</span>
                </span>
                <p className="text-[10px] text-[#C89B63] font-medium tracking-wider uppercase">
                  Connecting Hearts • Building Families
                </p>
              </div>
            </div>

            <p className="text-xs text-[#FAF3EB]/70 leading-relaxed">
              Vivaaha Connect is a trusted matrimony service helping brides and grooms from all communities across Tamil Nadu and India connect with genuine life partners through authentic profile verification, complete privacy, and friendly assistance.
            </p>

            <p className="text-xs font-tamil text-[#C89B63]">
              தமிழ்நாடு மற்றும் இந்தியா முழுவதுமுள்ள அனைத்து சமுதாயத்தினருக்குமான திருமணச் சேவை
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-heading font-bold text-[#C89B63] uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[#FAF3EB]/80">
              <li>
                <a href="#home" className="hover:text-[#C89B63] transition">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#C89B63] transition">About Vivaaha Connect</a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#C89B63] transition">Matrimony Services</a>
              </li>
              <li>
                <a href="#why-choose-us" className="hover:text-[#C89B63] transition">Why Choose Us</a>
              </li>
              <li>
                <a href="#registration" className="hover:text-[#C89B63] transition">Registration Process</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#C89B63] transition">Contact & Helpline</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Registration & Legal */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-heading font-bold text-[#C89B63] uppercase tracking-wider">
              Registration
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[#FAF3EB]/80">
              <li>
                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#C89B63] transition"
                >
                  Bride Registration <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#C89B63] transition"
                >
                  Groom Registration <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="pt-2 border-t border-[#C89B63]/15">
                <button
                  onClick={() => setModalOpen('privacy')}
                  className="hover:text-[#C89B63] transition text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalOpen('terms')}
                  className="hover:text-[#C89B63] transition text-left"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-heading font-bold text-[#C89B63] uppercase tracking-wider">
              Helpline Desk
            </h4>
            <div className="space-y-2 text-xs text-[#FAF3EB]/80">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C89B63] shrink-0" />
                <span>{LOCATION_ADDRESS}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C89B63] shrink-0" />
                <a href={`tel:${PHONE_NUMBER}`} className="hover:text-[#C89B63] transition font-bold">
                  {PHONE_NUMBER}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C89B63] shrink-0" />
                <a href={`mailto:${EMAIL_ADDRESS}`} className="hover:text-[#C89B63] transition">
                  {EMAIL_ADDRESS}
                </a>
              </p>
            </div>

            <div className="pt-2">
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#C89B63] text-[#2D0A11] font-bold text-xs hover:bg-[#d8a870] transition"
              >
                Online Registration Form <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF3EB]/60">
          <p>© {new Date().getFullYear()} Vivaaha Connect. All rights reserved. Connecting Hearts • Building Families.</p>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#C89B63]">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Secure & Confidential
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white/10 hover:bg-[#C89B63] hover:text-[#2D0A11] transition text-[#FFF9F5]"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm text-[#222222]">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-heading font-bold text-[#6A1E2C]">
              {modalOpen === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
            </h3>
            <p className="text-xs text-[#222222]/80 leading-relaxed space-y-2">
              {modalOpen === 'privacy' ? (
                <>
                  Vivaaha Connect is committed to preserving candidate confidentiality. Contact numbers, addresses, and full profile documentation are shared solely with verified prospective matches after explicit mutual family approval. We do not sell or publish user data on open public directories.
                </>
              ) : (
                <>
                  By registering with Vivaaha Connect, candidates and family members certify that all profile details provided in the registration form are accurate and submitted in good faith for marriage purpose only. Misrepresentation or fraudulent profiles will result in immediate disqualification.
                </>
              )}
            </p>
            <button
              onClick={() => setModalOpen(null)}
              className="px-5 py-2.5 rounded-xl bg-[#6A1E2C] text-white text-xs font-bold hover:bg-[#8C283B] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
