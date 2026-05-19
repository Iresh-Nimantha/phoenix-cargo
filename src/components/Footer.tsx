import { motion } from 'motion/react';
import { Mail, MapPin, Phone, Clock, Facebook, Linkedin, Instagram, Twitter } from 'lucide-react';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import { staggerContainer, fadeSlideUp } from '../animations/variants';
import { useContent } from '../hooks/useContent';

const defaultFooterData = {
  brandDescription: 'Alliance Freight Logistics delivers end-to-end supply chain solutions, specializing in ocean freight, air cargo, road transport, and warehousing across the globe.',
  copyright: '2026 Alliance Freight Logistics. All rights reserved.',
  facebookUrl: '',
  linkedinUrl: '',
  twitterUrl: '',
  instagramUrl: '',
};

const defaultContactData = {
  address: 'No. 77, Sri Medhananda Mawatha, Moratuwa, Sri Lanka',
  phone1: '070 644 0992',
  phone2: '076 736 7280',
  email: 'imports@alliancefreightcmb.com',
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subLoading, setSubLoading] = useState(false);

  const { content: footerContent } = useContent('footer', defaultFooterData);
  const footer = { ...defaultFooterData, ...footerContent };

  const { content: contactContent } = useContent('contact', defaultContactData);
  const contact = { ...defaultContactData, ...contactContent };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }
    setSubLoading(true);
    try {
      await addDoc(collection(db, 'newsletter'), { email, subscribedAt: serverTimestamp() });
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch {
      toast.error('Failed to subscribe');
    } finally {
      setSubLoading(false);
    }
  };

  const socialLinks = [
    { icon: Facebook, url: footer.facebookUrl },
    { icon: Linkedin, url: footer.linkedinUrl },
    { icon: Twitter, url: footer.twitterUrl },
    { icon: Instagram, url: footer.instagramUrl },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#0A0A0A] text-gray-300 py-16 px-6 relative overflow-hidden"
    >
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
      >
        {/* Brand */}
        <motion.div variants={fadeSlideUp} className="space-y-4">
          <img
            src="https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/logonogb.png"
            alt="Alliance Freight Logistics"
            className="h-20 w-auto"
          />
          <h2 className="text-xl font-black text-white uppercase tracking-tight">
            ALLIANCE FREIGHT <span className="text-[#FF7A1A]">LOGISTICS</span>
          </h2>
          <p className="text-sm leading-relaxed">
            {footer.brandDescription}
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={fadeSlideUp} className="space-y-4">
          <h3 className="text-lg font-bold tracking-wide uppercase text-[#FF7A1A]">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {['About Us', 'Our Services', 'Air Freight', 'Ocean Freight', 'Land Transport', 'Track Shipment', 'Request a Quote', 'Contact Us'].map((link) => (
              <motion.li
                key={link}
                whileHover={{ x: 4, color: '#ffffff' }}
                className="hover:text-white cursor-pointer flex items-center transition-colors"
              >
                <span className="mr-2 text-[#FF7A1A]">{'>'}</span> {link}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div variants={fadeSlideUp} className="space-y-4">
          <h3 className="text-lg font-bold tracking-wide uppercase text-[#FF7A1A]">Contact Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-[#FF7A1A] shrink-0" />
              <p>{contact.address}</p>
            </div>
            <div className="flex gap-3">
              <Phone className="w-5 h-5 text-[#FF7A1A] shrink-0" />
              <p>{contact.phone1} {contact.phone2 ? `/ ${contact.phone2}` : ''}</p>
            </div>
            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-[#FF7A1A] shrink-0" />
              <p className="break-all">{contact.email}</p>
            </div>
            <div className="flex gap-3 font-bold text-white">
              <Clock className="w-5 h-5 text-[#FF7A1A] shrink-0" />
              <p>24/7 Support</p>
            </div>
          </div>
        </motion.div>

        {/* Connect */}
        <motion.div variants={fadeSlideUp} className="space-y-6">
          <h3 className="text-lg font-bold tracking-wide uppercase text-[#FF7A1A]">Connect With Us</h3>
          <div className="flex gap-3">
            {socialLinks.map((item, i) => (
              <motion.a
                key={i}
                href={item.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, backgroundColor: '#FF7A1A', borderColor: '#FF7A1A' }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 border border-white/20 rounded-full text-white transition-colors"
              >
                <item.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>

          <form onSubmit={handleSubscribe} className="space-y-2">
            <h4 className="font-bold text-white uppercase text-sm">Newsletter Signup</h4>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="w-full p-3 bg-transparent border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-[#FF7A1A] outline-none transition-colors"
            />
            <motion.button
              type="submit"
              disabled={subLoading}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-[#FF7A1A] hover:bg-[#ff8c3a] text-white font-black py-3 rounded-lg text-sm uppercase transition-colors tracking-wider disabled:opacity-60"
            >
              {subLoading ? 'Subscribing...' : 'Subscribe'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>

      {/* Bottom */}
      <div className="relative z-10 max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>&copy; {footer.copyright}</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((item) => (
            <motion.span
              key={item}
              whileHover={{ color: '#ffffff' }}
              className="cursor-pointer transition-colors"
            >
              {item}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.footer>
  );
}
