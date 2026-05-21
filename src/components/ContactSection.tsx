import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useRef } from 'react';
import { Phone, Mail, Clock, Navigation, Send, Loader2, CheckCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { sendContactEmail } from '../utils/emailjs';
import TiltCard from '../animations/TiltCard';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';

const defaultData = {
  sectionTitle: 'Get in touch with Alliance Freight',
  sectionDescription: 'Our dedicated team is ready to assist you with professional freight forwarding and shipping solutions worldwide.',
  address: 'No. 77, Sri Medhananda Mawatha, Moratuwa, Sri Lanka',
  phone1: '070 644 0992',
  phone2: '076 736 7280',
  email: 'imports@alliancefreightcmb.com',
  supportHours: '24/7',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.042790919323!2d79.88373187428458!3d6.877684018610582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25a587e148e65%3A0x6a0a0b22f2f11ed7!2sNo.+77+Sri+Medhananda+Mawatha%2C+Moratuwa%2C+Sri+Lanka!5e0!3m2!1sen!2slk!4v1716035000000!5m2!1sen!2slk',
  googleMapsLink: 'https://www.google.com/maps/search/?api=1&query=No.+77,+Sri+Medhananda+Mawatha,+Moratuwa,+Sri+Lanka',
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
};

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { content } = useContent('contact', defaultData);
  const data = { ...defaultData, ...content };

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const leftX = useTransform(scrollYProgress, [0.1, 0.4], [-40, 0]);
  const rightX = useTransform(scrollYProgress, [0.1, 0.4], [40, 0]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...form,
        submittedAt: serverTimestamp(),
        status: 'new',
        replied: false,
      });
      await sendContactEmail(form).catch(() => { });
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      toast.success('Message sent successfully!');
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen w-full text-[#0B2545] px-4 sm:px-6 py-24 flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${data.backgroundImageUrl}')`,
          y: bgY,
        }}
      />
      <div className="absolute inset-0 bg-[#EBEBEB]/90 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="text-center mb-16 px-4"
        >
          <h2 className="text-xl sm:text-3xl xl:text-4xl font-black uppercase mb-4 leading-tight break-words text-[#0B2545] text-center whitespace-pre-wrap">
            {data.sectionTitle}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-medium">
            {data.sectionDescription}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Map + Info with parallax */}
          <motion.div style={{ x: leftX }} className="space-y-6">
            {/* Map */}
            <TiltCard maxTilt={3}>
              <div className="relative p-2 rounded-2xl min-h-[300px] flex items-center justify-center overflow-hidden shadow-lg border-4 border-white">
                <iframe
                  src={data.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.042790919323!2d79.88373187428458!3d6.877684018610582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25a587e148e65%3A0x6a0a0b22f2f11ed7!2sNo.+77+Sri+Medhananda+Mawatha%2C+Moratuwa%2C+Sri+Lanka!5e0!3m2!1sen!2slk!4v1716035000000!5m2!1sen!2slk'}
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-xl shadow-lg border-l-4 border-red-500 w-56 z-20">
                  <h4 className="font-bold text-[#0B2545] text-sm">Alliance Freight (Pvt) Ltd</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{data.address}</p>
                </div>
                <a
                  href={data.googleMapsLink || 'https://www.google.com/maps/search/?api=1&query=No.+77,+Sri+Medhananda+Mawatha,+Moratuwa,+Sri+Lanka'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white px-4 py-2 shadow-lg flex items-center gap-2 hover:shadow-cyan-500/20 transition-all font-bold text-sm z-20"
                >
                  <Navigation className="w-4 h-4" /> {data.directionsText}
                </a>
              </div>
            </TiltCard>

            {/* 3D Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TiltCard maxTilt={8} glare={true}>
                <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white/60 space-y-3 h-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg text-white">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{data.telephoneTitle}</h4>
                      <p className="text-xs text-gray-500">{data.telephoneSubtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">{data.phone1} {data.phone2 ? `/ ${data.phone2}` : ''}</p>
                </div>
              </TiltCard>
              <TiltCard maxTilt={8} glare={true}>
                <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white/60 space-y-3 h-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{data.emailTitle}</h4>
                      <p className="text-xs text-gray-500">{data.emailSubtitle}</p>
                    </div>
                  </div>
                  <a href={`mailto:${data.email}`} className="block text-sm text-[#0B2545] font-semibold hover:underline break-all">
                    {data.email}
                  </a>
                </div>
              </TiltCard>
              <div className="md:col-span-2">
                <TiltCard maxTilt={4}>
                  <div className="bg-cyan-50/70 p-5 rounded-2xl shadow-sm border border-cyan-100 flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg text-white">
                      <Clock className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-[#0B2545]">{data.supportHours}</p>
                      <p className="text-sm text-gray-600">{data.supportNote}</p>
                    </div>
                  </div>
                </TiltCard>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form with parallax */}
          <motion.div style={{ x: rightX }}>
            <TiltCard maxTilt={2}>
              <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/40 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />

                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center relative z-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    >
                      <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                    </motion.div>
                    <h3 className="text-2xl font-black text-[#0B2545] mb-2">{data.successTitle}</h3>
                    <p className="text-gray-600 mb-6">{data.successMessage}</p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="px-6 py-2 border-2 border-[#0B2545] text-[#0B2545] rounded-xl font-bold hover:bg-[#0B2545] hover:text-white transition-colors"
                    >
                      {data.successButtonText}
                    </button>
                  </motion.div>
                ) : (
                  <div className="relative z-10">
                    <h3 className="text-xl font-black uppercase text-[#0B2545] mb-6">{data.formTitle}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {[
                        { key: 'name', placeholder: data.formNamePlaceholder, type: 'text' },
                        { key: 'email', placeholder: data.formEmailPlaceholder, type: 'email' },
                        { key: 'subject', placeholder: data.formSubjectPlaceholder, type: 'text' },
                      ].map(({ key, placeholder, type }) => (
                        <div key={key}>
                          <input
                            type={type}
                            value={form[key as keyof typeof form]}
                            onChange={(e) => {
                              setForm({ ...form, [key]: e.target.value });
                              if (errors[key]) setErrors({ ...errors, [key]: '' });
                            }}
                            placeholder={placeholder}
                            className={`w-full p-4 rounded-xl border ${errors[key] ? 'border-red-400' : 'border-gray-200'} outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white/60 text-sm`}
                          />
                          {errors[key] && <p className="text-red-500 text-xs mt-1 ml-1">{errors[key]}</p>}
                        </div>
                      ))}
                      <div>
                        <textarea
                          value={form.message}
                          onChange={(e) => {
                            setForm({ ...form, message: e.target.value });
                            if (errors.message) setErrors({ ...errors, message: '' });
                          }}
                          placeholder={data.formMessagePlaceholder}
                          rows={4}
                          className={`w-full p-4 rounded-xl border ${errors.message ? 'border-red-400' : 'border-gray-200'} outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white/60 text-sm resize-none`}
                        />
                        {errors.message && <p className="text-red-500 text-xs mt-1 ml-1">{errors.message}</p>}
                      </div>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileTap={{ scale: 0.97 }}
                        className="w-full bg-gradient-to-r from-blue-700 to-cyan-500 text-white px-8 py-4 rounded-xl shadow-lg font-bold flex items-center justify-center gap-2 hover:shadow-cyan-500/20 transition-shadow disabled:opacity-60"
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            {data.formSubmitText} <Send className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>
                    </form>
                  </div>
                )}
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
