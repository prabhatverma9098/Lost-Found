import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { 
  FileCheck2, 
  Users, 
  MapPin, 
  Tags, 
  Bell, 
  Settings, 
  Plus, 
  Eye, 
  FileQuestion,
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import { FIXED_ADMIN_EMAIL } from '../../data/mockData';

/* --- MANAGE REPORTS VIEW --- */
export const ManageReportsView: React.FC = () => {
  const { items } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');

  const filtered = items.filter(i => {
    if (filterType === 'lost') return i.type === 'lost';
    if (filterType === 'found') return i.type === 'found';
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Manage All Reports</h1>
          <p className="text-xs text-slate-500 mt-1">Audit, edit, or resolve campus lost & found records</p>
        </div>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <div className="flex bg-white rounded-xl border border-slate-200 p-1 text-xs font-semibold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg ${filterType === 'all' ? 'bg-[#0866E8] text-white' : 'text-slate-600'}`}
              >
                All ({items.length})
              </button>
              <button
                onClick={() => setFilterType('lost')}
                className={`px-3 py-1 rounded-lg ${filterType === 'lost' ? 'bg-[#0866E8] text-white' : 'text-slate-600'}`}
              >
                Lost ({items.filter(i => i.type === 'lost').length})
              </button>
              <button
                onClick={() => setFilterType('found')}
                className={`px-3 py-1 rounded-lg ${filterType === 'found' ? 'bg-[#0866E8] text-white' : 'text-slate-600'}`}
              >
                Found ({items.filter(i => i.type === 'found').length})
              </button>
            </div>
          )}

          <Link
            to="/report/lost"
            className="px-4 py-2 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Report New Item</span>
          </Link>
        </div>
      </div>

      {/* When items exist, show the table. When empty, show exact user required empty state! */}
      {items.length > 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-5">Item</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Reported By</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img src={item.images[0]} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-[11px] text-slate-500">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${item.type === 'found' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{item.reportedBy}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.location}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.date}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-[#0866E8]">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        to={`/items/${item.id}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0866E8] hover:text-white text-slate-700 text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* EXACT EMPTY STATE MATCHING SPECIFICATION */
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 sm:p-16 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0866E8] flex items-center justify-center mx-auto">
            <FileQuestion className="w-8 h-8 stroke-[1.8]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#0B1F3A]">
              No Reports Yet
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              No lost or found items have been reported yet. Newly created reports submitted by students will appear here automatically.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/report/lost"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] text-white text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Report New Item</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- USERS ADMIN VIEW --- */
export const UsersAdminView: React.FC = () => {
  const { items, claims } = useApp();

  // Dynamic user list: Admin + users who have made reports
  const reporters = items.map(i => ({
    name: i.reportedBy.split(' (')[0],
    roll: i.reporterRoll || 'Student',
    email: 'student@aksuniversity.ac.in',
    dept: 'Campus Department',
    role: i.reporterRole || 'Student',
    reports: 1,
    claims: 0
  }));

  const usersList = [
    {
      name: 'Chief Security Officer',
      roll: 'ADM-CS01',
      email: FIXED_ADMIN_EMAIL,
      dept: 'Proctorial Board & Security Office',
      role: 'Admin',
      reports: items.filter(i => i.reporterRole === 'Admin').length,
      claims: 0
    },
    ...reporters
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold text-[#0B1F3A]">Registered Campus Users</h1>
        <p className="text-xs text-slate-500 mt-1">
          Single Administrator ({FIXED_ADMIN_EMAIL}) and active campus participants
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-5">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4 text-center">Reports</th>
              <th className="py-3 px-4 text-center">Claims</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usersList.map((u, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="py-3.5 px-5">
                  <p className="font-bold text-slate-900">{u.name}</p>
                  <p className="text-[11px] text-slate-500">{u.roll}</p>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    u.role === 'Admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-700">{u.dept}</td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">{u.email}</td>
                <td className="py-3.5 px-4 text-center font-bold text-slate-800">{u.reports}</td>
                <td className="py-3.5 px-4 text-center font-bold text-slate-800">{u.claims}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* --- CATEGORIES ADMIN VIEW --- */
export const CategoriesAdminView: React.FC = () => {
  const { items } = useApp();

  const cats = [
    { name: 'Mobile Phone', icon: '📱' },
    { name: 'Electronics', icon: '💻' },
    { name: 'ID Card & Wallets', icon: '🪪' },
    { name: 'Bags & Backpacks', icon: '🎒' },
    { name: 'Documents & Notes', icon: '📑' },
    { name: 'Keys', icon: '🔑' },
    { name: 'Accessories', icon: '⌚' },
    { name: 'Clothing', icon: '👕' },
    { name: 'Other', icon: '📦' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Manage Categories</h1>
          <p className="text-xs text-slate-500 mt-1">Configure campus item taxonomy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cats.map((c, i) => {
          const count = items.filter(it => it.category === c.name).length;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <h4 className="text-sm font-bold text-[#0B1F3A]">{c.name}</h4>
                  <p className="text-xs text-slate-500">{count} active item(s)</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* --- LOCATIONS ADMIN VIEW --- */
export const LocationsAdminView: React.FC = () => {
  const { items } = useApp();

  const locations = [
    { name: 'Central Library', building: 'Academic Block A' },
    { name: 'Computer Block', building: 'Engineering Wing' },
    { name: 'Main Canteen & Food Court', building: 'Student Center' },
    { name: 'Auditorium & Seminar Hall', building: 'Cultural Complex' },
    { name: 'Sports Complex & Gym', building: 'Athletics Ground' },
    { name: 'Administrative Block', building: 'Central Block Room 104' },
    { name: 'Central Parking Area', building: 'Campus Entry Gate' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold text-[#0B1F3A]">Campus Registered Locations</h1>
        <p className="text-xs text-slate-500 mt-1">Designated lost & found drop points and zones</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {locations.map((loc, i) => {
          const count = items.filter(it => it.location.toLowerCase().includes(loc.name.toLowerCase())).length;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0866E8] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0B1F3A]">{loc.name}</h4>
                  <p className="text-xs text-slate-500">{loc.building}</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {count} Item(s)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* --- SETTINGS ADMIN VIEW --- */
export const SettingsAdminView: React.FC = () => {
  const { resetAllData } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold text-[#0B1F3A]">System Settings & Security</h1>
        <p className="text-xs text-slate-500 mt-1">Configure automated AI matching thresholds and administrative policies</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <p className="font-bold text-slate-900 text-sm">Designated Administrator Account</p>
              <p className="text-slate-500">Sole email authorized for Proctorial Board permissions</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-[#0866E8] font-bold rounded-full font-mono">
              {FIXED_ADMIN_EMAIL}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <p className="font-bold text-slate-900 text-sm">Automated Neural Vision Matching</p>
              <p className="text-slate-500">Run computer vision comparisons automatically on report creation</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full">Active</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <p className="font-bold text-slate-900 text-sm">Data Reset Utility</p>
              <p className="text-slate-500">Purge newly created local reports and claims to restore clean initial slate</p>
            </div>
            <button
              onClick={resetAllData}
              className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold"
            >
              Reset Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
