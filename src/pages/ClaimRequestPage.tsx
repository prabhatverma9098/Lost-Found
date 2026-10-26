import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  FileCheck, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ClaimRequestPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { items, submitClaim } = useApp();

  const itemId = searchParams.get('itemId');
  const targetItem = items.find(i => i.id === itemId);

  // Clean empty inputs with helpful placeholders
  const [reason, setReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  // Upload proof previews
  const [proofs, setProofs] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSampleProof = () => {
    setProofs(prev => [
      ...prev,
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80'
    ]);
  };

  if (!targetItem) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 shadow-xs space-y-3">
          <h2 className="text-xl font-bold text-[#0B1F3A]">No Item Selected to Claim</h2>
          <p className="text-xs text-slate-500">
            Please browse found items on campus and select an item to file a verification claim.
          </p>
          <div className="pt-2">
            <Link
              to="/items"
              className="px-5 py-2.5 rounded-xl bg-[#0866E8] text-white text-xs font-semibold hover:bg-[#0652ba]"
            >
              Browse Found Items
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleRemoveProof = (idx: number) => {
    setProofs(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      submitClaim({
        itemId: targetItem.id,
        itemName: targetItem.name,
        itemImage: targetItem.images[0],
        reason,
        additionalDetails,
        proofs,
      });

      setIsSubmitting(false);
      navigate('/claims');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back navigation */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0866E8] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Item Details</span>
        </button>
      </div>

      {/* Target Item summary card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <img
            src={targetItem.images[0]}
            alt={targetItem.name}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200"
          />
          <div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Claiming: Found Item
            </span>
            <h3 className="text-base font-bold text-[#0B1F3A] mt-0.5">{targetItem.name}</h3>
            <p className="text-xs text-slate-500">{targetItem.location} • Found on {targetItem.date}</p>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-xs font-semibold text-slate-400 block">Reported By</span>
          <span className="text-xs font-bold text-slate-800">{targetItem.reportedBy}</span>
        </div>
      </div>

      {/* Claim Form matching reference panel 7 */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-2xl font-bold text-[#0B1F3A]">
              Submit Claim Request
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Please provide precise ownership details. Campus Proctors inspect these before releasing items.
            </p>
          </div>

          {/* Reason for Claim * */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reason for Claim *
            </label>
            <textarea
              rows={4}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain how, when and where you lost this item, including unique identifiers..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0866E8]/20 focus:border-[#0866E8] text-sm text-slate-900"
            />
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Additional Details
            </label>
            <input
              type="text"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="e.g. I can show the original bill and IMEI number."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0866E8]/20 focus:border-[#0866E8] text-sm text-slate-900"
            />
          </div>

          {/* Upload Proof (Optional) matching reference panel 7 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Upload Proof (Optional)
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Attach purchase bill, IMEI box screenshot, ID card, or previous photo of the item.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Proof thumbnail 1: Invoice / document */}
              {proofs.map((proofImg, index) => (
                <div
                  key={index}
                  className="relative rounded-xl border border-[#E2E8F0] overflow-hidden aspect-4/3 bg-slate-50 group shadow-xs"
                >
                  <img
                    src={proofImg}
                    alt={`Proof document ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveProof(index)}
                      className="p-1 rounded-md bg-white text-red-600 hover:bg-red-50 text-xs font-semibold"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px]">
                    {index === 0 ? 'Document Bill' : 'Device Photo'}
                  </span>
                </div>
              ))}

              {/* Add More card matching reference */}
              <button
                type="button"
                onClick={handleAddSampleProof}
                className="border-2 border-dashed border-[#E2E8F0] hover:border-[#0866E8] rounded-xl p-3 flex flex-col items-center justify-center text-center aspect-4/3 bg-slate-50 hover:bg-[#EAF3FF]/30 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 group-hover:bg-[#0866E8] group-hover:text-white flex items-center justify-center text-slate-500 mb-1 transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-[#0866E8]">
                  + Add More
                </span>
              </button>
            </div>
          </div>

          {/* Notice box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Your claim will be queued in the <strong>Proctorial Verification Queue</strong>. Once approved, you can collect the item at the Campus Security Central Desk by showing your Student ID.
            </p>
          </div>

          {/* Bottom-right Button: [ Submit Claim ] matching reference panel 7 */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] text-white font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <FileCheck className="w-4 h-4 animate-bounce" />
                  <span>Submitting Claim...</span>
                </>
              ) : (
                <span>Submit Claim</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
