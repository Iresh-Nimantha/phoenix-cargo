import Header from '../components/Header';
import Hero from '../components/Hero';
import TickerRibbon from '../components/TickerRibbon';
import ServicesSection from '../components/ServicesSection';
import AboutSection from '../components/AboutSection';
import CtaBand from '../components/CtaBand';
import WhyChooseSection from '../components/WhyChooseSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import { useScrollReveal } from '../utils/useScrollReveal';

export default function Home() {
  useScrollReveal();

  return (
    <div className="bg-ash-900 text-ash-100 min-h-screen selection:bg-fire-orange selection:text-white overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <TickerRibbon />
        <ServicesSection />
        <AboutSection />
        <CtaBand />
        <WhyChooseSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
