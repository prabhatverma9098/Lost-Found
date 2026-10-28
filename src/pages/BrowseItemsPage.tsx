import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { categories, campusLocations } from '../data/mockData';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Tag, 
  Sparkles, 
  ChevronRight, 
  RotateCcw,
  Sparkle,
  X,
  Cpu
} from 'lucide-react';
import { parseNaturalLanguageQuery } from '../services/naturalLanguageSearch';
import { sanitizePublicItemDescription } from '../services/ocrService';
import { NaturalLanguageInterpretation } from '../types';

export const BrowseItemsPage: React.FC = () => {
  const { 
    items, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    selectedLocation,
    setSelectedLocation
  } = useApp();

  const [nlQuery, setNlQuery] = useState('');
  const [isAnalyzingNL, setIsAnalyzingNL] = useState(false);
  const [nlInterpretation, setNlInterpretation] = useState<NaturalLanguageInterpretation | null>(null);

  // Debounce Natural Language interpretation
  useEffect(() => {
    if (!nlQuery.trim()) {
      setNlInterpretation(null);
      setIsAnalyzingNL(false);
      return;
    }

    setIsAnalyzingNL(true);
    const timer = setTimeout(() => {
      const result = parseNaturalLanguageQuery(nlQuery);
      setNlInterpretation(result);
      setIsAnalyzingNL(false);

      // Apply detected filters smoothly
      if (result.detectedCategory) setSelectedCategory(result.detectedCategory);
      if (result.detectedLocation) setSelectedLocation(result.detectedLocation);
      if (result.detectedType) setSelectedStatus(result.detectedType === 'lost' ? 'Lost' : 'Found');
      if (result.keywords.length > 0) setSearchQuery(result.keywords.join(' '));
    }, 450);

    return () => clearTimeout(timer);
  }, [nlQuery, setSelectedCategory, setSelectedLocation, setSelectedStatus, setSearchQuery]);

  const removeChip = (field: string) => {
    if (field === 'category') setSelectedCategory('All');
    if (field === 'location') setSelectedLocation('All');
    if (field === 'type') setSelectedStatus('All');
    if (field === 'color' || field === 'keyword') setSearchQuery('');
    
    if (nlInterpretation) {
      setNlInterpretation({
        ...nlInterpretation,
        interpretedChips: nlInterpretation.interpretedChips.filter(c => c.field !== field)
      });
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Category match
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }

    // Status / Type match
    if (selectedStatus === 'Lost' && item.type !== 'lost') return false;
    if (selectedStatus === 'Found' && item.type !== 'found') return false;

    // Location match
    if (selectedLocation !== 'All' && !item.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
      return false;
    }

    return true;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setNlQuery('');
    setNlInterpretation(null);
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedLocation('All');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A] tracking-tight">
            Browse Lost & Found Items
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search items reported across all campus locations. Filter by type, category, or natural language query.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/report/lost"
            className="px-4 py-2 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            + Report Lost
          </Link>
          <Link
            to="/report/found"
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#0866E8] border border-[#0866E8] text-xs font-semibold transition-colors"
          >
            + Report Found
          </Link>
        </div>
      </div>

      {/* AI Natural Language Search Box */}
      <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 border border-blue-100 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#0866E8] text-white">
              <Sparkle className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider">
              AI Natural Language Search (English & Hinglish)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Try: "Mera black bag library ke paas mila tha"
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={nlQuery}
            onChange={(e) => setNlQuery(e.target.value)}
            placeholder="Type naturally, e.g. 'Found black water bottle near canteen yesterday' or 'Mera ID card library me kho gaya'..."
            className="w-full pl-4 pr-10 py-3 rounded-xl bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#0866E8]/20 focus:border-[#0866E8] text-sm text-slate-900 placeholder:text-slate-400 shadow-xs"
          />
          {nlQuery && (
            <button
              onClick={() => {
                setNlQuery('');
                setNlInterpretation(null);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Parsing state indicator */}
        {isAnalyzingNL && (
          <div className="flex items-center gap-2 mt-2.5 text-xs text-blue-700 font-medium animate-pulse">
            <Cpu className="w-3.5 h-3.5 animate-spin" />
            <span>Understanding your search query & extracting campus filters...</span>
          </div>
        )}

        {/* Interpreted Filter Chips */}
        {nlInterpretation && nlInterpretation.interpretedChips.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-blue-100">
            <span className="text-[11px] font-semibold text-slate-600">Interpreted Filters:</span>
            {nlInterpretation.interpretedChips.map((chip) => (
              <span
                key={chip.field}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-blue-200 text-[#0866E8] shadow-xs"
              >
                <span>{chip.label}</span>
                <button
                  onClick={() => removeChip(chip.field)}
                  className="hover:text-red-500 rounded-full p-0.5"
                  title="Remove filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Standard Search and Filter Controls */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name, keywords, brand, location..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0866E8]/20 focus:border-[#0866E8] text-sm text-slate-900 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Row: Type, Category, Location */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
          {/* Status / Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Item Type
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs font-medium text-slate-800 bg-white"
            >
              <option value="All">All Items (Lost & Found)</option>
              <option value="Lost">Lost Only</option>
              <option value="Found">Found Only</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs font-medium text-slate-800 bg-white"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Campus Location */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Campus Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs font-medium text-slate-800 bg-white"
            >
              <option value="All">All Campus Spots</option>
              {campusLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing {filteredItems.length} registered item(s)</span>
        {(selectedCategory !== 'All' || selectedStatus !== 'All' || selectedLocation !== 'All' || searchQuery || nlQuery) && (
          <span className="text-[#0866E8] font-semibold">Active filter applied</span>
        )}
      </div>

      {/* Grid of Item Cards */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs ${
                      item.type === 'found'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                  >
                    {item.type === 'found' ? 'Found' : 'Lost'}
                  </span>

                  {item.matchScore && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF3FF] text-[#0866E8] border border-blue-200 flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      {item.matchScore}% Match
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-[#0B1F3A] group-hover:text-[#0866E8] transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  {/* Redacted description for ID Card privacy */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {sanitizePublicItemDescription(item.description, item.category === 'ID Card & Wallets')}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-700">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-5 pt-0">
                <Link
                  to={`/items/${item.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-[#0866E8] text-slate-700 hover:text-white font-semibold text-xs transition-all border border-slate-200 hover:border-[#0866E8] flex items-center justify-center gap-1.5"
                >
                  <span>View Details & Timeline</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center space-y-3 shadow-xs">
          <p className="text-base font-bold text-[#0B1F3A]">No Campus Items in Inventory Yet</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            The campus lost and found database is currently empty. Report an item below to register it in the public catalog.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/report/lost"
              className="px-4 py-2 rounded-xl bg-[#0866E8] text-white text-xs font-semibold shadow-xs hover:bg-[#0652ba]"
            >
              Report Lost Item
            </Link>
            <Link
              to="/report/found"
              className="px-4 py-2 rounded-xl bg-white border border-[#0866E8] text-[#0866E8] text-xs font-semibold hover:bg-slate-50"
            >
              Report Found Item
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center space-y-3">
          <p className="text-base font-semibold text-slate-700">No items match your search filters.</p>
          <p className="text-xs text-slate-500">Try adjusting your keyword or reset filters to see all campus reports.</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-[#0866E8] text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
