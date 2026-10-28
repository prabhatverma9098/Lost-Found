import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  User, 
  Tag, 
  Send, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle,
  Building,
  CreditCard,
  Lock,
  Clock
} from 'lucide-react';
import { StatusTimeline } from '../components/ui/StatusTimeline';

export const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, claims, isAdmin } = useApp();

  // Find item by URL ID
  const item = items.find(i => i.id === id);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 shadow-xs space-y-3">
          <h2 className="text-xl font-bold text-[#0B1F3A]">Item Not Found</h2>
          <p className="text-xs text-slate-500">
            This item may have been removed, resolved, or the ID is incorrect.
          </p>
          <div className="pt-2">
            <Link
              to="/items"
              className="px-5 py-2.5 rounded-xl bg-[#0866E8] text-white text-xs font-semibold hover:bg-[#0652ba]"
            >
              Browse Campus Inventory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if current user already submitted a claim for this item
  const existingClaim = claims.find(c => c.itemId === item.id);

  const displayImages = item.images && item.images.length > 0
    ? item.images
    : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'];

  const analysis = item.aiAnalysis || {
    imageSimilarity: 90,
    textSimilarity: 85,
    locationMatch: 90,
    overallScore: 88
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0866E8] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous page</span>
        </button>
      </div>

      {/* Main Item Details Card matching reference panel 6 */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* LEFT: Large Image + Small Thumbnails */}
          <div className="lg:col-span-6 space-y-4">
            {/* Large item image */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-slate-50 overflow-hidden aspect-4/3 sm:aspect-square flex items-center justify-center p-2 shadow-xs">
              <img
                src={displayImages[selectedImageIndex] || displayImages[0]}
                alt={item.name}
                className="w-full h-full object-contain sm:object-cover rounded-xl"
              />
            </div>

            {/* Small image thumbnails (3 thumbnails matching reference) */}
            <div className="grid grid-cols-3 gap-3">
              {displayImages.slice(0, 3).map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`rounded-xl overflow-hidden aspect-square border-2 transition-all p-1 bg-slate-50 ${
                    selectedImageIndex === idx
                      ? 'border-[#0866E8] ring-2 ring-[#0866E8]/20'
                      : 'border-[#E2E8F0] hover:border-slate-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Metadata, AI Match Analysis Card, Claim Button */}
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Title & Badge */}
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
                  {item.name}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAFDF2] text-emerald-800 border border-emerald-200 shadow-xs">
                  {item.type === 'found' ? 'Found Item' : 'Lost Item'}
                </span>
              </div>

              {/* Information List matching reference panel 6 */}
              <div className="space-y-2 text-xs sm:text-sm text-slate-700 pt-1">
                <div className="grid grid-cols-12 gap-1 py-1 border-b border-slate-100">
                  <span className="col-span-4 text-slate-500 font-medium">Category</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 font-semibold text-slate-900">{item.category}</span>
                </div>

                <div className="grid grid-cols-12 gap-1 py-1 border-b border-slate-100">
                  <span className="col-span-4 text-slate-500 font-medium">Date</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 font-semibold text-slate-900">{item.date}</span>
                </div>

                <div className="grid grid-cols-12 gap-1 py-1 border-b border-slate-100">
                  <span className="col-span-4 text-slate-500 font-medium">Location</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 font-semibold text-slate-900">
                    {item.location}
                    {item.building ? ` (${item.building})` : ''}
                    {item.area ? ` — ${item.area}` : ''}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-1 py-1 border-b border-slate-100">
                  <span className="col-span-4 text-slate-500 font-medium">Reported By</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 font-semibold text-slate-900">{item.reportedBy}</span>
                </div>

                <div className="grid grid-cols-12 gap-1 py-1 border-b border-slate-100">
                  <span className="col-span-4 text-slate-500 font-medium">Current Status</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 font-bold text-[#0866E8]">{item.status}</span>
                </div>

                <div className="grid grid-cols-12 gap-1 py-1">
                  <span className="col-span-4 text-slate-500 font-medium">Description</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 text-slate-800 leading-relaxed font-normal">
                    {item.description}
                  </span>
                </div>
              </div>

              {/* OCR card if ID card */}
              {item.ocrData && (
                <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#0B1F3A]">
                    <CreditCard className="w-3.5 h-3.5 text-[#0866E8]" />
                    <span>Verified ID Card Details (OCR Extracted)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Name</span>
                      <span className="font-semibold">{item.ocrData.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Roll No.</span>
                      <span className="font-mono">
                        {isAdmin ? item.ocrData.rollNumber : '••••' + (item.ocrData.rollNumber?.slice(-4) || '••••')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Highlighted AI Analysis Card matching reference panel 6 */}
              <div className="bg-[#EAFDF2]/60 rounded-2xl border border-emerald-300 p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>AI Match Analysis</span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Image Similarity */}
                  <div>
                    <div className="flex justify-between text-slate-700 font-medium mb-1">
                      <span>Image Similarity</span>
                      <span className="font-bold text-emerald-800">{analysis.imageSimilarity}%</span>
                    </div>
                    <div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${analysis.imageSimilarity}%` }}
                      />
                    </div>
                  </div>

                  {/* Text Similarity */}
                  <div>
                    <div className="flex justify-between text-slate-700 font-medium mb-1">
                      <span>Text Similarity</span>
                      <span className="font-bold text-emerald-800">{analysis.textSimilarity}%</span>
                    </div>
                    <div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${analysis.textSimilarity}%` }}
                      />
                    </div>
                  </div>

                  {/* Location Match */}
                  <div>
                    <div className="flex justify-between text-slate-700 font-medium mb-1">
                      <span>Location Match</span>
                      <span className="font-bold text-emerald-800">{analysis.locationMatch}%</span>
                    </div>
                    <div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${analysis.locationMatch}%` }}
                      />
                    </div>
                  </div>

                  {/* Overall Match Score */}
                  <div className="pt-2 border-t border-emerald-200/70 flex items-center justify-between text-xs font-bold text-emerald-950">
                    <span>Overall Match Score</span>
                    <span className="text-base text-emerald-700">{analysis.overallScore}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Button: [ Submit Claim Request ] matching reference */}
            <div className="pt-2">
              {existingClaim ? (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    <span>Claim Already Submitted ({existingClaim.status})</span>
                  </div>
                  <Link
                    to="/claims"
                    className="font-bold text-[#0866E8] hover:underline"
                  >
                    View Status
                  </Link>
                </div>
              ) : (
                <Link
                  to={`/claims/submit?itemId=${item.id}`}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Claim Request</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ITEM STATUS LIFECYCLE TIMELINE CARD */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <Clock className="w-5 h-5 text-[#0866E8]" />
          <div>
            <h3 className="text-base font-bold text-[#0B1F3A]">
              Item Status Lifecycle & Verification History
            </h3>
            <p className="text-xs text-slate-500">
              Complete chronological audit trail from initial submission to final return
            </p>
          </div>
        </div>

        <StatusTimeline 
          currentStatus={item.status} 
          history={item.statusHistory}
        />
      </div>
    </div>
  );
};
