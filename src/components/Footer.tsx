import React, { useState } from 'react';
import { Heart, ExternalLink, Phone, MapPin, ArrowUp } from 'lucide-react';
import { GOOGLE_FORM_URL, PHONE_NUMBER, HO_ADDRESS, BRANCH_ADDRESS } from '../types';
import logoImg from '../assets/images/Logo1.PNG';

export default function Footer() {
  const [modalOpen, setModalOpen] = useState<'privacy' | 'terms' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#2D0A11] text-[#FAF3EB] pt-10 sm:pt-12 pb-8 sm:pb-10 border-t border-[#C89B63]/20 overflow-hidden">
      {/* Background radial highlight */}
      <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-[#C89B63]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#C89B63]/15">
          
          {/* Col 1: Brand Info */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left md:col-span-2 lg:col-span-4 space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-2.5">
              <img
                src={logoImg}
                alt="Vivaaha Connect"
                className="h-12 w-auto max-w-[200px] object-contain bg-white/95 px-3 py-1.5 rounded-xl border border-[#C89B63]/40 shadow-md"
              />
            </div>

            <p className="text-xs text-[#FAF3EB]/70 leading-relaxed">
              Vivaaha Connect is a trusted matrimonial platform committed to helping individuals find meaningful life partners through verified profiles, secure communication, and personalized matchmaking support. We don't just connect profiles—we connect families for a brighter future.
            </p>

            <p className="text-xs font-tamil text-[#C89B63]">
              தமிழ்நாடு முழுவதுமுள்ள அனைத்து சமூகத்தினருக்குமான நம்பகமான திருமண சேவை
            </p>
          </div>

          {/* Col 2 & 3: Quick Links & Registration side-by-side on mobile & tablet */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:col-span-2 lg:col-span-5">
            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-heading font-bold text-[#C89B63] uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs font-medium text-[#FAF3EB]/80">
                <li>
                  <a href="#home" className="hover:text-[#C89B63] transition">Home</a>
                </li>
                <li>
                  <a href="#about" className="hover:text-[#C89B63] transition">About Us</a>
                </li>
                <li>
                  <a href="#services" className="hover:text-[#C89B63] transition">Services</a>
                </li>
                <li>
                  <a href="#why-choose-us" className="hover:text-[#C89B63] transition">Why Choose Us</a>
                </li>
                <li>
                  <a href="#registration" className="hover:text-[#C89B63] transition">Process</a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#C89B63] transition">Contact</a>
                </li>
              </ul>
            </div>

            {/* Registration */}
            <div className="space-y-3">
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
          </div>

          {/* Col 4: Contact & Location */}
          <div className="md:col-span-2 lg:col-span-3 space-y-3">
            <h4 className="text-sm font-heading font-bold text-[#C89B63] uppercase tracking-wider">
              Helpline Desk
            </h4>
            <div className="space-y-2.5 text-xs text-[#FAF3EB]/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C89B63] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p>
                    <strong className="text-[#C89B63]">Head Office:</strong> {HO_ADDRESS.fullText}
                  </p>
                  <p>
                    <strong className="text-[#C89B63]">Branch:</strong> {BRANCH_ADDRESS.fullText}
                  </p>
                </div>
              </div>
              <p className="flex items-center gap-2 pt-1 border-t border-[#C89B63]/15">
                <Phone className="w-4 h-4 text-[#C89B63] shrink-0" />
                <a href={`tel:${PHONE_NUMBER}`} className="hover:text-[#C89B63] transition font-bold">
                  {PHONE_NUMBER}
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center relative gap-4 text-xs text-[#FAF3EB]/60 text-center">
          <div className="text-center">
            <p>© {new Date().getFullYear()} Vivaaha Connect. All rights reserved.</p>
            <p className="mt-1 text-[11px] text-[#FAF3EB]/50 text-center">
              Developed by{' '}
              <a
                href="https://elitewebdevelopers.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C89B63] hover:underline font-semibold"
              >
                Elite
              </a>
            </p>
          </div>
          
          <div className="sm:absolute sm:right-0 flex items-center gap-4">
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm text-[#222222]">
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
