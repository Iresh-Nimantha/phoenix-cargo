import { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AnalyticsDashboard from '../../components/admin/AnalyticsDashboard';
import UsersManager from '../../components/admin/UsersManager';
import QuoteRequestsManager from '../../components/admin/QuoteRequestsManager';
import ContactMessagesManager from '../../components/admin/ContactMessagesManager';
import ContentEditor from '../../components/admin/ContentEditor';
import MediaManager from '../../components/admin/MediaManager';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../../context/SettingsContext';
import {
  Globe,
  Info,
  ShipWheel,
  Factory,
  ShieldCheck,
  MapPin,
  Phone,
  MessageSquare as FooterIcon,
  Navigation,
  Truck,
  Bot,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';

// Each section maps to a Firestore document in the 'content' collection
interface ContentSection {
  name: string;
  icon: LucideIcon;
  description: string;
  schema: Record<string, 'string' | 'text' | 'url' | 'boolean' | 'url-list'>;
  initial: Record<string, any>;
}

const contentSections: ContentSection[] = [
  {
    name: 'Hero',
    icon: Globe,
    description: 'Main hero banner — title text, subtitle, background media list, dark overlay toggle',
    schema: {
      title: 'string',
      subtitle: 'text',
      ctaText: 'string',
      trackText: 'string',
      scrollText: 'string',
      backgroundVideoUrl: 'url-list',
      backgroundPosterUrl: 'url',
      useDarkOverlay: 'boolean',
    },
    initial: {
      title: 'PRECISION DELIVERY',
      subtitle: 'Your trusted partner in global freight forwarding and Alliance Freight (Pvt) Ltd solutions.',
      ctaText: 'Get a Quote',
      trackText: 'Track Shipment',
      scrollText: 'Scroll',
      backgroundVideoUrl: [
        'https://assets.mixkit.co/videos/20179/20179-720.mp4',
        'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/bg.jpg'
      ],
      backgroundPosterUrl: '',
      useDarkOverlay: true,
    },
  },
  {
    name: 'About',
    icon: Info,
    description: 'About Alliance Freight — company description, stats, images',
    schema: {
      sectionTitle: 'string',
      description1: 'text',
      description2: 'text',
      stat1Label: 'string',
      stat1Value: 'string',
      stat2Label: 'string',
      stat2Value: 'string',
      stat3Label: 'string',
      stat3Value: 'string',
      feature1Title: 'string',
      feature1Description: 'text',
      feature2Title: 'string',
      feature2Description: 'text',
      feature3Title: 'string',
      feature3Description: 'text',
      aboutImageUrl: 'url',
      backgroundImageUrl: 'url',
    },
    initial: {
      sectionTitle: 'ABOUT ALLIANCE FREIGHT',
      description1: 'Alliance Freight (Pvt) Ltd is a professional freight forwarding company that provides unique shipping and cargo solutions.',
      description2: 'Alliance Freight (Pvt) Ltd was built on a custom history of freight forwarding and shipping solutions. The strength of our expertise denies the professional freight clouds for any company, built with a strong shipping network and a system designed to ensure operations with local presence. We enhance a grand concentration on global networks and trading with professional empowerment.',
      stat1Label: 'Global Partners',
      stat1Value: '5000',
      stat2Label: 'Shipping Routes',
      stat2Value: '25',
      stat3Label: 'Yearly Shipments',
      stat3Value: '1000000',
      feature1Title: 'Global Reach',
      feature1Description: 'Global reach, effective conservation, connecting production cost movements.',
      feature2Title: 'Advanced Tracking',
      feature2Description: 'Advanced tracking, access to status, checkout and constant tracking.',
      feature3Title: 'Custom Solutions',
      feature3Description: 'Custom solutions, expert sort level for trading and transport solutions.',
      aboutImageUrl: 'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/about.png',
      backgroundImageUrl: 'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/bg.jpg',
    },
  },
  {
    name: 'Services',
    icon: ShipWheel,
    description: 'Services section — title, description, backgrounds, and individual service cards',
    schema: {
      sectionTitle: 'string',
      sectionDescription: 'text',
      backgroundImageUrl: 'url',
      service1Title: 'string',
      service1Items: 'text',
      service1Image: 'url',
      service2Title: 'string',
      service2Items: 'text',
      service2Image: 'url',
      service3Title: 'string',
      service3Items: 'text',
      service3Image: 'url',
      service4Title: 'string',
      service4Items: 'text',
      service4Image: 'url',
      service5Title: 'string',
      service5Items: 'text',
      service5Image: 'url',
      service6Title: 'string',
      service6Items: 'text',
      service6Image: 'url',
      service7Title: 'string',
      service7Items: 'text',
      service7Image: 'url',
      service8Title: 'string',
      service8Items: 'text',
      service8Image: 'url',
    },
    initial: {
      sectionTitle: 'OUR SERVICES',
      sectionDescription: 'Alliance Freight (Pvt) Ltd offers a complete range of freight forwarding services designed to support global trade and supply chain efficiency.',
      backgroundImageUrl: 'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/bg.jpg',
      service1Title: 'SEA FREIGHT (FCL / LCL)',
      service1Items: 'FCL (Full Container Load)\nLCL (Less Than Container Load)\nPort-to-Port & Door-to-Door',
      service1Image: '',
      service2Title: 'AIR FREIGHT',
      service2Items: 'Express shipments\nHigh-value cargo handling\nGlobal delivery solutions',
      service2Image: '',
      service3Title: 'ROAD & RAIL FREIGHT',
      service3Items: 'Integrated Road & Rail\nFlexible Multi-Modal Routing\nEfficient Overland Transport',
      service3Image: '',
      service4Title: 'CUSTOMS CLEARANCE',
      service4Items: 'Customs Declarations\nHS Code Classification\nCompliance Coordination',
      service4Image: '',
      service5Title: 'COURIER & EXPRESS CARGO',
      service5Items: 'International Document Delivery\nUrgent Parcel Delivery\nFast, Door-to-Door Service',
      service5Image: '',
      service6Title: 'PROJECT CARGO HANDLING',
      service6Items: 'Heavy Lift & OOG Cargo\nCustom Freight Planning\nSite Inspection & Surveys\nEquipment Management\nEnd-to-End Tracking',
      service6Image: '',
      service7Title: 'PHARMACEUTICAL CARGO HANDLING',
      service7Items: 'Strict Temperature Controls\nCompliant with Standards\nSpecialized Handling Protocols\nPharma Facility Access',
      service7Image: '',
      service8Title: 'HAZARDOUS CARGO HANDLING',
      service8Items: 'Safe & Compliant Handling\nRegulations Adherence (IMDG, IATA)\nHazard Containerization\nDocumentation & Declarations',
      service8Image: '',
    },
  },
  {
    name: 'Industries',
    icon: Factory,
    description: 'Industries We Serve — list of industries, background, illustrations',
    schema: {
      sectionTitle: 'string',
      sectionDescription: 'text',
      industries: 'text',
      footerNote: 'text',
      backgroundImageUrl: 'url',
      mapImageUrl: 'url',
      shipImageUrl: 'url',
    },
    initial: {
      sectionTitle: 'INDUSTRIES WE SERVE',
      sectionDescription: 'Alliance Freight (Pvt) Ltd supports a wide range of industries with customized shipping and freight forwarding solutions.',
      industries: 'Importers & Exporters\nApparel & Textile Industry\nManufacturing & Industrial Suppliers\nConstruction & Engineering Projects\nFMCG & Food Products\nPharmaceutical & Healthcare\nE-commerce & Retail Businesses',
      footerNote: 'Our flexible freight solutions allow businesses to expand their global trade operations with confidence.',
      backgroundImageUrl: 'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/bg.jpg',
      mapImageUrl: 'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/map.png',
      shipImageUrl: 'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/ship.png',
    },
  },
  {
    name: 'WhyChoose',
    icon: ShieldCheck,
    description: 'Why Choose Alliance Freight — strengths, background',
    schema: {
      sectionTitle: 'string',
      sectionDescription: 'text',
      ctaMessage: 'text',
      backgroundImageUrl: 'url',
      strength1: 'string',
      strength2: 'string',
      strength3: 'string',
      strength4: 'string',
      strength5: 'string',
      strength6: 'string',
      strength7: 'string',
      strength8: 'string',
    },
    initial: {
      sectionTitle: 'WHY CHOOSE ALLIANCE FREIGHT',
      sectionDescription: 'In freight forwarding, performance matters. Alliance Freight (Pvt) Ltd is committed to delivering professional shipping and cargo solutions.',
      ctaMessage: 'Alliance Freight (Pvt) Ltd is not just a service provider — we are your long-term shipping and freight forwarding partner.',
      backgroundImageUrl: 'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/bg.jpg',
      strength1: 'Export, Import & Cross Trading Expertise',
      strength2: 'Sea Freight, Air Freight, Courier, Road & Rail Options',
      strength3: 'Strong Worldwide Agent Network',
      strength4: 'Competitive Freight Rates & Reliable Carriers',
      strength5: 'Specialized Handling (Project / Pharmaceutical / Hazardous Cargo)',
      strength6: 'Fast Import & Export Customs Clearance',
      strength7: 'Well-Educated, Experienced Operations Team',
      strength8: '24 Hours Customer Service & Shipment Updates',
    },
  },
  {
    name: 'Tracking',
    icon: Navigation,
    description: 'Tracking section — title, description, background, feature badges',
    schema: {
      sectionTitle: 'string',
      sectionDescription: 'text',
      backgroundImageUrl: 'url',
      badge1: 'string',
      badge2: 'string',
      badge3: 'string',
      ctaText: 'string',
      bottomText: 'string',
    },
    initial: {
      sectionTitle: 'TRACK YOUR SHIPMENT & GET SUPPORT',
      sectionDescription: 'Real-time tracking updates and 24/7 professional assistance for all your cargo needs.',
      backgroundImageUrl: 'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/bg.jpg',
      badge1: 'Real-Time Updates',
      badge2: '24/7 Coordination',
      badge3: 'Secure Information',
      ctaText: 'TRACK & SUPPORT',
      bottomText: 'Join 1m+ yearly shipments tracked with confidence',
    },
  },
  {
    name: 'Contact',
    icon: Phone,
    description: 'Contact section — address, phone numbers, email, background',
    schema: {
      sectionTitle: 'string',
      sectionDescription: 'text',
      address: 'string',
      phone1: 'string',
      phone2: 'string',
      email: 'string',
      supportHours: 'string',
      mapEmbedUrl: 'url',
      googleMapsLink: 'url',
      backgroundImageUrl: 'url',
      directionsText: 'string',
      telephoneTitle: 'string',
      telephoneSubtitle: 'string',
      emailTitle: 'string',
      emailSubtitle: 'string',
      supportNote: 'string',
      formTitle: 'string',
      formNamePlaceholder: 'string',
      formEmailPlaceholder: 'string',
      formSubjectPlaceholder: 'string',
      formMessagePlaceholder: 'string',
      formSubmitText: 'string',
      successTitle: 'string',
      successMessage: 'string',
      successButtonText: 'string',
    },
    initial: {
      sectionTitle: 'Get in touch with Alliance Freight',
      sectionDescription: 'Our dedicated team is ready to assist you with professional freight forwarding and shipping solutions worldwide.',
      address: 'No. 77, Sri Medhananda Mawatha, Moratuwa, Sri Lanka',
      phone1: '070 644 0992',
      phone2: '076 736 7280',
      email: 'imports@alliancefreightcmb.com',
      supportHours: '24/7',
      mapEmbedUrl: '',
      googleMapsLink: '',
      backgroundImageUrl: 'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/bg.jpg',
      directionsText: 'Directions',
      telephoneTitle: 'Telephone',
      telephoneSubtitle: 'Call us anytime',
      emailTitle: 'Email',
      emailSubtitle: 'Response within 4 hours',
      supportNote: 'Always available for your shipping and cargo needs',
      formTitle: 'Send us a Message',
      formNamePlaceholder: 'Your Name',
      formEmailPlaceholder: 'Your Email',
      formSubjectPlaceholder: 'Subject',
      formMessagePlaceholder: 'Your Message',
      formSubmitText: 'Send Message',
      successTitle: 'Message Sent!',
      successMessage: "We'll get back to you within 4 business hours.",
      successButtonText: 'Send Another Message',
    },
  },
  {
    name: 'Footer',
    icon: FooterIcon,
    description: 'Footer — copyright, social links, brand description',
    schema: {
      brandDescription: 'text',
      copyright: 'string',
      facebookUrl: 'url',
      linkedinUrl: 'url',
      twitterUrl: 'url',
      instagramUrl: 'url',
      quickLinksTitle: 'string',
      contactInfoTitle: 'string',
      supportHoursText: 'string',
      connectTitle: 'string',
      newsletterTitle: 'string',
      newsletterPlaceholder: 'string',
      newsletterButtonText: 'string',
      newsletterSubscribingText: 'string',
    },
    initial: {
      brandDescription: 'Alliance Freight (Pvt) Ltd delivers end-to-end supply chain solutions, specializing in ocean freight, air cargo, road transport, and warehousing across the globe.',
      copyright: '2026 Alliance Freight (Pvt) Ltd. All rights reserved.',
      facebookUrl: '',
      linkedinUrl: '',
      twitterUrl: '',
      instagramUrl: '',
      quickLinksTitle: 'Quick Links',
      contactInfoTitle: 'Contact Information',
      supportHoursText: '24/7 Support',
      connectTitle: 'Connect With Us',
      newsletterTitle: 'Newsletter Signup',
      newsletterPlaceholder: 'Enter Your Email',
      newsletterButtonText: 'Subscribe',
      newsletterSubscribingText: 'Subscribing...',
    },
  },
  {
    name: 'Chatbot',
    icon: Bot,
    description: 'Chatbot Settings — customize AI assistant name and prompt persona',
    schema: {
      botName: 'string',
      persona: 'text',
    },
    initial: {
      botName: 'Alliance Assistant',
      persona: `You are "Alliance Assistant", the official friendly customer support AI bot for Alliance Freight (Pvt) Ltd.
Provide professional, polite, and accurate freight forwarding answers. Keep answers brief (1-3 sentences max) to fit inside a small chat window.

Core Company Information:
- Address: No. 77, Sri Medhananda Mawatha, Moratuwa, Sri Lanka.
- Phone Support: 070 644 0992 | 076 736 7280.
- Email Support: imports@alliancefreightcmb.com.
- Core Services: Air Freight, Sea Freight (FCL/LCL), Road & Rail Freight, Customs Clearance & Brokerage.
- Specialized Cargo Handling:
  * Project Cargo: Heavy lift, Out of Gauge (OOG) shipping, custom industrial routes.
  * Pharmaceutical Cargo: Cold-chain solutions, strict temperature control, medical grade.
  * Hazardous Cargo: Dangerous goods class 1-9 handling, compliance certification.
- 24/7 Operations: We run constant tracking and dispatch support.

If asked about tracking, guide the user to the "/tracking" page.
If asked about rates or quote requests, guide the user to click the "Get a Quote" button on the website.
Do not invent facts or promise exact delivery rates without verification. Always remain polite and elite.`,
    },
  },
  {
    name: 'Settings',
    icon: Globe,
    description: 'Global settings — company logo and active seasonal particle effects (christmas, winter, autumn, none)',
    schema: {
      logoUrl: 'url',
      activeSeasonalEffect: 'string',
    },
    initial: {
      logoUrl: 'https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/logonogb.png',
      activeSeasonalEffect: 'none',
    },
  },
];

export default function AdminDashboard() {
  const { logoUrl } = useSettings();
  const [activeTab, setActiveTab] = useState('analytics');
  const [activeContentSection, setActiveContentSection] = useState(0);

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'users':
        return <UsersManager />;
      case 'quotes':
        return <QuoteRequestsManager />;
      case 'messages':
        return <ContactMessagesManager />;
      case 'content':
        return (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Website Content Editor</h2>
            <p className="text-gray-500 text-sm mb-6">
              Edit all website sections. Changes are saved to Firestore and reflected in real-time.
            </p>

            {/* Responsive section selector */}
            <div className="block md:hidden mb-6">
              <label className="block text-xs font-black uppercase text-[#0B2545]/60 tracking-widest mb-2">
                Active Section
              </label>
              <select
                value={activeContentSection}
                onChange={(e) => setActiveContentSection(Number(e.target.value))}
                className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 font-bold text-gray-700 text-sm shadow-sm"
              >
                {contentSections.map((section, i) => (
                  <option key={section.name} value={i}>
                    {section.name} Section
                  </option>
                ))}
              </select>
            </div>

            {/* Section navigation cards (desktop only) */}
            <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {contentSections.map((section, i) => {
                const Icon = section.icon;
                const isActive = activeContentSection === i;
                return (
                  <motion.button
                    key={section.name}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ y: -2 }}
                    onClick={() => setActiveContentSection(i)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'bg-[#0B2545] text-white border-[#0B2545] shadow-lg shadow-[#0B2545]/20'
                        : 'bg-white text-gray-700 border-gray-100 hover:border-cyan-200 hover:shadow-md'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isActive ? 'text-cyan-300' : 'text-cyan-600'}`} />
                    <p className="font-bold text-sm">{section.name}</p>
                    <p className={`text-[11px] mt-0.5 line-clamp-2 ${isActive ? 'text-white/60' : 'text-gray-400'}`}>
                      {section.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>

            {/* Active section editor */}
            <AnimatePresence mode="wait">
              <motion.div
                key={contentSections[activeContentSection].name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white p-5 sm:p-8 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  {(() => {
                    const Icon = contentSections[activeContentSection].icon;
                    return <Icon className="w-6 h-6 text-cyan-600" />;
                  })()}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {contentSections[activeContentSection].name} Section
                    </h3>
                    <p className="text-xs text-gray-400">
                      {contentSections[activeContentSection].description}
                    </p>
                  </div>
                </div>
                <ContentEditor
                  key={contentSections[activeContentSection].name}
                  sectionId={contentSections[activeContentSection].name.toLowerCase().replace(/\s+/g, '')}
                  schema={contentSections[activeContentSection].schema}
                  initialData={contentSections[activeContentSection].initial}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        );
      case 'media':
        return <MediaManager />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden relative">
      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar Container */}
      <div className={`fixed md:relative md:flex z-50 transition-transform duration-300 h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <AdminSidebar activeTab={activeTab} onTabChange={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false); // Auto close sidebar on mobile viewport select
        }} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden h-full">
        {/* Mobile Header Bar */}
        <header className="md:hidden bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-30 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <img
              src={logoUrl}
              alt="Logo"
              className="h-7 w-auto"
            />
            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Admin</span>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-8 overflow-y-auto h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
