import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  Clock,
  Eye
} from 'lucide-react';

export const MyReportsPage: React.FC = () => {
  const { items, user } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found' | 'resolved'>('all');

  // Filter reports reported by current user session
  const userReports = items.filter(i => {
    const isReporter = i.reportedBy.includes(user.name) || i.reporterRoll === user.rollNo || user.role === 'Admin';
    if (!isReporter) return false;

    if (activeTab === 'lost') return i.type === 'lost';
    if (activeTab === 'found') return i.type === 'found';
    if (activeTab === 'resolved') return i.status === 'Resolved' || i.status === 'Claimed';
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A] tracking-tight">
            My Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track all lost and found reports registered under your student profile ({user.rollNo}).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/report/lost"
            className="px-4 py-2 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Report Lost</span>
          </Link>
          <Link
            to="/report/found"
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#0866E8] border border-[#0866E8] text-xs font-semibold"
          >
            Report Found
          </Link>
        </div>
      </div>

      {/* Tabs: All | Lost | Found | Resolved */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-1.5 shadow-xs flex max-w-md">
        {(['all', 'lost', 'found', 'resolved'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl capitalize transition-all ${
              activeTab === tab
                ? 'bg-[#EAF3FF] text-[#0866E8]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table / List */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {userReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-5">Item</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">AI Matches</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={report.images[0]}
                          alt={report.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-tight">
                            {report.name}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          report.type === 'found'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {report.type === 'found' ? 'Found' : 'Lost'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-700 font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{report.location}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{report.date}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-[#0866E8] border border-blue-200 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{report.status}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {report.matchScore ? (
                        <Link
                          to="/ai-matches"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-100 transition-colors"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{report.matchScore}% Match</span>
                        </Link>
                      ) : (
                        <span className="text-slate-400 font-medium">Scanning...</span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <Link
                        to={`/items/${report.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0866E8] hover:text-white text-slate-700 font-semibold transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No reports found under this category.</p>
            <Link
              to="/report/lost"
              className="inline-block px-4 py-2 rounded-xl bg-[#0866E8] text-white text-xs font-semibold"
            >
              Report a Lost Item Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
