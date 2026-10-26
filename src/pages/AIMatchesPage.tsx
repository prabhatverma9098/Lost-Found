import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  ChevronRight,
  Search,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AIMatchesPage: React.FC = () => {
  const location = useLocation();
  const { items } = useApp();

  const fromReport = location.state?.fromReport;
  const newItemName = location.state?.newItemName;

  // Filter real items in database that have match tiers or match scores
  const matchResults = items.filter(i => (i.matchScore || 0) > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Green Success Banner: Only shown if redirected after submitting a report */}
      {fromReport && (
        <div className="bg-[#EAFDF2] border border-emerald-200/90 rounded-2xl p-5 flex items-start sm:items-center gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-emerald-950">
              Report Submitted Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-800 mt-0.5">
              Our AI is now finding possible matches for your {newItemName || 'item'}...
            </p>
          </div>
        </div>
      )}

      {/* Heading */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] flex items-center gap-2">
            <span>AI Matching Results</span>
            {matchResults.length > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF3FF] text-[#0866E8] font-semibold border border-blue-200">
                {matchResults.length} Matched Item(s)
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Visual neural network compares reported images, category taxonomy, and campus location proximity.
          </p>
        </div>

        <Link
          to="/items"
          className="text-xs font-semibold text-[#0866E8] hover:underline hidden sm:flex items-center gap-1"
        >
          <span>Browse All Found Items</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* When match results exist, display them */}
      {matchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matchResults.map((item) => {
            const score = item.matchScore || 85;
            const isHigh = score >= 80;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#0B1F3A]">
                      Match Score: {score}%
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isHigh
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-amber-400 text-amber-950 shadow-xs'
                      }`}
                    >
                      {isHigh ? 'High Match' : 'Possible Match'}
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${isHigh ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <div className="w-28 h-32 sm:w-32 sm:h-36 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5 text-xs text-slate-600">
                      <h3 className="text-base font-bold text-[#0B1F3A]">
                        {item.name}
                      </h3>

                      <div className="flex items-center gap-2 text-slate-700 pt-1">
                        <span className="font-semibold text-slate-900">Date:</span>
                        <span>{item.date}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="font-semibold text-slate-900">Location:</span>
                        <span>{item.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="font-semibold text-slate-900">Reported by:</span>
                        <span>{item.reportedBy}</span>
                      </div>

                      <p className="text-[11px] text-slate-500 pt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 sm:px-6 pb-5 pt-2">
                  <Link
                    to={`/items/${item.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] text-white font-semibold text-xs text-center shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* CLEAN EMPTY STATE */
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 sm:p-16 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0866E8] flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 stroke-[1.8]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#0B1F3A]">No AI Matches Yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Our neural vision matcher compares newly reported lost items against all registered found items across campus. Report an item to trigger matching.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/report/lost"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Report Lost Item</span>
            </Link>
            <Link
              to="/items"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
            >
              <Search className="w-4 h-4" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
