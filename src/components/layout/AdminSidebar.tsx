import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FileCheck2, 
  CheckCircle, 
  Sparkles, 
  Users, 
  Tags, 
  MapPin, 
  Bell, 
  Settings, 
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { claims } = useApp();

  const pendingCount = claims.filter(c => c.status === 'Pending Verification').length;

  const adminMenu = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Reports', path: '/admin/reports', icon: FileCheck2 },
    { label: 'Manage Claims', path: '/admin/claims', icon: CheckCircle, badge: pendingCount ? `${pendingCount}` : undefined },
    { label: 'AI Match Results', path: '/admin/ai-matches', icon: Sparkles },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Categories', path: '/admin/categories', icon: Tags },
    { label: 'Locations', path: '/admin/locations', icon: MapPin },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col h-full min-h-[calc(100vh-4rem)]">
      {/* Admin header */}
      <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0B1F3A] flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="font-bold text-base text-[#0B1F3A] tracking-tight block">
              Admin Panel
            </span>
            <span className="text-[11px] text-slate-500 block">Proctorial Board</span>
          </div>
        </div>
      </div>

      {/* Admin Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {adminMenu.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-[#EAF3FF] text-[#0866E8] font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${active ? 'text-[#0866E8]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-3 mt-3 border-t border-slate-100">
          <Link
            to="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Student App</span>
          </Link>
        </div>
      </nav>

      {/* Footer Logout */}
      <div className="p-4 border-t border-[#E2E8F0]">
        <button
          onClick={() => {
            navigate('/login');
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
