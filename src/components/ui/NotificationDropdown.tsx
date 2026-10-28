import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';
import { 
  Bell, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RotateCcw,
  ShieldAlert,
  Check,
  ChevronRight
} from 'lucide-react';

export const NotificationDropdown: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, unreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    } else if (notif.type === 'ai_match') {
      navigate('/ai-matches');
    } else if (notif.type.includes('claim')) {
      navigate('/claims');
    } else {
      navigate('/reports');
    }
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'ai_match':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'claim_approved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'claim_rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'more_info':
      case 'suspicious_claim':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'item_returned':
        return <Check className="w-4 h-4 text-blue-600" />;
      default:
        return <FileText className="w-4 h-4 text-[#0866E8]" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 stroke-[2]" />
        {unreadNotificationCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse shadow-xs">
            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#E2E8F0] shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#0B1F3A]">Notifications</h3>
              {unreadNotificationCount > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">
                  {unreadNotificationCount} new
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="text-xs text-[#0866E8] hover:underline font-semibold"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer ${
                    !notif.read ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs font-bold truncate ${!notif.read ? 'text-[#0B1F3A]' : 'text-slate-700'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {notif.createdAt}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-[#0866E8] shrink-0 mt-2" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No notifications yet</p>
                <p className="text-[11px] text-slate-400">
                  Updates on reports, AI matches, and claim status will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
