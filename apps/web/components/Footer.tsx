import React from 'react';
import Link from 'next/link';
import { HeartHandshake, Shield, Sparkles, Globe, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-display">Food<span className="text-emerald-400">X</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering hotels, restaurants, supermarkets, and everyday donors to eliminate food waste through AI-driven real-time rescue logistics.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
              <Shield className="w-3.5 h-3.5" />
              <span>100% Verified NGOs & Safe Handling</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/donor" className="hover:text-emerald-400 transition">Donate Surplus Food</Link></li>
              <li><Link href="/ngo" className="hover:text-emerald-400 transition">NGO Claim Hub</Link></li>
              <li><Link href="/volunteer" className="hover:text-emerald-400 transition">Volunteer Delivery Portal</Link></li>
              <li><Link href="/campaigns" className="hover:text-emerald-400 transition">Fundraising Campaigns</Link></li>
              <li><Link href="/leaderboard" className="hover:text-emerald-400 transition">Hero Leaderboard & Badges</Link></li>
            </ul>
          </div>

          {/* Col 3: Safe Handling & Rules */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Food Safety & QR</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Strict FSSAI Storage Standards</li>
              <li>Cryptographic Dual QR & OTP Handshakes</li>
              <li>Insulated Cold-Chain & Hot Logistics</li>
              <li>Real-Time GPS Volunteer Dispatch</li>
              <li>Zero Tolerance Landfill Policy</li>
            </ul>
          </div>

          {/* Col 4: Contact & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support & Emergency</h4>
            <p className="text-xs text-slate-400 mb-3">24/7 Rapid Emergency Food Relief Hotline</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                <Phone className="w-4 h-4" />
                <span>1800-FOODX-RESCUE</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Mail className="w-4 h-4" />
                <span>dispatch@foodx.org</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 FoodX Monorepo Platform. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Food Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
