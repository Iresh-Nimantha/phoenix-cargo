import { motion } from 'motion/react';
import { useState } from 'react';
import { Mail, Phone, Check, Calendar, ArrowLeft, Loader2, CheckCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { sendQuoteEmail } from '../utils/emailjs';
import toast from 'react-hot-toast';

export default function RequestQuoteSection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    cargo: '',
    weight: '',
    quantity: '',
    origin: '',
    destination: '',
    mode: '',
    incoterms: '',
    date: '',
    name: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: '' });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.cargo.trim()) errs.cargo = 'Cargo description is required';
    if (!form.origin.trim()) errs.origin = 'Origin is required';
    if (!form.destination.trim()) errs.destination = 'Destination is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'quoteRequests'), {
        userDetails: { name: form.name, email: form.email, phone: form.phone },
        quoteDetails: {
          cargo: form.cargo,
          weight: form.weight,
          quantity: form.quantity,
          origin: form.origin,
          destination: form.destination,
          mode: form.mode,
          incoterms: form.incoterms,
          preferredDate: form.date,
        },
        submittedAt: serverTimestamp(),
        status: 'new',
        notes: '',
      });
      await sendQuoteEmail({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: '',
        service: form.mode || 'N/A',
        message: `Cargo: ${form.cargo}\nWeight: ${form.weight}\nQuantity: ${form.quantity}\nOrigin: ${form.origin}\nDestination: ${form.destination}\nIncoterms: ${form.incoterms}\nDate: ${form.date}`,
      }).catch(() => {});
      setSuccess(true);
      toast.success('Quote request submitted!');
    } catch {
      toast.error('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full text-[#0B2545] px-6 py-24 flex items-center justify-center overflow-hidden pt-12">
      <motion.button
        onClick={() => navigate('/')}
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-[#0B2545] font-bold hover:text-cyan-600 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </motion.button>

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/bg.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-[#EBEBEB]/90 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl xl:text-4xl font-black uppercase mb-4">Request a Quote</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-medium">
            Get competitive freight rates with professional support.
          </p>
        </motion.div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-white/70 backdrop-blur-md rounded-3xl p-12 shadow-2xl text-center border border-white/50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl font-black text-[#0B2545] mb-2">Quote Request Submitted!</h3>
            <p className="text-gray-600 mb-8">Our team will respond with a custom quotation within 4 business hours.</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all"
            >
              Back to Home
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-black uppercase mb-6">WHY CHOOSE US</h3>
                <div className="space-y-4">
                  {[
                    'Competitive global freight rates',
                    '24/7 customer support & shipment updates',
                    'Professional tailored logistics solutions',
                    'Reliable, on-time delivery guaranteed',
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3 font-semibold text-gray-700"
                    >
                      <div className="bg-cyan-500 rounded-full p-1 shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-base">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-white/60 p-6 rounded-2xl shadow-sm border border-white/60 backdrop-blur-md">
                <h4 className="font-bold text-lg mb-4 text-[#0B2545]">QUICK CONTACT</h4>
                <div className="space-y-3 text-gray-700">
                  <a href="mailto:imports@alliancefreightcmb.com" className="flex items-center gap-2 hover:text-cyan-600 font-semibold transition-colors">
                    <Mail className="w-5 h-5 text-cyan-600" /> imports@alliancefreightcmb.com
                  </a>
                  <div className="flex items-center gap-2 font-semibold">
                    <Phone className="w-5 h-5 text-cyan-600" /> 070 644 0992
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <Phone className="w-5 h-5 text-cyan-600" /> 076 736 7280
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/40"
            >
              <form className="space-y-4" onSubmit={handleSubmit}>
                <h3 className="text-xl font-black uppercase text-[#0B2545] border-b border-gray-200/50 pb-2 mb-4">Customer Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col text-left">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Your Full Name"
                      className={`w-full p-4 rounded-xl border ${errors.name ? 'border-red-400' : 'border-gray-200'} focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-sm bg-white/60`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                  </div>
                  <div className="flex flex-col text-left">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="Your Email Address"
                      className={`w-full p-4 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-200'} focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-sm bg-white/60`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="flex flex-col text-left">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="Your Phone Number"
                    className={`w-full p-4 rounded-xl border ${errors.phone ? 'border-red-400' : 'border-gray-200'} focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-sm bg-white/60`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                </div>

                <h3 className="text-xl font-black uppercase text-[#0B2545] border-b border-gray-200/50 pb-2 pt-2 mb-4">Cargo & Route Details</h3>

                <div className="flex flex-col text-left">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1 mb-1">Cargo Description *</label>
                  <textarea
                    value={form.cargo}
                    onChange={(e) => update('cargo', e.target.value)}
                    className={`w-full p-4 rounded-xl border ${errors.cargo ? 'border-red-400' : 'border-gray-200'} focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-sm bg-white/60 resize-none`}
                    placeholder="e.g., Apparel, industrial machinery"
                    rows={2}
                  />
                  {errors.cargo && <p className="text-red-500 text-xs mt-1 ml-1">{errors.cargo}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col text-left">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1 mb-1">Weight / Dimensions</label>
                    <input value={form.weight} onChange={(e) => update('weight', e.target.value)} className="p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-sm bg-white/60" placeholder="e.g. 500kg, 120x80x80cm" />
                  </div>
                  <div className="flex flex-col text-left">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1 mb-1">Quantity / Packages</label>
                    <input value={form.quantity} onChange={(e) => update('quantity', e.target.value)} className="p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-sm bg-white/60" placeholder="e.g. 2 Pallets, 10 Boxes" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col text-left">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1 mb-1">Origin Port/City *</label>
                    <input
                      type="text"
                      value={form.origin}
                      onChange={(e) => update('origin', e.target.value)}
                      placeholder="e.g., Colombo, Sri Lanka"
                      className={`w-full p-4 rounded-xl border ${errors.origin ? 'border-red-400' : 'border-gray-200'} focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-sm bg-white/60`}
                    />
                    {errors.origin && <p className="text-red-500 text-xs mt-1 ml-1">{errors.origin}</p>}
                  </div>
                  <div className="flex flex-col text-left">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1 mb-1">Destination Port/City *</label>
                    <input
                      type="text"
                      value={form.destination}
                      onChange={(e) => update('destination', e.target.value)}
                      placeholder="e.g., London, UK"
                      className={`w-full p-4 rounded-xl border ${errors.destination ? 'border-red-400' : 'border-gray-200'} focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-sm bg-white/60`}
                    />
                    {errors.destination && <p className="text-red-500 text-xs mt-1 ml-1">{errors.destination}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col text-left">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1 mb-1">Transport Mode</label>
                    <select value={form.mode} onChange={(e) => update('mode', e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-sm text-gray-700 bg-white/60 h-[54px]">
                      <option value="">Select Transport Mode</option>
                      <option>Sea Freight (FCL/LCL)</option>
                      <option>Air Freight</option>
                      <option>Road & Rail</option>
                      <option>Courier & Express</option>
                    </select>
                  </div>
                  <div className="flex flex-col text-left">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1 mb-1">Incoterms</label>
                    <select value={form.incoterms} onChange={(e) => update('incoterms', e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-sm text-gray-700 bg-white/60 h-[54px]">
                      <option value="">Select Incoterms</option>
                      <option>EXW (Ex Works)</option>
                      <option>FOB (Free on Board)</option>
                      <option>CIF (Cost, Insurance & Freight)</option>
                      <option>CPT (Carriage Paid To)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col text-left">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1 mb-1">Preferred Shipping Date</label>
                  <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-sm text-gray-700 bg-white/60 h-[54px]" />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold uppercase py-4 rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'REQUEST A QUOTE →'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
