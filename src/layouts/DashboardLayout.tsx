import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { AdminSidebar } from '../components/layout/AdminSidebar';
import { Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
  isAdmin?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ isAdmin = false }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine if current route is admin
  const isCurrentlyAdmin = isAdmin || location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      {/* Sub-header mobile toggle for sidebar */}
      <div className="lg:hidden bg-white border-b border-[#E2E8F0] px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Menu className="w-4 h-4 text-[#0866E8]" />
          <span>{isCurrentlyAdmin ? 'Admin Menu' : 'Dashboard Menu'}</span>
        </button>
        <span className="text-xs text-slate-500 font-medium">
          {isCurrentlyAdmin ? 'Campus Administration' : 'Smart Campus System'}
        </span>
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          {isCurrentlyAdmin ? <AdminSidebar /> : <Sidebar />}
        </div>

        {/* Mobile Sidebar Modal/Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {isCurrentlyAdmin ? (
                <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
              ) : (
                <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
              )}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
