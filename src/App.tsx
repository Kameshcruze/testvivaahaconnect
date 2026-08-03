import { useState } from 'react';
import Preloader from './components/Preloader';
import CursorGlow from './components/CursorGlow';
import FloralParticles from './components/FloralParticles';
import CallModal from './components/CallModal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import WhyChooseUs from './components/WhyChooseUs';
import ServicesSection from './components/ServicesSection';
import RegistrationProcess from './components/RegistrationProcess';
import FeaturesSection from './components/FeaturesSection';
import StatisticsSection from './components/StatisticsSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import FinalCTA from './components/FinalCTA';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';

export default function App() {
  const [callModalOpen, setCallModalOpen] = useState(false);

  const handleOpenCallModal = () => {
    setCallModalOpen(true);
  };

  const handleCloseCallModal = () => {
    setCallModalOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#FFF9F5] text-[#222222] font-sans selection:bg-[#C89B63]/30 selection:text-[#6A1E2C] overflow-x-hidden">
      {/* Preloader */}
      <Preloader />

      {/* Mouse Follow Glow */}
      <CursorGlow />

      {/* Floating Canvas Particles */}
      <FloralParticles />

      {/* Interactive Call Helpline Modal */}
      <CallModal isOpen={callModalOpen} onClose={handleCloseCallModal} />

      {/* Navbar */}
      <Navbar onOpenCallModal={handleOpenCallModal} />

      {/* Main Page Content */}
      <main className="relative z-10 pb-16 sm:pb-0">
        <Hero onOpenCallModal={handleOpenCallModal} />
        <AboutSection />
        <WhyChooseUs />
        <ServicesSection onOpenCallModal={handleOpenCallModal} />
        <RegistrationProcess />
        <FeaturesSection />
        <StatisticsSection />
        <TestimonialsSection />
        <FAQSection onOpenCallModal={handleOpenCallModal} />
        <FinalCTA onOpenCallModal={handleOpenCallModal} />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Always Visible Bottom Floating Action Buttons */}
      <FloatingActions onOpenCallModal={handleOpenCallModal} />
    </div>
  );
}
