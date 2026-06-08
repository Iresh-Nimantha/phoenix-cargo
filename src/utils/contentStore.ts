import { SiteContent } from '../types/content';

const STORAGE_KEY = 'phoenix_cargo_content';

export const defaultContent: SiteContent = {
  meta: {
    siteTitle: 'Phoenix Cargo – Your Cargo, Our Commitment',
    metaDescription: 'Phoenix Cargo is Sri Lanka\'s premier cargo clearance and freight forwarding company. BOI cargo, dangerous goods, project cargo, medical cargo, own transport fleet.',
    themeColor: '#e8610a',
  },
  nav: {
    logoAlt: 'Phoenix Cargo',
    links: [
      { label: 'Services', href: '#services' },
      { label: 'About',    href: '#about' },
      { label: 'Why Us',   href: '#why' },
      { label: 'Contact',  href: '#contact' },
    ],
    ctaLabel: 'Get Quote',
    ctaHref: '#contact',
  },
  hero: {
    eyebrow: 'Your Cargo, Our Commitment',
    headingLine1: 'Sri Lanka\'s Premier',
    headingLine2: 'Cargo Clearance',
    headingLine3: '& Freight Partner',
    subtext: 'From BOI cargo to dangerous goods, project freight to medical supplies — Phoenix Cargo delivers end-to-end logistics solutions with unmatched expertise and a commitment to precision.',
    ctaPrimaryLabel: 'Request a Quote →',
    ctaPrimaryHref: '#contact',
    ctaSecondaryLabel: 'Explore Services',
    ctaSecondaryHref: '#services',
    backgroundImageUrl: '',
  },
  stats: {
    items: [
      { number: '15+',   label: 'Years Experience' },
      { number: '5000+', label: 'Shipments / Year'  },
      { number: '99%',   label: 'On-Time Delivery'  },
    ],
  },
  ticker: {
    items: [
      'Cargo Clearance',
      'BOI Cargo Handling',
      'Dangerous Goods',
      'Project Cargo',
      'Medical Cargo',
      'Own Transport Fleet',
      'Air Freight',
      'Sea Freight',
    ],
    speed: 25,
  },
  services: {
    eyebrow: 'What We Do',
    title: 'Comprehensive Cargo',
    titleHighlight: 'Services',
    subtitle: 'Trusted by importers, exporters, and industry leaders across Sri Lanka for specialized freight handling and seamless customs clearance.',
    items: [
      { id: 's1', icon: '🚢', title: 'Cargo Clearance', description: 'Full customs clearance services for imports and exports. Our experienced team handles all documentation, duties, and regulatory compliance with efficiency and precision.', imageUrl: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=600&q=80', visible: true },
      { id: 's2', icon: '⚓', title: 'BOI Cargo Handling', description: 'Specialized handling for Board of Investment cargo, ensuring compliance with BOI regulations and priority processing for export-processing zone enterprises.', imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=80', visible: true },
      { id: 's3', icon: '⚠️', title: 'Dangerous Goods', description: 'Certified IATA/IMDG dangerous goods handling. Our trained specialists manage hazardous cargo — chemicals, flammables, and regulated substances — with strict safety compliance.', imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80', visible: true },
      { id: 's4', icon: '🏗️', title: 'Project Cargo', description: 'Heavy-lift and out-of-gauge shipments for infrastructure, industrial, and construction projects. We plan and execute complex, oversized cargo movements from origin to destination.', imageUrl: 'https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=600&q=80', visible: true },
      { id: 's5', icon: '💊', title: 'Medical & Pharma Cargo', description: 'Temperature-controlled, time-sensitive medical cargo handling with full cold chain integrity. Priority clearance for pharmaceuticals, medical devices, and life-critical shipments.', imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=80', visible: true },
      { id: 's6', icon: '🚛', title: 'Own Transport Fleet', description: 'Our dedicated fleet provides port-to-door delivery, container transport, and last-mile logistics across Sri Lanka — fully owned, fully managed, fully reliable.', imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80', visible: true },
      { id: 's7', icon: '✈️', title: 'Air Freight', description: 'Express and consolidated air freight solutions through Bandaranaike International Airport. Time-critical and high-value shipments handled with speed and care.', imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=600&q=80', visible: true },
      { id: 's8', icon: '🚢', title: 'Sea Freight & FCL/LCL', description: 'Full and less-than-container load sea freight services. We negotiate competitive rates with global carriers and handle all port formalities on your behalf.', imageUrl: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&q=80', visible: true },
      { id: 's9', icon: '📄', title: 'Documentation & Compliance', description: 'Expert preparation of bills of lading, certificates of origin, phytosanitary certificates, and all import/export documentation required by Sri Lanka Customs.', imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80', visible: true },
    ],
  },
  about: {
    eyebrow: 'Who We Are',
    headingLine1: 'Built on Trust,',
    headingLine2: 'Driven by Precision',
    subtext: 'Phoenix Cargo is a full-service freight and logistics company operating at the heart of Sri Lanka\'s trade gateway. We rise where others struggle — complex cargo, sensitive shipments, and time-critical deadlines are where we excel.',
    features: [
      'Licensed customs clearing agents with direct port authority relationships',
      'IATA-certified dangerous goods specialists with full IMDG compliance capability',
      'Own dedicated transport fleet for seamless port-to-door logistics',
      '24/7 shipment tracking and dedicated account management',
      'Specialized BOI liaison ensuring fast-track clearance for investment zone companies',
    ],
    ctaLabel: 'Get in Touch →',
    ctaHref: '#contact',
    tagline: 'Your Cargo • Our Commitment',
    badge: 'Est. Sri Lanka',
  },
  whyUs: {
    eyebrow: 'Why Phoenix Cargo',
    title: 'What Sets Us',
    titleHighlight: 'Apart',
    items: [
      { icon: '🔒', title: 'Regulatory Expertise', description: 'Deep knowledge of Sri Lanka Customs regulations, BOI requirements, and international trade law ensures zero delays.' },
      { icon: '⏱️', title: 'Speed & Reliability', description: 'Industry-leading clearance times with a 99% on-time delivery record across all cargo categories.' },
      { icon: '👥', title: 'Dedicated Team', description: 'Your own account manager and clearing agent, always available — no call centers, no runaround.' },
      { icon: '📊', title: 'Real-Time Tracking', description: 'Live shipment visibility from origin to delivery, with proactive alerts at every customs milestone.' },
      { icon: '💰', title: 'Competitive Rates', description: 'Transparent pricing with no hidden charges. We negotiate the best carrier rates and pass the savings directly to you.' },
      { icon: '🌍', title: 'Global Network', description: 'Partnerships with leading international freight forwarders, NVOCC operators, and airline cargo divisions worldwide.' },
    ],
  },
  cta: {
    heading: 'Ready to Ship? We Handle the Rest.',
    subtext: 'From clearance to delivery — one call, one company, zero complications.',
    buttonLabel: 'Request a Quote Now →',
    buttonHref: '#contact',
  },
  contact: {
    eyebrow: 'Reach Out',
    title: 'Get a',
    titleHighlight: 'Free Quote',
    subtitle: 'Tell us about your shipment and our team will respond within 2 hours with a detailed quote.',
    addresses: [
      {
        type: 'corporate',
        label: 'Corporate Office',
        line1: '00 Corporate Tower, 1st Floor',
        line2: 'Example Road',
        city: 'Colombo 03',
        country: 'Sri Lanka',
        mapUrl: '',
      },
      {
        type: 'branch',
        label: 'Operations Branch',
        line1: '00 Port Access Road',
        line2: 'Harbour Zone',
        city: 'Colombo 01',
        country: 'Sri Lanka',
        mapUrl: '',
      },
    ],
    phone: '+94 11 000 0000',
    emergencyPhone: '+94 77 000 0000',
    email: 'info@phoenixcargo.lk',
    workingHours: 'Monday – Saturday: 8:00 AM – 6:00 PM',
    formRecipientEmail: 'quotes@phoenixcargo.lk',
  },
  footer: {
    tagline: 'Phoenix Cargo (Pvt) Ltd',
    description: 'Sri Lanka\'s trusted cargo clearance and freight forwarding company. We rise with every shipment, delivering precision and commitment from port to door.',
    serviceLinks: [
      { label: 'Cargo Clearance',       href: '#services' },
      { label: 'BOI Cargo',             href: '#services' },
      { label: 'Dangerous Goods',       href: '#services' },
      { label: 'Project Cargo',         href: '#services' },
      { label: 'Medical Cargo',         href: '#services' },
      { label: 'Transport Fleet',       href: '#services' },
    ],
    companyLinks: [
      { label: 'About Us',     href: '#about'   },
      { label: 'Why Choose Us',href: '#why'     },
      { label: 'Get a Quote',  href: '#contact' },
      { label: 'Contact',      href: '#contact' },
    ],
    certifications: [
      'Sri Lanka Customs Licensed',
      'IATA Certified',
      'IMDG Compliant',
      'BOI Registered',
    ],
    copyrightText: '© 2025 Phoenix Cargo (Pvt) Ltd. All rights reserved.',
    footerBadge: 'Your Cargo • Our Commitment',
    footerNote: 'Crafted with precision in Sri Lanka',
  },
};

export function loadContent(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultContent;
    return JSON.parse(raw) as SiteContent;
  } catch {
    return defaultContent;
  }
}

export function saveContent(content: SiteContent): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

export function resetContent(): void {
  localStorage.removeItem(STORAGE_KEY);
}
