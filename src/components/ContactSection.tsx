import { useState, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, useInView } from 'motion/react';
import { Phone, Mail, Clock, MapPin, Send, Loader2, Check } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { sendContactEmail } from '../utils/emailjs';
import { toastSuccess, toastError } from '../utils/swal';

export default function ContactSection() {
  const { content } = useContent();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [form, setForm] = useState({ name: '', email: '', subject: 'Cargo Clearance', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.message.trim()) errs.message = 'Message details are required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // 1. Try sending the email via EmailJS first so the user gets immediate feedback and we capture errors
      await sendContactEmail(form);

      // 2. Try adding to Firestore in the background
      addDoc(collection(db, 'contactMessages'), {
        ...form,
        submittedAt: serverTimestamp(),
        status: 'new',
        replied: false,
      }).catch((err) => {
        console.error('Firestore save failed:', err);
      });

      setSuccess(true);
      toastSuccess('Clearance inquiry submitted successfully!');
    } catch (err: any) {
      console.error('Error submitting inquiry:', err);
      toastError(err?.text || err?.message || 'Failed to submit clearance inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={ref}
      id="contact"
      className="relative py-24 lg:py-32 px-[5vw] overflow-hidden"
      style={{ background: 'var(--clr-ash-900)' }}
    >
      <div className="relative z-10 max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left column: Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="font-cond text-xs tracking-[3px] uppercase text-fire-orange font-bold block mb-3">
            {content.contact.eyebrow}
          </span>
          <h2
            className="font-display font-bold uppercase mb-4 leading-tight"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}
          >
            {content.contact.title}{' '}
            <span className="text-fire-orange">{content.contact.titleHighlight}</span>
          </h2>
          <p className="text-ash-400 font-light text-base leading-relaxed mb-12">
            {content.contact.subtitle}
          </p>

          {/* Quick Contact Info Cards */}
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {/* Phone */}
            <div className="bg-ash-800/50 border border-white/[0.03] p-5 rounded-lg flex gap-4 items-center">
              <div className="w-10 h-10 rounded bg-fire-orange/5 border border-fire-orange/15 flex items-center justify-center text-fire-orange shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <span className="font-cond text-[10px] tracking-[1.5px] uppercase text-ash-400 font-bold block">
                  Operations Hotline
                </span>
                <a href={`tel:${content.contact.phone}`} className="text-sm font-semibold text-white hover:text-fire-orange transition-colors">
                  {content.contact.phone}
                </a>
              </div>
            </div>

            {/* Emergency phone */}
            <div className="bg-fire-maroon/10 border border-fire-red/10 p-5 rounded-lg flex gap-4 items-center">
              <div className="w-10 h-10 rounded bg-fire-red/5 border border-fire-red/20 flex items-center justify-center text-fire-red shrink-0">
                <Phone size={18} className="animate-pulse" />
              </div>
              <div>
                <span className="font-cond text-[10px] tracking-[1.5px] uppercase text-fire-red font-bold block">
                  Emergency Dispatch
                </span>
                <a href={`tel:${content.contact.emergencyPhone}`} className="text-sm font-semibold text-white hover:text-fire-red transition-colors">
                  {content.contact.emergencyPhone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="bg-ash-800/50 border border-white/[0.03] p-5 rounded-lg flex gap-4 items-center">
              <div className="w-10 h-10 rounded bg-fire-orange/5 border border-fire-orange/15 flex items-center justify-center text-fire-orange shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <span className="font-cond text-[10px] tracking-[1.5px] uppercase text-ash-400 font-bold block">
                  Email Inquiries
                </span>
                <a href={`mailto:${content.contact.email}`} className="text-sm font-semibold text-white hover:text-fire-orange transition-colors break-all">
                  {content.contact.email}
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-ash-800/50 border border-white/[0.03] p-5 rounded-lg flex gap-4 items-center">
              <div className="w-10 h-10 rounded bg-fire-orange/5 border border-fire-orange/15 flex items-center justify-center text-fire-orange shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <span className="font-cond text-[10px] tracking-[1.5px] uppercase text-ash-400 font-bold block">
                  Working Hours
                </span>
                <span className="text-sm font-semibold text-ash-200">
                  {content.contact.workingHours}
                </span>
              </div>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-4">
            <h3 className="font-cond text-xs tracking-[2px] uppercase text-white font-bold mb-4">
              Our Locations
            </h3>
            {content.contact.addresses.map((address, idx) => {
              const isCorporate = idx === 0;
              return (
                <div
                  key={idx}
                  className={`bg-ash-800/60 p-6 rounded border-l-4 ${
                    isCorporate ? 'border-fire-orange' : 'border-ash-400'
                  }`}
                >
                  <span className="inline-block font-cond text-[9px] font-bold tracking-[1.5px] uppercase px-2.5 py-1 rounded bg-white/5 text-ash-200 mb-3">
                    {address.label || (isCorporate ? 'Corporate Office' : 'Operations Branch')}
                  </span>
                  <p className="font-bold text-white text-sm mb-1">{address.line1}</p>
                  <p className="text-ash-200 text-xs mb-1">{address.line2}</p>
                  <p className="text-ash-400 text-xs flex items-center gap-1">
                    <MapPin size={12} className="text-fire-orange" />
                    {address.city}, {address.country}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right column: Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="bg-ash-800 border border-white/[0.03] rounded-lg p-8 lg:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-fire-orange/10 border border-fire-orange/20 flex items-center justify-center text-fire-orange mx-auto mb-6">
                  <Check size={32} />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-white mb-4">
                  Request Submitted!
                </h3>
                <p className="text-sm text-ash-400 leading-relaxed max-w-[360px] mx-auto mb-8">
                  Thank you for contacting Phoenix Cargo. Our operations team will review your shipment details and contact you at <strong className="text-white">{form.email}</strong> within 2 hours.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setForm({ name: '', email: '', subject: 'Cargo Clearance', message: '' });
                  }}
                  className="font-cond text-xs tracking-[2px] uppercase font-bold text-fire-orange border border-fire-orange hover:bg-fire-orange/10 px-6 py-3 rounded-full transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="font-display text-xl font-bold uppercase text-white mb-6">
                  Clearance Inquiry Form
                </h3>

                <div>
                  <label className="block font-cond text-[10px] tracking-[2px] uppercase text-ash-400 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className={`w-full bg-ash-900 border ${
                      errors.name ? 'border-red-500/50' : 'border-white/10 focus:border-fire-orange/60'
                    } text-white text-sm px-4 py-3.5 rounded outline-none transition-colors`}
                  />
                  {errors.name && <span className="text-red-400 text-xs mt-1 block">{errors.name}</span>}
                </div>

                <div>
                  <label className="block font-cond text-[10px] tracking-[2px] uppercase text-ash-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={`w-full bg-ash-900 border ${
                      errors.email ? 'border-red-500/50' : 'border-white/10 focus:border-fire-orange/60'
                    } text-white text-sm px-4 py-3.5 rounded outline-none transition-colors`}
                  />
                  {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email}</span>}
                </div>

                <div>
                  <label className="block font-cond text-[10px] tracking-[2px] uppercase text-ash-400 mb-2">
                    Inquiry Topic
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-ash-900 border border-white/10 focus:border-fire-orange/60 text-white text-sm px-4 py-3.5 rounded outline-none cursor-pointer transition-colors"
                  >
                    <option value="Cargo Clearance">Cargo Clearance</option>
                    <option value="BOI Cargo">BOI Cargo Handling</option>
                    <option value="Dangerous Goods">Dangerous Goods</option>
                    <option value="Project Cargo">Project Cargo</option>
                    <option value="Medical/Pharma">Medical/Pharma Cargo</option>
                    <option value="Own Transport">Own Transport Fleet</option>
                    <option value="Air Freight">Air Freight</option>
                    <option value="Sea Freight">Sea Freight & FCL/LCL</option>
                    <option value="Documentation">Documentation & Compliance</option>
                    <option value="Other">Other logistics</option>
                  </select>
                </div>

                <div>
                  <label className="block font-cond text-[10px] tracking-[2px] uppercase text-ash-400 mb-2">
                    Shipment details (Weight, Volume, Route, special cargo info)
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => {
                      setForm({ ...form, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: '' });
                    }}
                    className={`w-full bg-ash-900 border ${
                      errors.message ? 'border-red-500/50' : 'border-white/10 focus:border-fire-orange/60'
                    } text-white text-sm px-4 py-3.5 rounded outline-none transition-colors resize-none`}
                  />
                  {errors.message && <span className="text-red-400 text-xs mt-1 block">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-cond text-sm tracking-[2px] uppercase font-bold text-white py-4 rounded-full bg-gradient-to-r from-fire-orange to-fire-amber hover:shadow-[0_4px_20px_rgba(232,97,10,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      Submit Quote Request <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
