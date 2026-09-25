'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { FoodCategory, PriorityLevel } from '@foodx/shared-types';
import {
  HeartHandshake,
  Check,
  MapPin,
  Clock,
  Sparkles,
  Filter,
  PlusCircle,
  AlertTriangle,
  Building2,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AvailableDonation {
  id: string;
  title: string;
  donorName: string;
  category: string;
  quantity: string;
  numberOfMeals: number;
  distanceKm: number;
  matchScore: number;
  expiryHours: number;
  location: string;
  dietary: string[];
  isClaimed?: boolean;
}

const INITIAL_AVAILABLE: AvailableDonation[] = [
  {
    id: 'avail-01',
    title: '80kg Fresh Farm Apples, Oranges & Whole Wheat Breads',
    donorName: 'FreshMart Superstore #104',
    category: 'Fruits & Bakery',
    quantity: '80 kg',
    numberOfMeals: 220,
    distanceKm: 2.1,
    matchScore: 96,
    expiryHours: 18,
    location: '45 South Ext Block 2, New Delhi',
    dietary: ['VEGAN', 'VEGETARIAN']
  },
  {
    id: 'avail-02',
    title: '65 Portions Paneer Butter Masala & Tandoori Rotis',
    donorName: 'Spice Garden Banquet Hall',
    category: 'Cooked Meals',
    quantity: '22 kg',
    numberOfMeals: 65,
    distanceKm: 3.4,
    matchScore: 91,
    expiryHours: 3.5,
    location: 'Ring Road Lajpat Nagar, New Delhi',
    dietary: ['VEGETARIAN', 'HALAL']
  },
  {
    id: 'avail-03',
    title: '120 Packs Pasteurized Organic Cow Milk (1L each)',
    donorName: 'Mother Dairy Surplus Distribution',
    category: 'Dairy',
    quantity: '120 L',
    numberOfMeals: 120,
    distanceKm: 4.8,
    matchScore: 88,
    expiryHours: 24,
    location: 'Okhla Phase 1 Hub, New Delhi',
    dietary: ['VEGETARIAN']
  }
];

export default function NgoDashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState<AvailableDonation[]>(INITIAL_AVAILABLE);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestMeals, setRequestMeals] = useState(100);
  const [requestPriority, setRequestPriority] = useState<PriorityLevel>(PriorityLevel.NORMAL);

  const handleClaim = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isClaimed: true } : item))
    );
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRequestModalOpen(false);
    alert(`Food Request for ${requestMeals} meals (${requestPriority} priority) broadcasted to nearby donors!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">NGO & Shelter Hub</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Verified Charity</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-display mt-1">
            {user?.fullName || 'Anna Foundation for Food Security'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Matching surplus nutrition directly to 1,500 registered shelter beneficiaries.</p>
        </div>

        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-md shadow-amber-600/30 transition transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Broadcast Food Request</span>
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl bg-white border-l-4 border-l-amber-500 space-y-1">
          <div className="text-xs font-semibold text-slate-500">Registered Beneficiaries</div>
          <div className="text-3xl font-black text-slate-900 font-display">1,500 People</div>
          <div className="text-[11px] text-slate-500">Shelter residents & daily wage families</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl bg-white border-l-4 border-l-emerald-500 space-y-1">
          <div className="text-xs font-semibold text-slate-500">Meals Received (This Month)</div>
          <div className="text-3xl font-black text-emerald-600 font-display">3,420 Meals</div>
          <div className="text-[11px] text-emerald-600 font-medium">99.2% zero-spoilage rate</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl bg-white border-l-4 border-l-teal-500 space-y-1">
          <div className="text-xs font-semibold text-slate-500">Active Deliveries Incoming</div>
          <div className="text-3xl font-black text-teal-700 font-display">1 In-Transit</div>
          <div className="text-[11px] text-teal-600 font-medium">ETA 14 mins by Courier Alex</div>
        </div>
      </div>

      {/* Available Donations Stream */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Surplus Available Nearby (AI Matched)</h2>
            <p className="text-xs text-slate-500">Sorted by algorithm compatibility score and travel distance</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 text-xs font-semibold bg-slate-100 p-1 rounded-xl">
            {['ALL', 'Cooked Meals', 'Fruits', 'Dairy'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterCategory === cat ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item.id} className="glass-panel p-5 rounded-2xl bg-white space-y-4 border border-slate-200 flex flex-col justify-between hover:shadow-md transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span>{item.matchScore}% Match</span>
                  </span>
                  <span className="text-xs font-bold text-slate-500">{item.distanceKm} km away</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
                  <div className="flex items-center space-x-1 text-xs text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.donorName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Servings</span>
                    <strong className="text-slate-800 font-bold">{item.numberOfMeals} Meals</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Expiry Window</span>
                    <strong className="text-slate-800 font-bold">{item.expiryHours}h remaining</strong>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {item.dietary.map((flag) => (
                    <span key={flag} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {flag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                {item.isClaimed ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center space-x-1.5 cursor-default"
                  >
                    <Check className="w-4 h-4" />
                    <span>Claimed & Volunteer Dispatched</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleClaim(item.id)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>Accept Donation</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-display">Broadcast Food Aid Request</h3>
              <button onClick={() => setIsRequestModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Meals Required</label>
                <input
                  type="number"
                  min="10"
                  value={requestMeals}
                  onChange={(e) => setRequestMeals(parseInt(e.target.value) || 10)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Priority Level</label>
                <select
                  value={requestPriority}
                  onChange={(e) => setRequestPriority(e.target.value as PriorityLevel)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                >
                  <option value={PriorityLevel.NORMAL}>Normal (Standard evening meal)</option>
                  <option value={PriorityLevel.HIGH}>High (Needed within 4 hours)</option>
                  <option value={PriorityLevel.EMERGENCY}>Emergency (Immediate relief alert)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-600/30"
                >
                  Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
