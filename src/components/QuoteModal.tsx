import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuote } from '../context/QuoteContext';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { sendQuoteEmail } from '../utils/emailjs';
import toast from 'react-hot-toast';

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
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      // Save to Firestore
      await addDoc(collection(db, 'quoteRequests'), {
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
      });
      // Send email notification
      await sendQuoteEmail(form).catch(() => {});
      setSuccess(true);
    } catch {
      toast.error('Failed to submit. Please try again.');
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
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
                    <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-[#0B2545] mb-2">Thank You!</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Your quote request has been submitted. Our team will contact you shortly.
                  </p>
                  <button
                    onClick={handleContinue}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg"
                  >
                    View Detailed Quote Form →
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-black uppercase text-[#0B2545] mb-1">Request a Quote</h2>
                  <p className="text-gray-500 text-sm mb-6">Get competitive freight rates with expert support</p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      required
                      type="text"
                      placeholder="Full Name *"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email *"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Phone Number *"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Company (optional)"
                      value={form.company}
                      onChange={(e) => update('company', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                    />
                    <select
                      value={form.service}
                      onChange={(e) => update('service', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm text-gray-500"
                    >
                      <option value="">Service Interested (optional)</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <textarea
                      placeholder="Additional details (optional)"
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      rows={3}
                      className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm resize-none"
                    />

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-shadow flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Quote Request →'}
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
