import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { categories, campusLocations } from '../data/mockData';
import { Category, ItemType } from '../types';
import { 
  Upload, 
  X, 
  Sparkles, 
  Calendar as CalendarIcon, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  Image as ImageIcon 
} from 'lucide-react';

export const ReportPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItemReport } = useApp();

  const isFoundInitial = location.pathname.includes('/found');
  const [activeTab, setActiveTab] = useState<ItemType>(isFoundInitial ? 'found' : 'lost');

  // Clean initial state for new user report
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<Category>('Mobile Phone');
  const [itemLocation, setItemLocation] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  // Uploaded images state (empty by default)
  const [images, setImages] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSampleImage = () => {
    // Allows user to upload / add image preview
    setImages(prev => [
      ...prev,
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
    ]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // Add report to state
      addItemReport({
        name: itemName,
        type: activeTab,
        category,
        location: itemLocation,
        date: new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        description,
        images: images.length > 0 ? images : [
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80'
        ],
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

      {/* Main Form Card matching reference panel 4 */}
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
                  placeholder="e.g. iPhone 13"
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
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0866E8]/20 focus:border-[#0866E8] text-sm text-slate-900 bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location and Date side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Location *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={itemLocation}
                      onChange={(e) => setItemLocation(e.target.value)}
                      placeholder="e.g. Library"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0866E8]/20 focus:border-[#0866E8] text-sm text-slate-900"
                    />
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

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Black iPhone 13 with small scratch on back. Has transparent cover."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0866E8]/20 focus:border-[#0866E8] text-sm text-slate-900"
                />
              </div>

              {/* Campus Location shortcuts */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Suggested campus spots:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {campusLocations.slice(0, 5).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setItemLocation(loc)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
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
                    className="border-2 border-dashed border-[#E2E8F0] hover:border-[#0866E8] rounded-2xl p-4 flex flex-col items-center justify-center text-center aspect-square bg-slate-50 hover:bg-[#EAF3FF]/30 transition-all group"
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
                  <span>AI Pre-Analysis Active</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Upon submission, computer vision will match this photo against all found items registered on campus and calculate visual & metadata similarity scores.
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
