'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import {
  ShieldCheck,
  Users,
  Building2,
  Truck,
  HeartHandshake,
  AlertTriangle,
  FileCheck,
  Ban,
  CheckCircle,
  Eye,
  TrendingUp,
  Sliders,
  DollarSign
} from 'lucide-react';

interface VerificationApplicant {
  id: string;
  name: string;
  role: string;
  registrationNo: string;
  documentType: string;
  date: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

const APPLICANTS: VerificationApplicant[] = [
  {
    id: 'app-01',
    name: 'Child Nutrition Foundation',
    role: 'NGO',
    registrationNo: 'NGO-DL-2024-9912',
    documentType: '80G & FSSAI Food Safety Certificate',
    date: 'Today, 10:30 AM',
    status: 'PENDING'
  },
  {
    id: 'app-02',
    name: 'Sardar Ji Catering & Banquets',
    role: 'RESTAURANT',
    registrationNo: 'FSSAI-118833990022',
    documentType: 'FSSAI Commercial Kitchen License',
    date: 'Yesterday',
    status: 'PENDING'
  },
  {
    id: 'app-03',
    name: 'Rohit Verma (Van Courier)',
    role: 'VOLUNTEER',
    registrationNo: 'DL-09-2023-881122',
    documentType: 'Commercial Driving License & Police Clearance',
    date: '2 days ago',
    status: 'PENDING'
  }
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [applicants, setApplicants] = useState<VerificationApplicant[]>(APPLICANTS);
  const [activeTab, setActiveTab] = useState<'verification' | 'audit' | 'complaints'>('verification');

  const handleApprove = (id: string) => {
    setApplicants((prev: VerificationApplicant[]) =>
      prev.map((a: VerificationApplicant) => (a.id === id ? { ...a, status: 'VERIFIED' } : a))
    );
    alert('✅ Organization/User successfully verified! System credentials updated.');
  };

  const handleReject = (id: string) => {
    setApplicants((prev: VerificationApplicant[]) =>
      prev.map((a: VerificationApplicant) => (a.id === id ? { ...a, status: 'REJECTED' } : a))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Super Administrator Console</span>
            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Root Access</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-display mt-1">Platform Governance & Health</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time audit trails, user moderation, and legal verification pipeline.</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            System Uptime: 99.98%
          </span>
        </div>
      </div>

      {/* Admin KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Registered Users</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-display">1,248</div>
          <div className="text-[11px] text-purple-600 font-medium">+84 this week across Delhi NCR</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Meals Rescued</span>
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600 font-display">14,820</div>
          <div className="text-[11px] text-emerald-700 font-medium">100% audited distribution logs</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active NGO Charities</span>
            <Building2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600 font-display">42 Hubs</div>
          <div className="text-[11px] text-slate-500 font-medium">Serving 12,500 daily portions</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Fundraising Raised</span>
            <DollarSign className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-teal-600 font-display">₹3,84,000</div>
          <div className="text-[11px] text-teal-700 font-medium">Zero-Hunger Logistics Fund</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('verification')}
            className={`pb-3 px-3 transition border-b-2 ${
              activeTab === 'verification' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Verification Queue ({applicants.filter((a) => a.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 px-3 transition border-b-2 ${
              activeTab === 'audit' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Immutable Audit Trail
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`pb-3 px-3 transition border-b-2 ${
              activeTab === 'complaints' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Disputes & Complaints (0 Open)
          </button>
        </div>

        {activeTab === 'verification' && (
          <div className="glass-panel rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">Legal Document Verification Requests</h3>
              <span className="text-xs text-slate-500 font-medium">Verify FSSAI, 80G tax exemptions, and vehicle registration</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {applicants.map((applicant) => (
                <div key={applicant.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{applicant.name}</span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                        {applicant.role}
                      </span>
                    </div>
                    <div className="text-slate-500 text-xs">
                      Reg No: <strong className="font-mono text-slate-700">{applicant.registrationNo}</strong> • {applicant.documentType}
                    </div>
                    <div className="text-[10px] text-slate-400">Applied: {applicant.date}</div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {applicant.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleApprove(applicant.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1.5 transition shadow-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve & Verify</span>
                        </button>
                        <button
                          onClick={() => handleReject(applicant.id)}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold transition"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                        applicant.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {applicant.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">System Security & Mutation Logs</h3>
            <div className="font-mono bg-slate-950 text-emerald-400 p-4 rounded-xl space-y-2 overflow-x-auto text-[11px]">
              <div>[2026-09-11T18:25:59Z] AUDIT_EVENT: NGO_VERIFICATION_APPROVED | Target: Anna Foundation NGO (DL-2018-8821) | Actor: SuperAdmin</div>
              <div>[2026-09-11T18:25:50Z] AUDIT_EVENT: QR_HANDSHAKE_VERIFIED | Donation: don-01 | Courier: Alex Sharma | Proof: Validated</div>
              <div>[2026-09-11T18:24:12Z] AUDIT_EVENT: DONATION_PUBLISHED | 150 Portions Veg Biryani | Donor: Grand Palace Hotel</div>
              <div>[2026-09-11T18:22:01Z] AUDIT_EVENT: ADMIN_LOGIN_SUCCESS | Actor: admin@foodx.org | IP: 127.0.0.1 (Local Verified)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
