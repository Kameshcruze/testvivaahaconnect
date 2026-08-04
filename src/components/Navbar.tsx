import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { Heart, Menu, X, ArrowRight, Phone } from 'lucide-react';
import { GOOGLE_FORM_URL, PHONE_NUMBER } from '../types';
import logoImg from '../assets/images/Logo1.PNG';

interface NavbarProps {
  onOpenCallModal: () => void;
}

export default function Navbar({ onOpenCallModal }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Track active section
      const sections = ['home', 'about', 'services', 'registration', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Services', href: '#services', id: 'services' },
    { name: 'Registration', href: '#registration', id: 'registration' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none px-3 sm:px-6 pt-3 sm:pt-4">
      {/* Top Scroll Progress Indicator */}
      <motion.div
        style={{ scaleX }}
        className="h-1 bg-gradient-to-r from-[#6A1E2C] via-[#C89B63] to-[#8C283B] origin-left fixed top-0 left-0 right-0 z-50 pointer-events-none"
      />

      {/* Floating Centered Glassmorphism Container */}
      <div className="max-w-[1400px] mx-auto pointer-events-auto">
        <nav
          className={`w-full rounded-2xl sm:rounded-3xl transition-all duration-300 border h-[72px] sm:h-[80px] px-4 sm:px-6 flex items-center justify-between ${
            isScrolled
              ? 'bg-white/95 sm:bg-white/85 backdrop-blur-md border-[#C89B63]/30 shadow-xl shadow-[#6A1E2C]/10'
              : 'bg-white/90 sm:bg-white/70 backdrop-blur-md border-white/60 shadow-lg shadow-[#6A1E2C]/5'
          }`}
        >
          {/* Left Side: Logo Image */}
          <a href="#home" className="flex items-center group shrink-0 py-1">
            <img
              src={logoImg}
              alt="Vivaaha Connect"
              className="h-10 sm:h-12 w-auto max-h-[52px] object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </a>

          {/* Center Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 bg-[#6A1E2C]/5 p-1.5 rounded-full border border-[#C89B63]/15">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 rounded-full ${
                    isActive
                      ? 'text-[#6A1E2C] font-bold'
                      : 'text-[#222222]/75 hover:text-[#6A1E2C] hover:bg-[#6A1E2C]/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBg"
                      className="absolute inset-0 bg-white shadow-sm border border-[#C89B63]/30 rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Right Side Action Buttons */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Outline Call Us Button */}
            <button
              onClick={onOpenCallModal}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border border-[#C89B63]/50 text-[#6A1E2C] font-semibold text-xs sm:text-xs bg-white/60 hover:bg-[#6A1E2C] hover:text-white hover:border-[#6A1E2C] transition-all duration-300 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-[#C89B63] group-hover:text-white" />
              <span>Call Us</span>
              <span className="font-bold text-[#6A1E2C] group-hover:text-white">{PHONE_NUMBER}</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenCallModal}
              className="p-2.5 rounded-xl bg-[#6A1E2C]/10 text-[#6A1E2C] hover:bg-[#6A1E2C] hover:text-white transition"
              aria-label="Call Helpline"
            >
              <Phone className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#6A1E2C] text-white hover:bg-[#8C283B] transition shadow-md"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Animated Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 p-5 rounded-3xl bg-white/98 backdrop-blur-md border border-[#C89B63]/30 shadow-2xl shadow-[#6A1E2C]/15 space-y-4"
            >
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-2xl text-sm font-semibold text-[#222222] hover:bg-[#6A1E2C]/10 hover:text-[#6A1E2C] transition flex items-center justify-between"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 text-[#C89B63]" />
                  </a>
                ))}
              </div>

              <div className="pt-3 border-t border-[#C89B63]/20 flex flex-col gap-2.5">
                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#6A1E2C] to-[#8C283B] text-white text-center font-bold text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-4 h-4 text-[#C89B63]" />
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCallModal();
                  }}
                  className="w-full py-3 rounded-2xl border border-[#6A1E2C] text-[#6A1E2C] text-center font-bold text-sm hover:bg-[#6A1E2C]/5 transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#C89B63]" />
                  <span>Call Us {PHONE_NUMBER}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
