import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';

export const MyClaimsPage: React.FC = () => {
  const { claims, items } = useApp();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A] tracking-tight">
            My Claims
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track claims submitted to the campus security proctors. Once verified, visit Central Security to retrieve your item.
          </p>
        </div>

        <Link
          to="/items"
          className="px-4 py-2 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] text-white text-xs font-semibold shadow-xs"
        >
          Browse More Items
        </Link>
      </div>

      {/* Claims List */}
      {claims.length > 0 ? (
        <div className="space-y-4">
          {claims.map((claim) => {
            const statusConfig = {
              'Pending Verification': {
                icon: <Clock className="w-4 h-4 text-amber-600" />,
                badge: 'bg-amber-50 text-amber-800 border-amber-200',
                desc: 'Your claim request is currently being reviewed by Proctorial security officers.',
              },
              'Approved': {
                icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
                badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                desc: 'Claim authorized! Please bring your physical Student ID to Central Security Desk (Admin Block Room 104) to collect your item.',
              },
              'Rejected': {
                icon: <XCircle className="w-4 h-4 text-red-600" />,
                badge: 'bg-red-50 text-red-800 border-red-200',
                desc: 'Claim was not approved because provided proofs did not match verified device identifiers.',
              },
              'More Information Required': {
                icon: <AlertCircle className="w-4 h-4 text-blue-600" />,
                badge: 'bg-blue-50 text-blue-800 border-blue-200',
                desc: 'Additional verification needed. Please check the admin note and provide supplementary documents.',
              },
            }[claim.status];

            return (
              <div
                key={claim.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-4 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <img
                      src={claim.itemImage}
                      alt={claim.itemName}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-[#0B1F3A]">{claim.itemName}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Claimed on: <strong className="text-slate-700">{claim.claimDate}</strong>
                      </p>
                      <p className="text-xs text-slate-500">
                        Claimant: {claim.claimedBy} ({claim.claimerRoll})
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusConfig.badge}`}>
                      {statusConfig.icon}
                      <span>{claim.status}</span>
                    </span>
                  </div>
                </div>

                {/* Reason & Details */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-700 shrink-0">Your Stated Reason:</span>
                    <span className="text-slate-600 italic">"{claim.reason}"</span>
                  </div>

                  {claim.additionalDetails && (
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-slate-700 shrink-0">Additional Info:</span>
                      <span className="text-slate-600">{claim.additionalDetails}</span>
                    </div>
                  )}

                  {claim.adminNotes && (
                    <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-slate-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Admin Resolution Note: </span>
                        <span>{claim.adminNotes}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Guidance Banner */}
                <div className="flex items-start gap-2.5 text-xs text-slate-600 pt-1">
                  <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p>{statusConfig.desc}</p>
                </div>

                {/* Proofs preview row */}
                {claim.proofs && claim.proofs.length > 0 && (
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Uploaded Proofs ({claim.proofs.length}):
                    </span>
                    <div className="flex gap-2">
                      {claim.proofs.map((proof, idx) => (
                        <a
                          key={idx}
                          href={proof}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 hover:opacity-80 transition-opacity"
                        >
                          <img src={proof} alt="Proof" className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center space-y-3">
          <CheckSquare className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">No claims submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            If you see an item in the found catalog or through AI matching that belongs to you, submit a claim request.
          </p>
          <Link
            to="/items"
            className="inline-block px-4 py-2 rounded-xl bg-[#0866E8] text-white text-xs font-semibold"
          >
            Browse Found Items
          </Link>
        </div>
      )}
    </div>
  );
};
