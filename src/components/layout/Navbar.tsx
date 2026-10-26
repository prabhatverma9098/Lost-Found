import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Menu, X, ShieldAlert, Sparkles, User, LogOut, LayoutDashboard } from 'lucide-react';
import { FIXED_ADMIN_EMAIL } from '../../data/mockData';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, logoutUser } = useApp();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Items', path: '/items' },
    { name: 'Report Item', path: '/report/lost' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#0866E8] flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 6h-2V5c0-1.65-1.35-3-3-3h-4C8.35 2 7 3.35 7 5v1H5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10-1c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v1H9V5zm10 14H5V8h14v11z" />
                <circle cx="12" cy="13" r="2" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0B1F3A]">
              CampusLostFound
            </span>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-[#0866E8] font-semibold'
                    : 'text-slate-600 hover:text-[#0B1F3A]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Account pill */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
              {isAdmin ? (
                <div className="flex items-center gap-1.5 text-purple-700">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#0866E8]" />
                  <span>Admin: kickshu10</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Student Portal</span>
                </div>
              )}
            </div>

            {isAdmin ? (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#EAF3FF] text-[#0866E8] hover:bg-blue-100 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
            )}

            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-[#0B1F3A] border border-[#E2E8F0] hover:border-slate-300 rounded-lg transition-all"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-[#0866E8] hover:bg-[#0652ba] rounded-lg shadow-sm hover:shadow transition-all"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E2E8F0] bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-[#EAF3FF] text-[#0866E8]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-xs">
              <span className="text-slate-600">
                {isAdmin ? 'Account: Admin (kickshu10@gmail.com)' : `User: ${user.name}`}
              </span>
            </div>
            {isAdmin ? (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 px-4 rounded-lg bg-[#0B1F3A] text-white font-medium text-sm"
              >
                Go to Admin Panel
              </Link>
            ) : (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 px-4 rounded-lg bg-[#EAF3FF] text-[#0866E8] font-medium text-sm"
              >
                Go to Student Dashboard
              </Link>
            )}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 px-4 border border-[#E2E8F0] rounded-lg text-slate-700 font-medium text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 px-4 bg-[#0866E8] text-white rounded-lg font-medium text-sm"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
