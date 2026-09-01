import { useState, useEffect } from 'react';
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
import RegistrationPage from './components/RegistrationPage';
import AdminPortal from './components/AdminPortal';
import { AppPage, getPageFromPath, navigateToPage } from './utils/navigation';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>(() => getPageFromPath(window.location.pathname));
  const [callModalOpen, setCallModalOpen] = useState(false);

  useEffect(() => {
    const handleNavigationEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ page: AppPage; sectionId?: string }>;
      if (customEvent.detail && customEvent.detail.page) {
        setCurrentPage(customEvent.detail.page);
      }
    };

    const handlePopState = () => {
      setCurrentPage(getPageFromPath(window.location.pathname));
    };

    window.addEventListener('app-navigation', handleNavigationEvent);
    window.addEventListener('popstate', handlePopState);

    // Initial scroll check if loaded with /registration path
    const initialPath = window.location.pathname.toLowerCase().replace(/\/$/, '');
    if (initialPath === '/registration' || initialPath === '/register' || initialPath === '/testing') {
      setTimeout(() => {
        const el = document.getElementById('registration');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }

    return () => {
      window.removeEventListener('app-navigation', handleNavigationEvent);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleOpenCallModal = () => {
    setCallModalOpen(true);
  };

  const handleCloseCallModal = () => {
    setCallModalOpen(false);
  };

  const handleBackToHome = () => {
    navigateToPage('home');
  };

  if (currentPage === 'admin') {
    return (
      <div className="relative min-h-screen bg-[#FFF9F5] text-[#222222] font-sans selection:bg-[#C89B63]/30 selection:text-[#6A1E2C]">
        <AdminPortal onBackToWebsite={handleBackToHome} />
      </div>
    );
  }

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

      {/* Top Navbar */}
      <Navbar onOpenCallModal={handleOpenCallModal} />

      {/* Conditional View: Registration Page vs Home Landing Page */}
      {currentPage === 'registration' ? (
        <main className="relative z-10 pt-20 pb-16">
          <RegistrationPage
            onBackToHome={handleBackToHome}
            onOpenCallModal={handleOpenCallModal}
          />
        </main>
      ) : (
        <main className="relative z-10 pb-16 sm:pb-0">
          <Hero onOpenCallModal={handleOpenCallModal} />
          <AboutSection />
          <WhyChooseUs />
          <ServicesSection onOpenCallModal={handleOpenCallModal} />
          <RegistrationProcess />
          <section id="registration" className="scroll-mt-20">
            <RegistrationPage
              embedded={true}
              onBackToHome={handleBackToHome}
              onOpenCallModal={handleOpenCallModal}
            />
          </section>
          <FeaturesSection />
          {/* <StatisticsSection /> */}
          <TestimonialsSection />
          <FAQSection onOpenCallModal={handleOpenCallModal} />
          <FinalCTA onOpenCallModal={handleOpenCallModal} />
          <ContactSection />
        </main>
      )}

      {/* Footer */}
      <Footer />

      {/* Always Visible Bottom Floating Action Buttons */}
      <FloatingActions onOpenCallModal={handleOpenCallModal} />
    </div>
  );
}

