import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { ClaimStatus } from '../types';
import { 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  ShieldCheck, 
  User, 
  Calendar, 
  Sparkles, 
  Check, 
  ExternalLink,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

export const AdminPanelPage: React.FC = () => {
  const { claims, updateClaimStatus, items } = useApp();

  const [selectedClaimId, setSelectedClaimId] = useState<string>(claims[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'details' | 'proof' | 'ai'>('details');
  const [moreInfoInput, setMoreInfoInput] = useState('');
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);

  const selectedClaim = claims.find(c => c.id === selectedClaimId) || claims[0];

  const handleApprove = () => {
    if (!selectedClaim) return;
    updateClaimStatus(selectedClaim.id, 'Approved', 'Verified against student ID and purchase invoice at Proctor desk.');
  };

  const handleReject = () => {
    if (!selectedClaim) return;
    updateClaimStatus(selectedClaim.id, 'Rejected', 'Serial number and physical appearance did not match claimant specs.');
  };

  const handleRequestInfoSubmit = () => {
    if (!selectedClaim) return;
    updateClaimStatus(
      selectedClaim.id, 
      'More Information Required', 
      moreInfoInput || 'Please bring your physical ID and invoice to Proctorial Office Room 104.'
    );
    setShowMoreInfoModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
            Verify Claim Request
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review claimant statements, uploaded proof, and AI vision similarity scores before authorization.
          </p>
        </div>

        {/* Claim Queue Switcher */}
        {claims.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Queue:</span>
            <select
              value={selectedClaim?.id}
              onChange={(e) => setSelectedClaimId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-slate-800 bg-white"
            >
              {claims.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.itemName} ({c.claimedBy} - {c.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedClaim ? (
        /* Main Claim Verification Card */
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header Row: Image, Name, Claimed By, Roll No, Claim Date, Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                <img
                  src={selectedClaim.itemImage}
                  alt={selectedClaim.itemName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#0B1F3A]">
                  {selectedClaim.itemName}
                </h3>
                <div className="text-xs text-slate-600 space-y-0.5">
                  <p>
                    <span className="text-slate-400 font-medium">Claimed by: </span>
                    <strong className="text-slate-900">{selectedClaim.claimedBy}</strong>
                  </p>
                  <p>
                    <span className="text-slate-400 font-medium">Roll No: </span>
                    <span className="font-semibold text-slate-800">{selectedClaim.claimerRoll}</span>
                  </p>
                  <p>
                    <span className="text-slate-400 font-medium">Claim Date: </span>
                    <span className="text-slate-700">{selectedClaim.claimDate}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="self-start sm:self-center">
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs ${
                  selectedClaim.status === 'Pending Verification'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : selectedClaim.status === 'Approved'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : selectedClaim.status === 'Rejected'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-blue-100 text-[#0866E8] border border-blue-200'
                }`}
              >
                {selectedClaim.status}
              </span>
            </div>
          </div>

          {/* Verification Tabs */}
          <div className="flex border-b border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-all relative ${
                activeTab === 'details'
                  ? 'text-[#0866E8]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Claim Details
              {activeTab === 'details' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0866E8] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('proof')}
              className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-all relative ${
                activeTab === 'proof'
                  ? 'text-[#0866E8]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              User Proof
              {activeTab === 'proof' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0866E8] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-all relative ${
                activeTab === 'ai'
                  ? 'text-[#0866E8]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              AI Match Summary
              {activeTab === 'ai' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0866E8] rounded-full" />
              )}
            </button>
          </div>

          {/* TAB 1: Claim Details */}
          {activeTab === 'details' && (
            <div className="space-y-4 py-2">
              <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200/80">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                  Claimant Statement:
                </p>
                <blockquote className="text-sm sm:text-base text-slate-800 italic leading-relaxed pl-3 border-l-2 border-[#0866E8]">
                  "{selectedClaim.reason}"
                </blockquote>
              </div>

              {selectedClaim.additionalDetails && (
                <div className="bg-white rounded-xl p-4 border border-[#E2E8F0]">
                  <p className="text-xs text-slate-500 font-semibold mb-1">
                    Additional Ownership Indicators:
                  </p>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium">
                    {selectedClaim.additionalDetails}
                  </p>
                </div>
              )}

              {selectedClaim.adminNotes && (
                <div className="bg-blue-50/60 rounded-xl p-3.5 border border-blue-200 text-xs">
                  <span className="font-bold text-[#0866E8] block mb-1">Admin Audit Log:</span>
                  <p className="text-slate-700">{selectedClaim.adminNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: User Proof */}
          {activeTab === 'proof' && (
            <div className="space-y-4 py-2">
              {selectedClaim.proofs && selectedClaim.proofs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedClaim.proofs.map((proofUrl, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[#E2E8F0] p-3 bg-slate-50 space-y-2"
                    >
                      <div className="h-44 rounded-lg overflow-hidden bg-white border border-slate-200">
                        <img
                          src={proofUrl}
                          alt={`Proof ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span className="font-semibold">Uploaded Ownership Proof #{index + 1}</span>
                        <a
                          href={proofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0866E8] hover:underline flex items-center gap-1 font-medium"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-4">No additional documents uploaded with this claim.</p>
              )}
            </div>
          )}

          {/* TAB 3: AI Match Summary */}
          {activeTab === 'ai' && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#EAF3FF] p-4 rounded-xl border border-blue-200 text-center">
                  <span className="text-xs text-slate-600 block">Overall Score</span>
                  <span className="text-2xl font-extrabold text-[#0866E8]">
                    {selectedClaim.aiMatchSummary?.overallScore || 90}%
                  </span>
                </div>
                <div className="bg-[#EAFDF2] p-4 rounded-xl border border-emerald-200 text-center">
                  <span className="text-xs text-slate-600 block">Image Similarity</span>
                  <span className="text-2xl font-extrabold text-emerald-700">
                    {selectedClaim.aiMatchSummary?.imageSimilarity || 92}%
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-600 block">Location Match</span>
                  <span className="text-base font-bold text-slate-800">
                    100% Proximity
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-800 block">Proctorial System Recommendation:</span>
                <p className="text-slate-600 leading-relaxed">
                  {selectedClaim.aiMatchSummary?.recommendation ||
                    'Ownership details submitted. Awaiting Proctorial review.'}
                </p>
              </div>
            </div>
          )}

          {/* Bottom Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleApprove}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Approve Claim</span>
            </button>

            <button
              type="button"
              onClick={handleReject}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject Claim</span>
            </button>

            <button
              type="button"
              onClick={() => setShowMoreInfoModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Request More Info</span>
            </button>
          </div>
        </div>
      ) : (
        /* CLEAN EMPTY STATE WHEN 0 CLAIMS IN QUEUE */
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 sm:p-16 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ClipboardList className="w-8 h-8 stroke-[1.8]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#0B1F3A]">
              No Claims in Verification Queue
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              There are currently no pending claim requests from students. When students submit ownership claims for found items, they will appear here.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/admin/reports"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] text-white text-xs font-semibold shadow-xs"
            >
              <span>Manage Campus Reports</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Request More Info Modal */}
      {showMoreInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#0B1F3A]">Request Additional Proof</h3>
            <p className="text-xs text-slate-600">
              Specify what additional documentation or physical verification is required from {selectedClaim?.claimedBy}:
            </p>
            <textarea
              rows={3}
              value={moreInfoInput}
              onChange={(e) => setMoreInfoInput(e.target.value)}
              placeholder="e.g. Please bring original physical purchase bill and student ID card to Room 104..."
              className="w-full p-3 rounded-xl border border-[#E2E8F0] text-xs focus:ring-2 focus:ring-[#0866E8]/20 focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowMoreInfoModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestInfoSubmit}
                className="px-4 py-2 rounded-lg bg-[#0866E8] text-white text-xs font-semibold hover:bg-[#0652ba]"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
