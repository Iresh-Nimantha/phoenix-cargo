import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { toastSuccess, toastError } from '../../utils/swal';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const validate = (): string | null => {
    if (!form.name.trim()) return 'Full name is required';
    if (!form.email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Invalid email format';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    if (!form.phone.trim()) return 'Phone number is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toastError(error);
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toastSuccess('Account created successfully!');
      navigate('/admin');
    } catch (err: any) {
      const msg =
        err.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists'
          : err.code === 'auth/weak-password'
          ? 'Password is too weak'
          : 'Registration failed. Please try again.';
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', icon: User, type: 'text', placeholder: 'Full Name' },
    { key: 'email', icon: Mail, type: 'email', placeholder: 'Email Address' },
    { key: 'phone', icon: Phone, type: 'tel', placeholder: 'Phone Number' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
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
              onError={(e) => { e.currentTarget.src = '/logo.png'; }}
              className="h-12 w-auto mx-auto mb-4 rounded"
            />
          </Link>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Create Account</h1>
          <p className="text-white/50 text-sm mt-1">Join Phoenix Cargo today</p>
        </div>

        <div className="bg-ash-800/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, icon: Icon, type, placeholder }) => (
              <div key={key} className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-11 pr-4 py-3.5 bg-ash-900/50 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-fire-orange/50 focus:bg-white/5 transition-all text-sm"
                />
              </div>
            ))}

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="Password (min 6 chars)"
                className="w-full pl-11 pr-12 py-3.5 bg-ash-900/50 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-fire-orange/50 focus:bg-white/5 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                placeholder="Confirm Password"
                className="w-full pl-11 pr-4 py-3.5 bg-ash-900/50 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-fire-orange/50 focus:bg-white/5 transition-all text-sm"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 bg-gradient-to-r from-fire-orange to-fire-amber text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-fire-orange/20 hover:shadow-fire-orange/40 transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-fire-orange hover:text-fire-amber font-semibold transition">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
