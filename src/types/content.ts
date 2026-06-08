export interface SiteContent {
  meta: MetaContent;
  nav: NavContent;
  hero: HeroContent;
  ticker: TickerContent;
  services: ServicesContent;
  about: AboutContent;
  stats: StatsContent;
  whyUs: WhyUsContent;
  cta: CtaContent;
  contact: ContactContent;
  footer: FooterContent;
}

export interface MetaContent {
  siteTitle: string;
  metaDescription: string;
  themeColor: string;
}

export interface NavContent {
  logoAlt: string;
  links: { label: string; href: string }[];
  ctaLabel: string;
  ctaHref: string;
}

export interface HeroContent {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;       // the highlighted / gradient word(s)
  headingLine3: string;
  subtext: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  backgroundImageUrl: string; // optional overlay image
}

export interface StatsContent {
  items: { number: string; label: string }[];
}

export interface TickerContent {
  items: string[];            // each string is one ticker pill
  speed: number;              // animation duration in seconds (default 25)
}

export interface ServiceItem {
  id: string;
  icon: string;               // emoji or SVG string
  title: string;
  description: string;
  imageUrl: string;           // card cover image URL
  visible: boolean;
}

export interface ServicesContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  items: ServiceItem[];
}

export interface AboutContent {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;       // highlighted portion
  subtext: string;
  features: string[];         // bullet point list
  ctaLabel: string;
  ctaHref: string;
  tagline: string;
  badge: string;
}

export interface WhyUsContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  items: { icon: string; title: string; description: string }[];
}

export interface CtaContent {
  heading: string;
  subtext: string;
  buttonLabel: string;
  buttonHref: string;
}

export interface Address {
  type: 'corporate' | 'branch';
  label: string;              // e.g. "Corporate Office" or "Operations Branch"
  line1: string;
  line2: string;
  city: string;
  country: string;
  mapUrl: string;             // optional Google Maps embed or link
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  addresses: Address[];       // EXACTLY 2: index 0 = corporate, index 1 = branch
  phone: string;
  emergencyPhone: string;
  email: string;
  workingHours: string;
  formRecipientEmail: string;
}

export interface FooterContent {
  tagline: string;
  description: string;
  serviceLinks: { label: string; href: string }[];
  companyLinks: { label: string; href: string }[];
  certifications: string[];
  copyrightText: string;
  footerBadge: string;
  footerNote: string;
}
