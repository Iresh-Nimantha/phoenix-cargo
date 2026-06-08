import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuote } from '../context/QuoteContext';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { sendQuoteEmail } from '../utils/emailjs';
import { toastSuccess, toastError } from '../utils/swal';

export default function QuoteModal() {
  const { isModalOpen, closeModal } = useQuote();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toastError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      // 1. Send email notification via EmailJS first so errors can be thrown/logged immediately
      await sendQuoteEmail(form);

      // 2. Save to Firestore in background without blocking the user
      addDoc(collection(db, 'quoteRequests'), {
        userDetails: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
        },
        quoteDetails: {
          service: form.service,
          message: form.message,
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
      toastError(err?.text || err?.message || 'Failed to submit quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setForm({ name: '', email: '', phone: '', company: '', service: '', message: '' });
    closeModal();
  };

  const handleContinue = () => {
    handleClose();
    navigate('/request-quote');
  };

  const services = [
    'Sea Freight (FCL/LCL)',
    'Air Freight',
    'Road & Rail',
    'Courier & Express',
    'Customs Clearance',
    'Project Cargo',
    'Other',
  ];

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-ash-800 border border-white/5 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fire-orange to-fire-amber" />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 text-ash-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  >
                    <CheckCircle className="w-16 h-16 text-fire-orange mb-4 animate-pulse" />
                  </motion.div>
                  <h3 className="text-2xl font-display font-bold text-white uppercase mb-2">Thank You!</h3>
                  <p className="text-ash-400 text-sm mb-6 max-w-[300px]">
                    Your quote request has been submitted. Our team will contact you shortly.
                  </p>
                  <button
                    onClick={handleContinue}
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-fire-orange to-fire-amber text-white font-cond text-xs tracking-[1.5px] uppercase font-bold rounded-full shadow-lg hover:shadow-fire-orange/20 transition-all duration-300"
                  >
                    View Detailed Quote Form →
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-xl sm:text-2xl font-display font-bold uppercase text-white mb-1">Request a Quote</h2>
                  <p className="text-ash-400 text-sm mb-6">Get competitive freight rates with expert support</p>

                  <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                    <div className="flex flex-col text-left">
                      <label className="text-[10px] font-bold text-ash-400 uppercase tracking-widest pl-1 mb-1.5">Full Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="Your Full Name"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        className="w-full p-3 rounded-xl bg-ash-900 border border-white/10 text-white placeholder-ash-600 outline-none focus:border-fire-orange/60 transition-all text-sm"
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <label className="text-[10px] font-bold text-ash-400 uppercase tracking-widest pl-1 mb-1.5">Email Address *</label>
                      <input
                        required
                        type="email"
                        placeholder="Your Email Address"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        className="w-full p-3 rounded-xl bg-ash-900 border border-white/10 text-white placeholder-ash-600 outline-none focus:border-fire-orange/60 transition-all text-sm"
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <label className="text-[10px] font-bold text-ash-400 uppercase tracking-widest pl-1 mb-1.5">Phone Number *</label>
                      <input
                        required
                        type="tel"
                        placeholder="Your Phone Number"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className="w-full p-3 rounded-xl bg-ash-900 border border-white/10 text-white placeholder-ash-600 outline-none focus:border-fire-orange/60 transition-all text-sm"
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <label className="text-[10px] font-bold text-ash-400 uppercase tracking-widest pl-1 mb-1.5">Company Name</label>
                      <input
                        type="text"
                        placeholder="Company Name (optional)"
                        value={form.company}
                        onChange={(e) => update('company', e.target.value)}
                        className="w-full p-3 rounded-xl bg-ash-900 border border-white/10 text-white placeholder-ash-600 outline-none focus:border-fire-orange/60 transition-all text-sm"
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <label className="text-[10px] font-bold text-ash-400 uppercase tracking-widest pl-1 mb-1.5">Service Interested</label>
                      <select
                        value={form.service}
                        onChange={(e) => update('service', e.target.value)}
                        className="w-full p-3 rounded-xl bg-ash-900 border border-white/10 text-white placeholder-ash-600 outline-none focus:border-fire-orange/60 transition-all text-sm cursor-pointer"
                      >
                        <option value="">Select Service Interested</option>
                        {services.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col text-left">
                      <label className="text-[10px] font-bold text-ash-400 uppercase tracking-widest pl-1 mb-1.5">Additional details</label>
                      <textarea
                        placeholder="Additional details (optional)"
                        value={form.message}
                        onChange={(e) => update('message', e.target.value)}
                        rows={3}
                        className="w-full p-3 rounded-xl bg-ash-900 border border-white/10 text-white placeholder-ash-600 outline-none focus:border-fire-orange/60 transition-all text-sm resize-none"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-gradient-to-r from-fire-orange to-fire-amber text-white font-cond text-xs tracking-[1.5px] uppercase font-bold py-3.5 rounded-full shadow-lg hover:shadow-fire-orange/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 duration-300"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Quote Request →'}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
