import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { categories, campusLocations } from '../data/mockData';
import { Category, ItemType, IDCardOCRData } from '../types';
import { 
  Upload, 
  X, 
  Sparkles, 
  Calendar as CalendarIcon, 
  MapPin, 
  Building,
  Plus, 
  CreditCard,
  Edit2,
  Check,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { campusLocationDirectory } from '../services/locationMatching';
import { extractIDCardInformation } from '../services/ocrService';

export const ReportPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItemReport } = useApp();

  const isFoundInitial = location.pathname.includes('/found');
  const [activeTab, setActiveTab] = useState<ItemType>(isFoundInitial ? 'found' : 'lost');

  // Form state
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<Category>('Mobile Phone');
  const [itemLocation, setItemLocation] = useState(campusLocations[0] || 'Central Library');
  const [building, setBuilding] = useState('Academic Block A');
  const [area, setArea] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  // Uploaded images state
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OCR state for ID Cards
  const [ocrData, setOcrData] = useState<IDCardOCRData | null>(null);
  const [isOcrEditing, setIsOcrEditing] = useState(false);
  const [isScanningOCR, setIsScanningOCR] = useState(false);

  // When location changes, update building automatically if in directory
  const handleLocationChange = (loc: string) => {
    setItemLocation(loc);
    const meta = campusLocationDirectory[loc];
    if (meta) {
      setBuilding(meta.building);
      if (!area) setArea(meta.area);
    }
  };

  const handleAddSampleImage = () => {
    // Allows user to upload / add image preview
    const sampleImage = category === 'ID Card & Wallets'
      ? 'https://images.unsplash.com/photo-1589330694653-dad6ef0140be?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

    setImages(prev => [...prev, sampleImage]);

    // If ID card category, auto-trigger OCR simulation
    if (category === 'ID Card & Wallets' && !ocrData) {
      runOcrScan();
    }
  };

  const runOcrScan = async () => {
    setIsScanningOCR(true);
    try {
      const extracted = await extractIDCardInformation(description || 'AKS University Student Card');
      setOcrData(extracted);
      if (!itemName) setItemName(`University ID Card (${extracted.name})`);
    } catch {
      // fallback
    } finally {
      setIsScanningOCR(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const meta = campusLocationDirectory[itemLocation];

    setTimeout(() => {
      // Add report to state
      addItemReport({
        name: itemName,
        type: activeTab,
        category,
        location: itemLocation,
        building: building || meta?.building,
        area: area || meta?.area,
        latitude: meta?.lat,
        longitude: meta?.lng,
        date: new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        description,
        images: images.length > 0 ? images : [
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80'
        ],
        ocrData: ocrData || undefined,
      });

      setIsSubmitting(false);
      // Navigate to AI matching results page (Panel 5)
      navigate('/ai-matches', { state: { newItemName: itemName, fromReport: true } });
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Tabs matching reference panel 4 */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-1.5 shadow-xs flex">
        <button
          type="button"
          onClick={() => setActiveTab('lost')}
          className={`flex-1 py-3 text-center text-sm font-semibold rounded-xl transition-all relative ${
            activeTab === 'lost'
              ? 'text-[#0866E8] bg-[#EAF3FF]'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Report Lost Item</span>
          {activeTab === 'lost' && (
            <span className="absolute bottom-1 left-1/4 right-1/4 h-0.5 bg-[#0866E8] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('found')}
          className={`flex-1 py-3 text-center text-sm font-semibold rounded-xl transition-all relative ${
            activeTab === 'found'
              ? 'text-[#0866E8] bg-[#EAF3FF]'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Report Found Item</span>
          {activeTab === 'found' && (
            <span className="absolute bottom-1 left-1/4 right-1/4 h-0.5 bg-[#0866E8] rounded-full" />
          )}
        </button>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: Input Fields */}
            <div className="lg:col-span-7 space-y-5">
              {/* Item Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. iPhone 13 or Student ID Card"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0866E8]/20 focus:border-[#0866E8] text-sm text-slate-900"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    const newCat = e.target.value as Category;
                    setCategory(newCat);
                    if (newCat === 'ID Card & Wallets' && !ocrData) {
                      runOcrScan();
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0866E8]/20 focus:border-[#0866E8] text-sm text-slate-900 bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Campus Location *
                  </label>
                  <div className="relative">
                    <select
                      value={itemLocation}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0866E8]/20 focus:border-[#0866E8] text-sm text-slate-900 bg-white"
                    >
                      {campusLocations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0866E8]/20 focus:border-[#0866E8] text-sm text-slate-900 bg-white"
                    />
                    <CalendarIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Building & Specific Area for Intelligent Location Matching */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    <span>Campus Building / Complex</span>
                  </label>
                  <input
                    type="text"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    placeholder="e.g. Academic Block A"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Specific Room / Hall / Area (Optional)
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Reading Hall 2nd Floor, Desk 14"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe unique marks, color, scratches, brand, case, or sticker..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0866E8]/20 focus:border-[#0866E8] text-sm text-slate-900"
                />
              </div>

              {/* ID CARD OCR SCANNER & EXTRACTOR (When ID card category selected) */}
              {category === 'ID Card & Wallets' && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#0866E8] text-white">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0B1F3A]">
                          University ID Card OCR Extractor (AI Vision)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Automatically extracts student identity attributes from uploaded card
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {ocrData && (
                        <button
                          type="button"
                          onClick={() => setIsOcrEditing(!isOcrEditing)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 text-xs font-semibold flex items-center gap-1 shadow-xs"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>{isOcrEditing ? 'Done Editing' : 'Edit Information'}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={runOcrScan}
                        disabled={isScanningOCR}
                        className="px-2.5 py-1 rounded-lg bg-[#0866E8] text-white hover:bg-[#0652ba] text-xs font-semibold flex items-center gap-1 shadow-xs disabled:opacity-50"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{isScanningOCR ? 'Scanning...' : 'Re-Scan ID'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Extracted Fields Preview */}
                  {ocrData ? (
                    <div className="bg-white rounded-xl p-3.5 border border-blue-100 space-y-2.5">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Student Name</span>
                          {isOcrEditing ? (
                            <input
                              type="text"
                              value={ocrData.name}
                              onChange={(e) => setOcrData({ ...ocrData, name: e.target.value })}
                              className="mt-1 w-full px-2 py-1 text-xs border rounded bg-slate-50"
                            />
                          ) : (
                            <span className="font-semibold text-slate-800">{ocrData.name}</span>
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Roll Number</span>
                          {isOcrEditing ? (
                            <input
                              type="text"
                              value={ocrData.rollNumber}
                              onChange={(e) => setOcrData({ ...ocrData, rollNumber: e.target.value })}
                              className="mt-1 w-full px-2 py-1 text-xs border rounded bg-slate-50"
                            />
                          ) : (
                            <span className="font-semibold text-slate-800 font-mono">{ocrData.rollNumber}</span>
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Student ID</span>
                          {isOcrEditing ? (
                            <input
                              type="text"
                              value={ocrData.studentId}
                              onChange={(e) => setOcrData({ ...ocrData, studentId: e.target.value })}
                              className="mt-1 w-full px-2 py-1 text-xs border rounded bg-slate-50"
                            />
                          ) : (
                            <span className="font-semibold text-slate-800 font-mono">{ocrData.studentId}</span>
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                          {isOcrEditing ? (
                            <input
                              type="text"
                              value={ocrData.department}
                              onChange={(e) => setOcrData({ ...ocrData, department: e.target.value })}
                              className="mt-1 w-full px-2 py-1 text-xs border rounded bg-slate-50"
                            />
                          ) : (
                            <span className="text-slate-700">{ocrData.department}</span>
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Year / Batch</span>
                          {isOcrEditing ? (
                            <input
                              type="text"
                              value={ocrData.year}
                              onChange={(e) => setOcrData({ ...ocrData, year: e.target.value })}
                              className="mt-1 w-full px-2 py-1 text-xs border rounded bg-slate-50"
                            />
                          ) : (
                            <span className="text-slate-700">{ocrData.year}</span>
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">University</span>
                          {isOcrEditing ? (
                            <input
                              type="text"
                              value={ocrData.universityName}
                              onChange={(e) => setOcrData({ ...ocrData, universityName: e.target.value })}
                              className="mt-1 w-full px-2 py-1 text-xs border rounded bg-slate-50"
                            />
                          ) : (
                            <span className="text-slate-700">{ocrData.universityName}</span>
                          )}
                        </div>
                      </div>

                      {/* Privacy masking badge */}
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Student Roll & ID numbers are automatically masked from the public catalog for privacy.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-white/70 rounded-xl border border-dashed border-blue-200 text-center text-xs text-slate-500">
                      Upload an ID card photo or click "Re-Scan ID" to extract cardholder identity.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Image Upload Area matching reference */}
            <div className="lg:col-span-5 space-y-4">
              <label className="block text-xs font-semibold text-slate-700">
                Upload Images *
              </label>

              {/* Upload Drop Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Uploaded Image Preview Card with controls */}
                {images.length > 0 ? (
                  <div className="relative rounded-2xl border border-[#E2E8F0] overflow-hidden bg-slate-50 aspect-square group shadow-xs">
                    <img
                      src={images[0]}
                      alt="Uploaded item"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(0)}
                        className="p-1.5 rounded-lg bg-white/90 text-red-600 hover:bg-white text-xs font-semibold"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                      Primary Photo
                    </span>
                  </div>
                ) : (
                  <div
                    onClick={handleAddSampleImage}
                    className="cursor-pointer border-2 border-dashed border-[#0866E8]/40 hover:border-[#0866E8] rounded-2xl p-4 flex flex-col items-center justify-center text-center aspect-square bg-[#EAF3FF]/40 hover:bg-[#EAF3FF] transition-all"
                  >
                    <Upload className="w-7 h-7 text-[#0866E8] mb-2" />
                    <span className="text-xs font-semibold text-[#0866E8]">Upload Primary Image</span>
                    <span className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 10MB</span>
                  </div>
                )}

                {/* Second slot: + Add More Images dashed card */}
                {images.length > 1 ? (
                  <div className="relative rounded-2xl border border-[#E2E8F0] overflow-hidden bg-slate-50 aspect-square group shadow-xs">
                    <img
                      src={images[1]}
                      alt="Second photo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(1)}
                        className="p-1.5 rounded-lg bg-white/90 text-red-600 hover:bg-white text-xs font-semibold"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddSampleImage}
                    className="border-2 border-dashed border-[#E2E8F0] hover:border-[#0866E8] rounded-2xl p-4 flex flex-col items-center justify-center text-center aspect-square bg-slate-50 hover:bg-[#EAF3FF]/30 transition-all group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-200 group-hover:bg-[#0866E8] group-hover:text-white flex items-center justify-center text-slate-500 mb-2 transition-colors">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-[#0866E8]">
                      + Add More Images
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Scratches, serial, back</span>
                  </button>
                )}
              </div>

              {/* AI Neural Feature Extraction Preview Pill */}
              <div className="bg-[#EAF3FF] border border-blue-200/80 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0866E8]">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Pre-Analysis & Location Match Active</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Upon submission, computer vision and location coordinates match this report against registered items across building zones (Image 40% + Text 35% + Location 25%).
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Submit Button matching reference */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Processing with AI...</span>
                </>
              ) : (
                <span>Submit Report</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
