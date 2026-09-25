'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, DEMO_USERS } from '../../../lib/auth-context';
import { UserRole } from '@foodx/shared-types';
import { HeartHandshake, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Building2, Truck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRoleDemo } = useAuth();
  const [email, setEmail] = useState('chef@tajpalace.com');
  const [password, setPassword] = useState('Password123!');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
    router.push('/donor');
  };

  const handleQuickDemo = async (role: UserRole, targetRoute: string) => {
    await switchRoleDemo(role);
    router.push(targetRoute);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-display">Sign in to FoodX</h1>
          <p className="text-xs text-slate-500">Access your food rescue dashboard & live logistics</p>
        </div>

        {/* Instant Role Preview Buttons */}
        <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>One-Click Demo Profiles</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => handleQuickDemo(UserRole.DONOR, '/donor')}
              className="p-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-200 text-left transition"
            >
              🏨 Hotel Donor
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo(UserRole.NGO, '/ngo')}
              className="p-2 rounded-xl bg-white hover:bg-amber-50 text-amber-800 border border-slate-200 text-left transition"
            >
              🤝 NGO Shelter
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo(UserRole.VOLUNTEER, '/volunteer')}
              className="p-2 rounded-xl bg-white hover:bg-teal-50 text-teal-800 border border-slate-200 text-left transition"
            >
              🚴 Volunteer Courier
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo(UserRole.ADMIN, '/admin')}
              className="p-2 rounded-xl bg-white hover:bg-purple-50 text-purple-800 border border-slate-200 text-left transition"
            >
              🛡️ Super Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 transition flex items-center justify-center space-x-2"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-emerald-600 hover:underline">
            Register as Donor, NGO, or Volunteer
          </Link>
        </div>
      </div>
    </div>
  );
}
