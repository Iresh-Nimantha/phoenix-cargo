import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Settings,
  Upload,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Truck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

import { useSettings } from '../../context/SettingsContext';

const tabs = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'quotes', label: 'Quote Requests', icon: FileText },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'content', label: 'Content Editor', icon: Settings },
  { id: 'couriers', label: 'Couriers', icon: Truck },
  { id: 'media', label: 'Media Manager', icon: Upload },
];

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const { userProfile, logout } = useAuth();
  const { logoUrl } = useSettings();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.nav
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[#800C30] text-white flex flex-col h-screen relative shrink-0"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <motion.div
          animate={{ opacity: collapsed ? 0 : 1 }}
          className="flex items-center gap-3"
        >
          <img
            src={logoUrl}
            alt="Logo"
            className="h-8 w-auto bg-white p-0.5 rounded object-contain"
          />
          {!collapsed && <span className="text-lg font-bold tracking-tight">Admin</span>}
        </motion.div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 bg-[#800C30] border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-cyan-600 transition-colors z-50"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Tabs */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-5 h-5 shrink-0" />
            {!collapsed && (
              <motion.span
                initial={false}
                animate={{ opacity: collapsed ? 0 : 1 }}
              >
                {tab.label}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {/* User & Logout */}
      <div className="p-4 border-t border-white/10">
        {!collapsed && userProfile && (
          <div className="mb-3">
            <p className="text-sm font-semibold truncate">{userProfile.name}</p>
            <p className="text-xs text-white/40 truncate">{userProfile.email}</p>
          </div>
        )}
        <motion.button
          onClick={logout}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </motion.button>
      </div>
    </motion.nav>
  );
}
