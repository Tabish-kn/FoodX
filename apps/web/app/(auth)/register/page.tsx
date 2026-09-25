'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { UserRole } from '@foodx/shared-types';
import { HeartHandshake, Building2, Truck, Users, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [role, setRole] = useState<UserRole>(UserRole.DONOR);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Password123!');
  const [orgName, setOrgName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await register({
      email,
      password,
      fullName,
      phone,
      role,
      organizationName: orgName
    });
    setIsLoading(false);
    router.push(role === UserRole.NGO ? '/ngo' : role === UserRole.VOLUNTEER ? '/volunteer' : '/donor');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 py-12">
      <div className="max-w-lg w-full glass-panel p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-display">Join the FoodX Network</h1>
          <p className="text-xs text-slate-500">Select your role to get started</p>
        </div>

        {/* Role Selector Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole(UserRole.DONOR)}
            className={`p-3 rounded-2xl border text-center space-y-1.5 transition ${
              role === UserRole.DONOR ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm' : 'border-slate-200 text-slate-600'
            }`}
          >
            <Building2 className="w-5 h-5 mx-auto text-emerald-600" />
            <div>Food Donor</div>
          </button>
          <button
            type="button"
            onClick={() => setRole(UserRole.NGO)}
            className={`p-3 rounded-2xl border text-center space-y-1.5 transition ${
              role === UserRole.NGO ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-sm' : 'border-slate-200 text-slate-600'
            }`}
          >
            <HeartHandshake className="w-5 h-5 mx-auto text-amber-600" />
            <div>NGO Shelter</div>
          </button>
          <button
            type="button"
            onClick={() => setRole(UserRole.VOLUNTEER)}
            className={`p-3 rounded-2xl border text-center space-y-1.5 transition ${
              role === UserRole.VOLUNTEER ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-sm' : 'border-slate-200 text-slate-600'
            }`}
          >
            <Truck className="w-5 h-5 mx-auto text-teal-600" />
            <div>Volunteer Courier</div>
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Name / Contact Person</label>
            <input
              type="text"
              required
              placeholder="e.g. Chef Vikramaditya Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Organization / Business Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Grand Palace Hotel Ltd."
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                required
                placeholder="name@organization.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43200"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 transition flex items-center justify-center space-x-2"
          >
            <span>{isLoading ? 'Creating Account...' : 'Create Account & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-emerald-600 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
