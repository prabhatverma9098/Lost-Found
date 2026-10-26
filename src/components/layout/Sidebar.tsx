import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FilePlus, 
  MapPin, 
  FileText, 
  CheckSquare, 
  Search, 
  Sparkles, 
  MessageSquare, 
  User, 
  LogOut,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logoutUser, items } = useApp();

  const matchCount = items.filter(i => (i.matchScore || 0) >= 80).length;

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Report Lost Item', path: '/report/lost', icon: FilePlus },
    { label: 'Report Found Item', path: '/report/found', icon: MapPin },
    { label: 'My Reports', path: '/reports', icon: FileText },
    { label: 'My Claims', path: '/claims', icon: CheckSquare },
    { label: 'Browse Items', path: '/items', icon: Search },
    { label: 'AI Matches', path: '/ai-matches', icon: Sparkles, badge: matchCount > 0 ? `${matchCount}` : undefined },
    { label: 'Chat with AI', path: '/chat', icon: MessageSquare },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/report/lost' || path === '/report/found') {
      return location.pathname === path;
    }
    return location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col h-full min-h-[calc(100vh-4rem)]">
      {/* Brand Header inside Sidebar */}
      <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
        <Link 
          to="/" 
          onClick={onCloseMobile}
          className="flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0866E8] flex items-center justify-center text-white shadow-sm">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 6h-2V5c0-1.65-1.35-3-3-3h-4C8.35 2 7 3.35 7 5v1H5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10-1c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v1H9V5zm10 14H5V8h14v11z" />
              <circle cx="12" cy="13" r="2" />
            </svg>
          </div>
          <span className="font-bold text-base text-[#0B1F3A] tracking-tight">
            CampusLostFound
          </span>
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
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
                <span className="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-[#0866E8]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Admin Link shortcut if user is logged in as Admin */}
        {isAdmin && (
          <div className="pt-3 mt-3 border-t border-slate-100">
            <Link
              to="/admin"
              onClick={onCloseMobile}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0866E8]" />
                <span>Admin Panel</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        )}
      </nav>

      {/* User info & Logout */}
      <div className="p-4 border-t border-[#E2E8F0] space-y-3">
        <div className="flex items-center gap-3 px-1">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-200"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user.role} • {user.rollNo}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
