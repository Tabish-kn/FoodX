'use client';

import React, { useState } from 'react';
import { HeartHandshake, MapPin, Users, Utensils, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BeneficiaryPage() {
  const [familySize, setFamilySize] = useState(4);
  const [dietary, setDietary] = useState('VEGETARIAN');
  const [address, setAddress] = useState('Near AIIMS Transit Camp, Ring Road, Delhi');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Confidential Community Food Aid</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">Request Fresh Food Relief</h1>
        <p className="text-slate-600 text-sm">
          No family should go hungry. Request free, nutritious surplus meals delivered to your shelter or nearest community center.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center font-bold">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-display">Food Aid Request Dispatched</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your request for <strong>{familySize} family portions</strong> has been routed to nearby partner charities (Anna Foundation & Jan Aahar Kitchen). You will receive an SMS when a volunteer courier is on the way.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Number of Family Members / People</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 4, 6, 10].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setFamilySize(count)}
                    className={`py-3 rounded-2xl border font-bold text-sm ${
                      familySize === count ? 'bg-amber-50 border-amber-500 text-amber-900' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    {count} {count === 1 ? 'Person' : 'People'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Dietary Preference</label>
                <select
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                >
                  <option value="VEGETARIAN">Vegetarian (Strict)</option>
                  <option value="VEGAN">Vegan</option>
                  <option value="HALAL">Halal</option>
                  <option value="ANY">Any Safe Cooked Food</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Delivery / Shelter Location</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Beneficiary privacy is strictly protected. Personal identifiers are never shared publicly.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-sm shadow-md shadow-amber-600/30 transition"
            >
              Request Free Meal Assistance
            </button>
          </form>
        )}
      </div>

      {/* Community Kitchen Walk-in Centers */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 font-display">Walk-in Community Kitchens in Delhi NCR</h3>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <strong className="text-sm font-bold text-slate-900">Central Jan Aahar Community Kitchen #1</strong>
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">Open Daily 7 AM - 9 PM</span>
          </div>
          <p className="text-slate-500">Near AIIMS Metro Station, Ring Road, New Delhi</p>
          <div className="text-[11px] text-slate-600">Today&apos;s Menu: Dal Rice, Mixed Vegetable Sabzi, Fresh Roti & Fruit (Free for all)</div>
        </div>
      </div>
    </div>
  );
}
