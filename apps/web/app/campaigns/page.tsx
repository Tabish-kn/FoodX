'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, TrendingUp, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  targetAmount: number;
  raisedAmount: number;
  donorsCount: number;
  organization: string;
}

const CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-01',
    title: 'Zero Hunger Delhi: Insulated Electric Rescue Vans',
    description: 'Help us deploy 5 custom insulated electric delivery scooters and vans to rescue perishable hotel meals in under 30 minutes.',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80',
    targetAmount: 500000,
    raisedAmount: 384000,
    donorsCount: 412,
    organization: 'FoodX Foundation & Anna Trust'
  },
  {
    id: 'camp-02',
    title: '10,000 Nutritious Breakfasts for Night School Kids',
    description: 'Providing fresh milk, fruit bowls, and whole grain bakery items every morning to municipal school children across NCR.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    targetAmount: 300000,
    raisedAmount: 215000,
    donorsCount: 298,
    organization: 'Hope & Nutrition Shelter'
  }
];

export default function CampaignsPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [amount, setAmount] = useState(1000);
  const [campaignsList, setCampaignsList] = useState<Campaign[]>(CAMPAIGNS);

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    setCampaignsList((prev) =>
      prev.map((c) =>
        c.id === selectedCampaign.id
          ? { ...c, raisedAmount: c.raisedAmount + amount, donorsCount: c.donorsCount + 1 }
          : c
      )
    );

    setSelectedCampaign(null);
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    alert(`🎉 Thank you! Your generous contribution of ₹${amount.toLocaleString()} has been received.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Fundraising & Logistics Giving</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">Fuel the Zero-Hunger Logistics Fleet</h1>
        <p className="text-slate-600 text-sm sm:text-base">
          100% of public monetary donations fund insulated transport boxes, eco-courier travel allowances, and community kitchen ingredients.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {campaignsList.map((campaign) => {
          const progressPercent = Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100));
          return (
            <div key={campaign.id} className="glass-panel rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition flex flex-col justify-between">
              <div>
                <div className="relative h-56 w-full">
                  <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
                    {campaign.organization}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 font-display">{campaign.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{campaign.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-emerald-700">₹{campaign.raisedAmount.toLocaleString()} raised</span>
                      <span className="text-slate-500 font-medium">Goal: ₹{campaign.targetAmount.toLocaleString()} ({progressPercent}%)</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span><strong>{campaign.donorsCount}</strong> generous community contributors</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedCampaign(campaign)}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md shadow-emerald-600/30"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Support this Campaign</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Donation Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-display">Monetary Contribution</h3>
              <button onClick={() => setSelectedCampaign(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600">
              Supporting: <strong className="text-slate-900 font-bold">{selectedCampaign.title}</strong>
            </div>

            <form onSubmit={handleDonate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Amount (INR)</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[500, 1000, 2500].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`py-2 rounded-xl border font-bold ${
                        amount === preset ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      ₹{preset.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="100"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 100)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-base"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Eligible for Section 80G Indian Income Tax deduction receipt</span>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedCampaign(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  Complete ₹{amount.toLocaleString()} Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
