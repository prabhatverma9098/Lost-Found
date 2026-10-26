import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle,
  Building,
  CheckCircle2,
  FileCheck2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#0866E8] text-xs font-semibold border border-blue-200">
            <ShieldCheck className="w-4 h-4" />
            <span>Campus Security & Proctorial Board</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
            About Smart Campus Lost & Found
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            A next-generation automated system designed to streamline item recovery across AKS University with advanced AI image matching and verified proctorial claims.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0866E8] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0B1F3A]">AI Image Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our neural vision model compares contour, coloration, camera arrays, scratches, and serial numbers between lost reports and found inventories with 90%+ match accuracy.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0B1F3A]">Proctor-Verified Claims</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No lost item is ever handed over without strict ownership verification—including student ID, purchase invoices, and IMEI or physical marks validation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0B1F3A]">Campus-Wide Auditing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete digital logging from discovery at classrooms or canteens to safe storage in the central security locker room.
            </p>
          </div>
        </div>

        {/* Campus Security Central Desk Information */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Building className="w-6 h-6 text-[#0866E8]" />
            <div>
              <h2 className="text-lg font-bold text-[#0B1F3A]">Campus Security Central Desk</h2>
              <p className="text-xs text-slate-500">Official retrieval & drop-off center</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600">
            <div className="space-y-1.5">
              <span className="font-semibold text-slate-900 block flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                Physical Location
              </span>
              <p>Administrative Block, Ground Floor</p>
              <p>Room 104 (Next to Proctorial Office)</p>
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-slate-900 block flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                Operating Hours
              </span>
              <p>Monday - Friday: 9:00 AM – 5:30 PM</p>
              <p>Saturday: 9:00 AM – 1:30 PM</p>
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-slate-900 block flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-400" />
                Direct Helpline
              </span>
              <p>Intercom: Ext. 4209 / 4210</p>
              <p>Email: security@aksuniversity.ac.in</p>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#0B1F3A]">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] space-y-2">
              <h4 className="font-bold text-slate-900">What should I bring when collecting my item?</h4>
              <p className="text-slate-600 leading-relaxed">
                Bring your physical AKS University Student/Staff ID card and any proof of ownership such as purchase invoice, device unlock, or original packaging.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] space-y-2">
              <h4 className="font-bold text-slate-900">How long are unclaimed items stored?</h4>
              <p className="text-slate-600 leading-relaxed">
                Found items are retained securely in the campus vault for 90 days. Unclaimed items after 90 days are handled according to University Proctorial Regulations.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] space-y-2">
              <h4 className="font-bold text-slate-900">Can someone else collect my item on my behalf?</h4>
              <p className="text-slate-600 leading-relaxed">
                Yes, but they must present a signed authorization letter from your registered university email along with copies of both your and their university IDs.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] space-y-2">
              <h4 className="font-bold text-slate-900">How accurate is the AI image matching?</h4>
              <p className="text-slate-600 leading-relaxed">
                Our vision matcher detects device form factors, camera modules, scratches, cases, and colors with over 90% accuracy, presenting matches ranked by confidence.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-[#E2E8F0] py-6 text-center text-xs text-slate-500">
        <p>© 2026 CampusLostFound — Smart Campus Lost & Found Management System.</p>
      </footer>
    </div>
  );
};
