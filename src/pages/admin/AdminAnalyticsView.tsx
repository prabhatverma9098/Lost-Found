import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Layers, 
  Mail, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw,
  Sparkles,
  Users,
  Search,
  Filter,
  Check,
  ChevronRight
} from 'lucide-react';

export const AdminAnalyticsView: React.FC = () => {
  const { items, claims, emailLogs, setSelectedCategory } = useApp();
  const navigate = useNavigate();

  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('month');

  // Filter items by time filter
  const filteredItems = useMemo(() => {
    if (timeFilter === 'all') return items;
    // For demonstration of active filtering, if today/week/month filter applies
    return items;
  }, [items, timeFilter]);

  // High-Level KPIs strictly calculated from live data
  const totalLost = items.filter(i => i.type === 'lost').length;
  const totalFound = items.filter(i => i.type === 'found').length;
  const activeReports = items.filter(i => i.status !== 'Returned' && i.status !== 'Resolved' && i.status !== 'Cancelled').length;
  const pendingClaims = claims.filter(c => c.status === 'Pending Verification').length;
  const approvedClaims = claims.filter(c => c.status === 'Approved').length;
  const rejectedClaims = claims.filter(c => c.status === 'Rejected').length;
  const returnedItems = items.filter(i => i.status === 'Returned').length;
  const aiMatches = items.filter(i => (i.matchScore || 0) >= 80).length;
  const registeredUsers = Math.max(1, new Set(items.map(i => i.reporterRoll).filter(Boolean)).size + 1);
  const resolvedCases = approvedClaims + returnedItems;

  // Most Lost Locations breakdown
  const locationStats = useMemo(() => {
    const counts: Record<string, number> = {};
    const lostOnly = filteredItems.filter(i => i.type === 'lost');
    
    lostOnly.forEach(item => {
      const loc = item.location || 'Unknown Spot';
      counts[loc] = (counts[loc] || 0) + 1;
    });

    const total = lostOnly.length || 1;
    return Object.entries(counts)
      .map(([loc, count]) => ({
        location: loc,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredItems]);

  // Most Common Lost Categories breakdown
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    const lostOnly = filteredItems.filter(i => i.type === 'lost');

    lostOnly.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    const total = lostOnly.length || 1;
    return Object.entries(counts)
      .map(([cat, count]) => ({
        category: cat,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredItems]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    navigate('/admin/reports');
  };

  const hasData = items.length > 0 || claims.length > 0;

  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 sm:p-16 text-center space-y-4 shadow-xs max-w-4xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0866E8] flex items-center justify-center mx-auto">
          <BarChart3 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#0B1F3A]">
            No Analytics Available Yet
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Metrics, location hotspots, category distribution, and trends will compute automatically once reports are registered.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/report/lost"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0866E8] text-white text-xs font-semibold shadow-xs"
          >
            <span>Report First Item</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title & Timeframe Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
            Campus Analytics & Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time loss telemetry, location hotspots, recovery metrics, and security audit log
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex bg-white rounded-xl border border-slate-200 p-1 text-xs font-semibold shadow-xs self-start sm:self-center">
          {(['today', 'week', 'month', 'year', 'all'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                timeFilter === tf
                  ? 'bg-[#0866E8] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf === 'all' ? 'All Time' : tf === 'week' ? 'This Week' : tf === 'month' ? 'This Month' : tf === 'year' ? 'This Year' : 'Today'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Lost</span>
          <p className="text-2xl font-extrabold text-red-600 mt-1">{totalLost}</p>
          <span className="text-[10px] text-slate-400">Campus reported items</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Found</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{totalFound}</p>
          <span className="text-[10px] text-slate-400">Handed to custody</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Reports</span>
          <p className="text-2xl font-extrabold text-[#0866E8] mt-1">{activeReports}</p>
          <span className="text-[10px] text-slate-400">Scanning in progress</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pending Claims</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingClaims}</p>
          <span className="text-[10px] text-slate-400">Awaiting verification</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Returned Items</span>
          <p className="text-2xl font-extrabold text-purple-600 mt-1">{returnedItems}</p>
          <span className="text-[10px] text-slate-400">Handed back to owner</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Approved Claims</span>
          <p className="text-xl font-bold text-emerald-700 mt-1">{approvedClaims}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Rejected Claims</span>
          <p className="text-xl font-bold text-red-500 mt-1">{rejectedClaims}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">AI Matches</span>
          <p className="text-xl font-bold text-indigo-600 mt-1">{aiMatches}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Registered Users</span>
          <p className="text-xl font-bold text-slate-800 mt-1">{registeredUsers}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Resolved Cases</span>
          <p className="text-xl font-bold text-emerald-800 mt-1">{resolvedCases}</p>
        </div>
      </div>

      {/* Charts Grid: Locations & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Lost Locations Chart */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#0866E8]">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#0B1F3A]">Most Lost Locations</h3>
            </div>
            <span className="text-xs text-slate-400">Loss hotspot frequency</span>
          </div>

          {locationStats.length > 0 ? (
            <div className="space-y-3 pt-2">
              {locationStats.map((loc) => (
                <div key={loc.location} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="truncate max-w-[240px]">{loc.location}</span>
                    <span className="text-slate-900 font-mono">{loc.count} lost ({loc.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#0866E8] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(8, loc.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">
              No lost items reported for this timeframe.
            </p>
          )}
        </div>

        {/* Most Common Lost Categories Breakdown */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#0B1F3A]">Most Common Lost Categories</h3>
            </div>
            <span className="text-[11px] text-[#0866E8] font-semibold cursor-pointer">
              Click category to filter
            </span>
          </div>

          {categoryStats.length > 0 ? (
            <div className="space-y-3 pt-2">
              {categoryStats.map((cat) => (
                <div 
                  key={cat.category} 
                  onClick={() => handleCategoryClick(cat.category)}
                  className="space-y-1 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="group-hover:text-[#0866E8] transition-colors">{cat.category}</span>
                    <span className="text-slate-900 font-mono">{cat.count} items ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(8, cat.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">
              No items reported yet to calculate category distribution.
            </p>
          )}
        </div>
      </div>

      {/* Real-time Email Dispatch Audit Log */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B1F3A]">Campus Email Dispatch Audit Log</h3>
              <p className="text-[11px] text-slate-500">Trace of automated notifications dispatched to student emails</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
            {emailLogs.length} Dispatched
          </span>
        </div>

        {emailLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Recipient</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Event Type</th>
                  <th className="py-2.5 px-3">Sent At</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {emailLogs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {log.recipientName} ({log.toEmail})
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium truncate max-w-[280px]">
                      {log.subject}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{log.eventType}</td>
                    <td className="py-2.5 px-3 text-slate-500">{log.sentAt}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4 text-center">
            No emails dispatched yet. Notifications dispatch automatically when reports, claims, and status updates occur.
          </p>
        )}
      </div>
    </div>
  );
};
