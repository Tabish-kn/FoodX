'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/auth-context';
import { UserRole } from '@foodx/shared-types';
import {
  HeartHandshake,
  MapPin,
  Bell,
  Award,
  ShieldCheck,
  ChevronDown,
  LogOut,
  PlusCircle,
  Truck,
  Building2,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, switchRoleDemo } = useAuth();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.ADMIN:
        return '/admin';
      case UserRole.NGO:
        return '/ngo';
      case UserRole.VOLUNTEER:
        return '/volunteer';
      case UserRole.BENEFICIARY:
        return '/beneficiary';
      default:
        return '/donor';
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-display">Food<span className="text-emerald-600">X</span></span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium -mt-1">Food Rescue Network</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/60 transition">
              Home
            </Link>
            <Link href="/donor" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/60 transition">
              Donations
            </Link>
            <Link href="/ngo" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/60 transition flex items-center space-x-1">
              <span>NGO Hub</span>
            </Link>
            <Link href="/volunteer" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/60 transition flex items-center space-x-1">
              <span>Courier Tasks</span>
            </Link>
            <Link href="/campaigns" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/60 transition">
              Campaigns
            </Link>
            <Link href="/leaderboard" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/60 transition flex items-center space-x-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Leaderboard</span>
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {/* Demo Role Switcher Quick Pill */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-300/80 transition"
                title="Quick Demo Role Switcher"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Role: <strong className="text-emerald-700">{user?.role || 'Switch'}</strong></span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Instant Demo Role Preview
                  </div>
                  <button
                    onClick={() => { switchRoleDemo(UserRole.DONOR); setIsRoleMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-2"
                  >
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold">Hotel / Restaurant (Donor)</div>
                      <div className="text-[10px] text-slate-400">Post surplus food batches</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { switchRoleDemo(UserRole.NGO); setIsRoleMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-2"
                  >
                    <HeartHandshake className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold">NGO / Shelter Partner</div>
                      <div className="text-[10px] text-slate-400">Claim food & dispatch aid</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { switchRoleDemo(UserRole.VOLUNTEER); setIsRoleMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-2"
                  >
                    <Truck className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="font-semibold">Volunteer Courier</div>
                      <div className="text-[10px] text-slate-400">Accept delivery & scan QR</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { switchRoleDemo(UserRole.ADMIN); setIsRoleMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-semibold">Super Administrator</div>
                      <div className="text-[10px] text-slate-400">Platform KPIs & verification</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Dashboard Link / Action Button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href={getDashboardLink()}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 transition"
                >
                  <span>Portal</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-600 transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                >
                  Join Network
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
