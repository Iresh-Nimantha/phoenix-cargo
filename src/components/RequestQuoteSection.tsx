import { motion } from 'motion/react';
import { useState } from 'react';
import { Mail, Phone, Check, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { sendQuoteEmail } from '../utils/emailjs';
import { toastSuccess, toastError } from '../utils/swal';

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
      toastError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      // 1. Send email notification via EmailJS first
      await sendQuoteEmail({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: '',
        service: form.mode || 'N/A',
        message: `Cargo: ${form.cargo}\nWeight: ${form.weight}\nQuantity: ${form.quantity}\nOrigin: ${form.origin}\nDestination: ${form.destination}\nIncoterms: ${form.incoterms}\nDate: ${form.date}`,
      });

      // 2. Save to Firestore in background
      addDoc(collection(db, 'quoteRequests'), {
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
      }).catch((err) => {
        console.error('Firestore save failed:', err);
      });

      setSuccess(true);
      toastSuccess('Quote request submitted successfully!');
    } catch (err: any) {
      console.error('Error submitting quote request:', err);
      toastError(err?.text || err?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full text-white px-5 sm:px-8 lg:px-[5vw] py-24 flex items-center justify-center overflow-hidden pt-12" style={{ background: 'var(--clr-ash-900)' }}>
      <motion.button
        onClick={() => navigate('/')}
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-ash-400 font-cond text-xs tracking-[1.5px] uppercase font-bold hover:text-fire-orange transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-fire-orange" /> Back to Home
      </motion.button>

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/bg.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-ash-900/98 via-fire-dark/30 to-ash-900/98 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="font-cond text-xs tracking-[3px] uppercase text-fire-orange font-bold block mb-3">Phoenix Cargo clearing</span>
          <h2 className="text-3xl xl:text-4xl font-display font-bold uppercase mb-4 leading-tight">Request a <span className="text-fire-orange">Quote</span></h2>
          <p className="text-ash-400 text-base max-w-2xl mx-auto font-light">
            Get competitive freight rates with professional support tailored to your enterprise logistics requirements.
          </p>
        </motion.div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-ash-800 border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle className="w-20 h-20 text-fire-orange mx-auto mb-6 animate-pulse" />
            </motion.div>
            <h3 className="text-2xl font-display font-bold text-white uppercase mb-2">Quote Request Submitted!</h3>
            <p className="text-ash-400 mb-8 text-sm leading-relaxed">Our logistics and clearing operations team will respond with a custom quotation within 2 hours.</p>
            <button
              onClick={() => navigate('/')}
              className="w-full py-4 bg-gradient-to-r from-fire-orange to-fire-amber text-white font-cond text-xs tracking-[1.5px] uppercase font-bold rounded-full shadow-lg hover:shadow-fire-orange/20 transition-all duration-300"
            >
              Back to Home
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-4 space-y-8"
            >
              <div>
                <h3 className="font-cond text-xs tracking-[2px] uppercase text-ash-400 font-bold mb-6">WHY CHOOSE PHOENIX</h3>
                <div className="space-y-4">
                  {[
                    'Competitive global freight rates',
                    '24/7 customer support & shipment updates',
                    'Professional tailored shipping solutions',
                    'Reliable, on-time delivery guaranteed',
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3 font-light text-ash-200"
                    >
                      <div className="bg-fire-orange/10 border border-fire-orange/20 rounded-full p-1 shrink-0 text-fire-orange">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-ash-800/60 p-6 rounded-2xl border border-white/[0.03] backdrop-blur-md">
                <h4 className="font-cond text-xs tracking-[1.5px] uppercase font-bold mb-4 text-white">QUICK CONTACT</h4>
                <div className="space-y-3 text-ash-200 text-sm">
                  <a href="mailto:imports@phoenixcargo.com" className="flex items-center gap-2 hover:text-fire-orange transition-colors">
                    <Mail className="w-4 h-4 text-fire-orange" /> imports@phoenixcargo.com
                  </a>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-fire-orange" /> 070 644 0992
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-fire-orange" /> 076 736 7280
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-8 bg-ash-800 border border-white/[0.03] rounded-3xl p-6 sm:p-10 shadow-2xl"
            >
              <form className="space-y-6" onSubmit={handleSubmit}>
                <h3 className="font-display text-lg font-bold uppercase text-white border-b border-white/5 pb-3 mb-4">Customer Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col text-left">
                    <label className="text-[10px] font-bold text-ash-400 uppercase tracking-widest pl-1 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Your Full Name"
                      className={`w-full p-3.5 rounded-xl bg-ash-900 border ${errors.name ? 'border-red-500/50' : 'border-white/10 focus:border-fire-orange/60'} outline-none transition-all text-sm text-white`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>}
                  </div>
                  <div className="flex flex-col text-left">
                    <label className="text-[10px] font-bold text-ash-400 uppercase tracking-widest pl-1 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="Your Email Address"
                      className={`w-full p-3.5 rounded-xl bg-ash-900 border ${errors.email ? 'border-red-500/50' : 'border-white/10 focus:border-fire-orange/60'} outline-none transition-all text-sm text-white`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="flex flex-col text-left">
                  <label className="text-[10px] font-bold text-ash-400 uppercase tracking-widest pl-1 mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="Your Phone Number"
                    className={`w-full p-3.5 rounded-xl bg-ash-900 border ${errors.phone ? 'border-red-500/50' : 'border-white/10 focus:border-fire-orange/60'} outline-none transition-all text-sm text-white`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                </div>

                <h3 className="font-display text-lg font-bold uppercase text-white border-b border-white/5 pb-3 pt-4 mb-4">Cargo & Route Details</h3>

                <div className="flex flex-col text-left">
                  <label className="text-[10px] font-bold text-ash-400 uppercase tracking-widest pl-1 mb-1.5">Cargo Description *</label>
                  <textarea
                    value={form.cargo}
                    onChange={(e) => update('cargo', e.target.value)}
                    className={`w-full p-3.5 rounded-xl bg-ash-900 border ${errors.cargo ? 'border-red-500/50' : 'border-white/10 focus:border-fire-orange/60'} outline-none transition-all text-sm text-white resize-none`}
                    placeholder="e.g., Apparel, industrial machinery, BOI materials"
                    rows={2}
                  />
                  {errors.cargo && <p className="text-red-500 text-xs mt-1 ml-1">{errors.cargo}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col text-left">
                    <label className="text-[10px] font-bold text-ash-400 uppercase tracking-widest pl-1 mb-1.5">Weight / Dimensions</label>
                    <input value={form.weight} onChange={(e) => update('weight', e.target.value)} className="p-3.5 rounded-xl bg-ash-900 border border-white/10 focus:border-fire-orange/60 outline-none transition-all text-sm text-white" placeholder="e.g. 500kg, 120x80x80cm" />
                  </div>
                  <div className="flex flex-col text-left">
                    <label className="text-[10px] font-bold text-ash-400 uppercase tracking-widest pl-1 mb-1.5">Quantity / Packages</label>
                    <input value={form.quantity} onChange={(e) => update('quantity', e.target.value)} className="p-3.5 rounded-xl bg-ash-900 border border-white/10 focus:border-fire-orange/60 outline-none transition-all text-sm text-white" placeholder="e.g. 2 Pallets, 10 Boxes" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col text-left">
                    <label className="text-[10px] font-bold text-ash-400 uppercase tracking-widest pl-1 mb-1.5">Origin Port/City *</label>
                    <input
                      type="text"
                      value={form.origin}
                      onChange={(e) => update('origin', e.target.value)}
                      placeholder="e.g., Colombo, Sri Lanka"
                      className={`w-full p-3.5 rounded-xl bg-ash-900 border ${errors.origin ? 'border-red-500/50' : 'border-white/10 focus:border-fire-orange/60'} outline-none transition-all text-sm text-white`}
                    />
                    {errors.origin && <p className="text-red-500 text-xs mt-1 ml-1">{errors.origin}</p>}
                  </div>
                  <div className="flex flex-col text-left">
                    <label className="text-[10px] font-bold text-ash-400 uppercase tracking-widest pl-1 mb-1.5">Destination Port/City *</label>
                    <input
                      type="text"
                      value={form.destination}
                      onChange={(e) => update('destination', e.target.value)}
                      placeholder="e.g., London, UK"
                      className={`w-full p-3.5 rounded-xl bg-ash-900 border ${errors.destination ? 'border-red-500/50' : 'border-white/10 focus:border-fire-orange/60'} outline-none transition-all text-sm text-white`}
                    />
                    {errors.destination && <p className="text-red-500 text-xs mt-1 ml-1">{errors.destination}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col text-left">
                    <label className="text-[10px] font-bold text-ash-400 uppercase tracking-widest pl-1 mb-1.5">Transport Mode</label>
                    <select value={form.mode} onChange={(e) => update('mode', e.target.value)} className="w-full p-3.5 rounded-xl bg-ash-900 border border-white/10 focus:border-fire-orange/60 outline-none transition-all text-sm text-white cursor-pointer h-[46px]">
                      <option value="">Select Transport Mode</option>
                      <option>Sea Freight (FCL/LCL)</option>
                      <option>Air Freight</option>
                      <option>Road & Rail</option>
                      <option>Courier & Express</option>
                    </select>
                  </div>
                  <div className="flex flex-col text-left">
                    <label className="text-[10px] font-bold text-ash-400 uppercase tracking-widest pl-1 mb-1.5">Incoterms</label>
                    <select value={form.incoterms} onChange={(e) => update('incoterms', e.target.value)} className="w-full p-3.5 rounded-xl bg-ash-900 border border-white/10 focus:border-fire-orange/60 outline-none transition-all text-sm text-white cursor-pointer h-[46px]">
                      <option value="">Select Incoterms</option>
                      <option>EXW (Ex Works)</option>
                      <option>FOB (Free on Board)</option>
                      <option>CIF (Cost, Insurance & Freight)</option>
                      <option>CPT (Carriage Paid To)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col text-left">
                  <label className="text-[10px] font-bold text-ash-400 uppercase tracking-widest pl-1 mb-1.5">Preferred Shipping Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.date}
                    onChange={(e) => update('date', e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-ash-900 border border-white/10 focus:border-fire-orange/60 outline-none transition-all text-sm text-white h-[46px]"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-fire-orange to-fire-amber text-white font-cond text-sm tracking-[2px] uppercase font-bold py-4 rounded-full shadow-lg hover:shadow-fire-orange/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 duration-300"
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
