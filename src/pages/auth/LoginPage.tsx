import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { toastSuccess, toastError } from '../../utils/swal';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toastError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toastSuccess('Welcome back!');
      navigate('/admin');
    } catch (err: any) {
      const msg =
        err.code === 'auth/invalid-credential'
          ? 'Invalid email or password'
          : err.code === 'auth/too-many-requests'
            ? 'Too many attempts. Please try again later.'
            : 'Login failed. Please try again.';
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
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
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Welcome Back</h1>
          <p className="text-white/50 text-sm mt-1">Sign in to access your dashboard</p>
        </div>

        {/* Form Card */}
        <div className="bg-ash-800/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-11 pr-4 py-3.5 bg-ash-900/50 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-fire-orange/50 focus:bg-white/5 transition-all text-sm animate-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-11 pr-12 py-3.5 bg-ash-900/50 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-fire-orange/50 focus:bg-white/5 transition-all text-sm animate-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 bg-gradient-to-r from-fire-orange to-fire-amber text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-fire-orange/20 hover:shadow-fire-orange/40 transition-shadow disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider text-xs"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
