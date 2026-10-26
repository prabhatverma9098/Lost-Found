import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Brain,
  Smartphone,
  Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HomePage: React.FC = () => {
  const { items } = useApp();

  const recentItems = items.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Subtext, CTAs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-[#0B1F3A] leading-tight">
                  Lost Something? <br />
                  <span className="text-[#0866E8]">We Can Help!</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-xl font-normal pt-2 leading-relaxed">
                  Report, search, and recover your lost or found items on campus with the help of AI.
                </p>
              </div>

              {/* Two CTA Buttons matching design */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/report/lost"
                  className="px-6 py-3.5 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] text-white font-semibold text-base shadow-sm hover:shadow-md transition-all inline-flex items-center gap-2"
                >
                  <span>Report Lost Item</span>
                </Link>

                <Link
                  to="/report/found"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#0866E8] border border-[#0866E8] font-semibold text-base transition-all inline-flex items-center gap-2"
                >
                  <span>Report Found Item</span>
                </Link>
              </div>

              {/* Quick AI trust highlight */}
              <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Instant Vision Matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Proctorial Verified Claims</span>
                </div>
              </div>
            </div>

            {/* Right Column: Campus Image with Floating Card */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E2E8F0] aspect-4/3 sm:aspect-16/10 bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80"
                  alt="AKS University Campus Building"
                  className="w-full h-full object-cover"
                />

                {/* Gradient overlay for contrast */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />

                {/* Floating white card matching reference */}
                <div className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-xl border border-white/60 shadow-xl max-w-[220px]">
                  <p className="text-xs font-bold text-[#0B1F3A] leading-snug">
                    A smarter campus
                  </p>
                  <p className="text-xs text-[#0866E8] font-semibold leading-snug">
                    for a safer tomorrow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Section (3 cards matching reference) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Search Items */}
            <Link
              to="/items"
              className="group bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all hover:border-blue-200"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0866E8] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Search className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1F3A] mb-2">
                Search Items
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Find lost or found items using filters.
              </p>
              <div className="mt-4 flex items-center text-xs font-semibold text-[#0866E8] group-hover:translate-x-1 transition-transform">
                <span>Browse inventory</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>

            {/* Card 2: AI Image Matching */}
            <Link
              to="/ai-matches"
              className="group bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all hover:border-blue-200"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0866E8] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1F3A] mb-2">
                AI Image Matching
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Find possible matches using AI.
              </p>
              <div className="mt-4 flex items-center text-xs font-semibold text-[#0866E8] group-hover:translate-x-1 transition-transform">
                <span>See live matching</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>

            {/* Card 3: Secure & Verified */}
            <Link
              to="/admin"
              className="group bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all hover:border-blue-200"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0866E8] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1F3A] mb-2">
                Secure & Verified
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                All claims are verified by admin.
              </p>
              <div className="mt-4 flex items-center text-xs font-semibold text-[#0866E8] group-hover:translate-x-1 transition-transform">
                <span>Admin verification</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          </div>
        </section>

        {/* Live Recent Campus Finds Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0B1F3A]">Recently Reported on Campus</h2>
              <p className="text-sm text-slate-500">Live records registered across library, labs, and sports blocks</p>
            </div>
            <Link
              to="/items"
              className="text-sm font-semibold text-[#0866E8] hover:underline inline-flex items-center gap-1"
            >
              <span>View All Items</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="h-44 bg-slate-100 relative overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAF3FF] text-[#0866E8] border border-blue-200 shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {item.matchScore}% Match
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-bold text-[#0B1F3A] mb-1.5">{item.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{item.description}</p>
                      <div className="space-y-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">By {item.reportedBy}</span>
                      <Link
                        to={`/items/${item.id}`}
                        className="text-xs font-semibold text-[#0866E8] hover:text-[#0652ba] inline-flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center space-y-3 shadow-xs">
              <h3 className="text-base font-bold text-[#0B1F3A]">No Campus Items Currently Reported</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                The database is clean. When students or faculty report lost or found belongings, they will appear here in real-time.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  to="/report/lost"
                  className="px-4 py-2 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] text-white text-xs font-semibold shadow-xs"
                >
                  Report Lost Item
                </Link>
                <Link
                  to="/report/found"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#0866E8] border border-[#0866E8] text-xs font-semibold"
                >
                  Report Found Item
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* AI Campus Assistant Callout Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-[#0B1F3A] rounded-2xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-blue-600/20 to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-400/30">
                <Brain className="w-3.5 h-3.5 text-blue-400" />
                <span>Multilingual Campus Bot</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Have questions or need immediate help finding your item?
              </h3>
              <p className="text-sm sm:text-base text-slate-300">
                Chat with our Campus Assistant in Hindi, English, or Hinglish. Ask about claim procedures, duplicate ID cards, or security desk hours.
              </p>
              <div className="pt-2">
                <Link
                  to="/chat"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0866E8] hover:bg-blue-600 text-white font-semibold text-sm transition-all shadow-md"
                >
                  <span>Chat with AI Assistant</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CampusLostFound — Smart Campus Lost & Found Management System.</p>
          <div className="flex items-center gap-6 text-slate-600">
            <Link to="/about" className="hover:text-[#0866E8]">Proctorial Guidelines</Link>
            <Link to="/items" className="hover:text-[#0866E8]">Lost Database</Link>
            <Link to="/admin" className="hover:text-[#0866E8]">Admin Desk</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
