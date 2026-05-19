import { motion } from 'motion/react';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { Users, FileText, MessageSquare, TrendingUp } from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';
import { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const duration = 1500;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <>{display}</>;
}

export default function AnalyticsDashboard() {
  const { data: users, loading: usersLoading } = useFirestoreCollection('users');
  const { data: quotes, loading: quotesLoading } = useFirestoreCollection('quoteRequests');
  const { data: messages, loading: messagesLoading } = useFirestoreCollection('contactMessages');

  const loading = usersLoading || quotesLoading || messagesLoading;

  // Generate simple monthly data from timestamps
  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((name, i) => ({
      name,
      users: users.filter((u: any) => {
        const d = u.createdAt?.toDate?.();
        return d && d.getMonth() === i;
      }).length,
      quotes: quotes.filter((q: any) => {
        const d = q.submittedAt?.toDate?.();
        return d && d.getMonth() === i;
      }).length,
      messages: messages.filter((m: any) => {
        const d = m.submittedAt?.toDate?.();
        return d && d.getMonth() === i;
      }).length,
    }));
  };

  const statusData = [
    { name: 'New', count: quotes.filter((q: any) => q.status === 'new').length, fill: '#3b82f6' },
    { name: 'In Progress', count: quotes.filter((q: any) => q.status === 'in-progress').length, fill: '#eab308' },
    { name: 'Completed', count: quotes.filter((q: any) => q.status === 'completed').length, fill: '#22c55e' },
    { name: 'Cancelled', count: quotes.filter((q: any) => q.status === 'cancelled').length, fill: '#ef4444' },
  ];

  if (loading) return <LoadingSkeleton type="card" />;

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
    { label: 'Quote Requests', value: quotes.length, icon: FileText, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50' },
    { label: 'Contact Messages', value: messages.length, icon: MessageSquare, color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-50' },
    { label: 'Active Quotes', value: quotes.filter((q: any) => q.status === 'in-progress' || q.status === 'new').length, icon: TrendingUp, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                <stat.icon className="w-5 h-5 text-gray-700" />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">
              <AnimatedNumber value={stat.value} />
            </p>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Monthly Activity</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={getMonthlyData()}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A8E8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00A8E8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorQuotes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="quotes" stroke="#8b5cf6" fill="url(#colorQuotes)" strokeWidth={2} />
              <Area type="monotone" dataKey="users" stroke="#00A8E8" fill="url(#colorUsers)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Requests by Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Requests by Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
      >
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Recent Quote Requests</h3>
        <div className="space-y-3">
          {quotes.slice(0, 5).map((q: any) => (
            <div key={q.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{q.userDetails?.name || 'Unknown'}</p>
                <p className="text-xs text-gray-400">{q.userDetails?.email}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                q.status === 'new' ? 'bg-blue-100 text-blue-700' :
                q.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                q.status === 'completed' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {q.status || 'new'}
              </span>
            </div>
          ))}
          {quotes.length === 0 && <p className="text-gray-400 text-sm">No data yet</p>}
        </div>
      </motion.div>
    </div>
  );
}
