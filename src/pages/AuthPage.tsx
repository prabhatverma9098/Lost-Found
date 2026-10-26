import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FIXED_ADMIN_EMAIL } from '../data/mockData';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginUser, addToast } = useApp();

  const isInitialSignUp = location.pathname === '/signup';
  const [isLoginTab, setIsLoginTab] = useState(!isInitialSignUp);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states
  const [emailOrRoll, setEmailOrRoll] = useState('student@aksuniversity.ac.in');
  const [password, setPassword] = useState('campus@2026');
  const [fullName, setFullName] = useState('Amit Kumar');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Strictly only Student, Faculty, Staff. NEVER Admin!
  const [selectedRole, setSelectedRole] = useState<'Student' | 'Faculty' | 'Staff'>('Student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const isAdminAccount = loginUser(emailOrRoll);
    if (isAdminAccount) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Normal registration is always Student/User, never Admin
    loginUser(emailOrRoll, fullName);
    navigate('/dashboard');
  };

  const setStudentDemo = () => {
    setEmailOrRoll('student@aksuniversity.ac.in');
    setPassword('campus@2026');
    setIsLoginTab(true);
  };

  const setAdminDemo = () => {
    setEmailOrRoll(FIXED_ADMIN_EMAIL);
    setPassword('admin@secure');
    setIsLoginTab(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Brand Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#0866E8] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 6h-2V5c0-1.65-1.35-3-3-3h-4C8.35 2 7 3.35 7 5v1H5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10-1c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v1H9V5zm10 14H5V8h14v11z" />
              <circle cx="12" cy="13" r="2" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#0B1F3A]">
            CampusLostFound
          </span>
        </Link>
      </div>

      {/* Centered Auth Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#E2E8F0] shadow-sm">
          {/* Logo icon inside card header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#0866E8] flex items-center justify-center text-white shadow-xs mb-2">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M19 6h-2V5c0-1.65-1.35-3-3-3h-4C8.35 2 7 3.35 7 5v1H5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10-1c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v1H9V5zm10 14H5V8h14v11z" />
                <circle cx="12" cy="13" r="2" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#0B1F3A]">CampusLostFound</h2>
          </div>

          {/* Tabs: Login | Sign Up with blue underline */}
          <div className="flex border-b border-[#E2E8F0] mb-6">
            <button
              type="button"
              onClick={() => setIsLoginTab(true)}
              className={`flex-1 pb-3 text-center text-sm font-semibold transition-all relative ${
                isLoginTab
                  ? 'text-[#0866E8]'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Login
              {isLoginTab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0866E8] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsLoginTab(false)}
              className={`flex-1 pb-3 text-center text-sm font-semibold transition-all relative ${
                !isLoginTab
                  ? 'text-[#0866E8]'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign Up
              {!isLoginTab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0866E8] rounded-full" />
              )}
            </button>
          </div>

          {/* LOGIN FORM */}
          {isLoginTab ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email / Roll No.
                </label>
                <input
                  type="text"
                  required
                  value={emailOrRoll}
                  onChange={(e) => setEmailOrRoll(e.target.value)}
                  placeholder="student@aksuniversity.ac.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0866E8]/20 focus:border-[#0866E8] text-sm text-slate-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0866E8]/20 focus:border-[#0866E8] text-sm text-slate-900 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#0866E8] rounded border-[#E2E8F0] focus:ring-[#0866E8]"
                  />
                  <span className="text-slate-700 font-medium">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => addToast({ type: 'info', title: 'Password Reset', message: 'Password reset link sent to registered email address.' })}
                  className="text-[#0866E8] hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Large Blue Login Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] text-white font-semibold text-sm shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Login
                </button>
              </div>

              <p className="text-center text-xs text-slate-500 pt-3">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLoginTab(false)}
                  className="text-[#0866E8] font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Amit Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0866E8]/20 focus:border-[#0866E8] text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email / Roll No. *
                </label>
                <input
                  type="text"
                  required
                  value={emailOrRoll}
                  onChange={(e) => setEmailOrRoll(e.target.value)}
                  placeholder="23CS1027 or student@aksuniversity.ac.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0866E8]/20 focus:border-[#0866E8] text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword || password}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm"
                  />
                </div>
              </div>

              {/* Role selector: STRICTLY Student, Faculty, Staff. NO ADMIN OPTION */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Selector *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Student', 'Faculty', 'Staff'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                        selectedRole === role
                          ? 'border-[#0866E8] bg-[#EAF3FF] text-[#0866E8]'
                          : 'border-[#E2E8F0] text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] text-white font-semibold text-sm shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Create Account
                </button>
              </div>

              <p className="text-center text-xs text-slate-500 pt-2">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLoginTab(true)}
                  className="text-[#0866E8] font-semibold hover:underline"
                >
                  Login
                </button>
              </p>
            </form>
          )}

          {/* Quick Account Test Selector */}
          <div className="mt-6 pt-5 border-t border-slate-100 bg-slate-50/70 -mx-6 sm:-mx-10 -mb-8 p-4 rounded-b-2xl">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
              Quick Accounts for Testing
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={setStudentDemo}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0866E8]" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={setAdminDemo}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:border-slate-800 hover:bg-slate-100 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-800" />
                <span>Admin ({FIXED_ADMIN_EMAIL.split('@')[0]})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
