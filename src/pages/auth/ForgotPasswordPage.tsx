import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { toastSuccess, toastError } from '../../utils/swal';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toastError('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toastSuccess('Reset email sent!');
    } catch {
      toastError('Failed to send reset email. Check your email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://raw.githubusercontent.com/Iresh-Nimantha/test-img-upload/refs/heads/main/Alliance%20Freigh/bg.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-ash-900/96 via-fire-dark/85 to-ash-900/96 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src="/images/phoenix-cargo-logo.jpeg"
              alt="Phoenix Cargo"
              onError={(e) => { e.currentTarget.src = '/logo1.png'; }}
              className="h-12 w-auto mx-auto mb-4 rounded"
            />
          </Link>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Reset Password</h1>
          <p className="text-white/50 text-sm mt-1">We'll send you a reset link</p>
        </div>

        <div className="bg-ash-800/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <CheckCircle className="w-16 h-16 text-fire-orange mx-auto mb-4" />
              <h3 className="text-white text-lg font-bold mb-2">Email Sent!</h3>
              <p className="text-white/50 text-sm mb-6">
                Check your inbox for the password reset link.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-fire-orange hover:text-fire-amber font-semibold transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-11 pr-4 py-3.5 bg-ash-900/50 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-fire-orange/50 focus:bg-white/5 transition-all text-sm"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 bg-gradient-to-r from-fire-orange to-fire-amber text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-fire-orange/20 transition-shadow disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
              </motion.button>

              <p className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-white/40 text-sm hover:text-white/60 transition"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to Login
                </Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
