import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  MapPin, 
  CheckSquare, 
  Sparkles, 
  Calendar, 
  ArrowRight,
  Plus,
  PackageOpen
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, items, claims } = useApp();

  // Dynamic user stats strictly computed from active state
  const lostCount = items.filter(i => i.type === 'lost').length;
  const foundCount = items.filter(i => i.type === 'found').length;
  const activeClaimsCount = claims.filter(c => c.status === 'Pending Verification').length;
  const possibleMatchesCount = items.filter(i => (i.matchScore || 0) >= 70).length;

  const recentItems = items.slice(0, 3);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A] tracking-tight">
            Welcome, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Here's an overview of your activity
          </p>
        </div>

        {/* Top-Right Avatar */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-[#E2E8F0] shadow-xs self-start sm:self-auto">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
          />
          <div className="text-left">
            <h4 className="text-sm font-bold text-[#0B1F3A] leading-tight">{user.name}</h4>
            <span className="text-xs text-slate-500 font-medium">{user.role}</span>
          </div>
        </div>
      </div>

      {/* AI Alert banner: Only shows if user actually has matches */}
      {possibleMatchesCount > 0 && (
        <div className="bg-[#EAF3FF] border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0866E8] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0B1F3A]">
                AI Image Matches Found!
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Our vision matcher found potential matches for your reported campus item.
              </p>
            </div>
          </div>
          <Link
            to="/ai-matches"
            className="shrink-0 px-4 py-2 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span>View Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Lost Items Reported */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-sm transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] leading-tight">
              {lostCount}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Lost Items Reported
            </p>
          </div>
        </div>

        {/* Card 2: Found Item Reported */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-sm transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] leading-tight">
              {foundCount}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Found Item Reported
            </p>
          </div>
        </div>

        {/* Card 3: Active Claim */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-sm transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CheckSquare className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] leading-tight">
              {activeClaimsCount}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Active Claim
            </p>
          </div>
        </div>

        {/* Card 4: Possible Matches */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-sm transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0866E8] flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] leading-tight">
              {possibleMatchesCount}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Possible Matches
            </p>
          </div>
        </div>
      </div>

      {/* Recently Reported Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0B1F3A]">
            Recently Reported Items
          </h3>
          {recentItems.length > 0 && (
            <Link
              to="/reports"
              className="text-xs font-semibold text-[#0866E8] hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {recentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex items-center gap-4"
              >
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-base font-bold text-[#0B1F3A] truncate">
                      {item.name}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                      item.type === 'found' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {item.type === 'found' ? 'Found' : 'Lost'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  <Link
                    to={`/items/${item.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0866E8] hover:underline pt-1"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Clean Empty State */
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center space-y-3 shadow-xs">
            <PackageOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No Items Reported Recently</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't reported any lost or found items yet. Submit a report below to initiate automated campus matching.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/report/lost"
                className="px-4 py-2 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] text-white text-xs font-semibold shadow-xs"
              >
                + Report Lost Item
              </Link>
              <Link
                to="/report/found"
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#0866E8] border border-[#0866E8] text-xs font-semibold"
              >
                + Report Found Item
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Cards at bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <Link
          to="/report/lost"
          className="bg-white p-5 rounded-2xl border border-dashed border-[#0866E8]/40 hover:border-[#0866E8] bg-linear-to-r from-blue-50/50 to-white flex items-center justify-between group transition-all"
        >
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#0B1F3A]">Report a Lost Belonging</h4>
            <p className="text-xs text-slate-500">Provide details & photo to initiate campus scanning</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#0866E8] text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <Plus className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/report/found"
          className="bg-white p-5 rounded-2xl border border-dashed border-emerald-500/40 hover:border-emerald-500 bg-linear-to-r from-emerald-50/50 to-white flex items-center justify-between group transition-all"
        >
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#0B1F3A]">Found Something on Campus?</h4>
            <p className="text-xs text-slate-500">Help a fellow student or staff recover their belongings</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
        </Link>
      </div>
    </div>
  );
};
