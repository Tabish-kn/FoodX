'use client';

import React, { useState } from 'react';
import { Award, Trophy, Sparkles, Star, Shield, Flame, CheckCircle2 } from 'lucide-react';
import { BadgeType } from '@foodx/shared-types';

interface LeaderboardUser {
  rank: number;
  name: string;
  role: string;
  points: number;
  meals: number;
  badges: string[];
}

const LEADERBOARD_DATA: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'FreshMart Superstore Retail Network',
    role: 'Supermarket Donor',
    points: 12000,
    meals: 9200,
    badges: ['🌱 First Step', '🥗 Food Saver', '🏆 Super Donor', '♻️ Zero Waste']
  },
  {
    rank: 2,
    name: 'Anna Foundation NGO',
    role: 'Shelter Hub',
    points: 8500,
    meals: 3420,
    badges: ['⭐ Community Hero', '🚨 Emergency Hero']
  },
  {
    rank: 3,
    name: 'Grand Palace Hotel & Banquets',
    role: 'Hotel Donor',
    points: 6500,
    meals: 4800,
    badges: ['🌱 First Step', '🥗 Food Saver', '🏆 Super Donor']
  },
  {
    rank: 4,
    name: 'Alex Sharma (Rapid Courier)',
    role: 'Volunteer Courier',
    points: 3400,
    meals: 1100,
    badges: ['🚴 Golden Courier', '🚨 Rapid Responder']
  },
  {
    rank: 5,
    name: 'Spice Garden Banquet Hall',
    role: 'Restaurant Donor',
    points: 2900,
    meals: 1850,
    badges: ['🌱 First Step', '🥗 Food Saver']
  }
];

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<'ALL_TIME' | 'MONTHLY' | 'WEEKLY'>('MONTHLY');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>City Champions of Hunger Relief</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">FoodX Hero Leaderboard</h1>
        <p className="text-slate-600 text-sm">
          Recognizing the most dedicated hotels, charities, and eco-couriers rescuing meals and nourishing our community.
        </p>

        {/* Time Filters */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-bold pt-2">
          {(['WEEKLY', 'MONTHLY', 'ALL_TIME'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Rank 2 */}
        <div className="glass-panel p-6 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-md order-2 md:order-1">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 mx-auto flex items-center justify-center font-black text-xl border border-slate-200">
            🥈
          </div>
          <h3 className="font-bold text-slate-900 text-base">{LEADERBOARD_DATA[1].name}</h3>
          <div className="text-xs text-amber-600 font-bold">{LEADERBOARD_DATA[1].role}</div>
          <div className="text-2xl font-black text-slate-900 font-display">{LEADERBOARD_DATA[1].points.toLocaleString()} pts</div>
          <div className="text-xs text-slate-500">{LEADERBOARD_DATA[1].meals.toLocaleString()} meals distributed</div>
        </div>

        {/* Rank 1 (Podium Center) */}
        <div className="glass-panel p-8 rounded-3xl bg-gradient-to-b from-amber-500 to-amber-600 text-white text-center space-y-3 shadow-xl order-1 md:order-2 transform md:-translate-y-4">
          <div className="w-14 h-14 rounded-2xl bg-white text-amber-600 mx-auto flex items-center justify-center font-black text-2xl shadow-lg">
            👑
          </div>
          <div className="bg-amber-700/80 text-amber-100 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full inline-block">
            #1 Champion
          </div>
          <h3 className="font-extrabold text-white text-lg font-display">{LEADERBOARD_DATA[0].name}</h3>
          <div className="text-xs text-amber-100 font-medium">{LEADERBOARD_DATA[0].role}</div>
          <div className="text-4xl font-black text-white font-display">{LEADERBOARD_DATA[0].points.toLocaleString()} pts</div>
          <div className="text-xs text-amber-100">{LEADERBOARD_DATA[0].meals.toLocaleString()} meals rescued</div>
        </div>

        {/* Rank 3 */}
        <div className="glass-panel p-6 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-md order-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center font-black text-xl border border-amber-200">
            🥉
          </div>
          <h3 className="font-bold text-slate-900 text-base">{LEADERBOARD_DATA[2].name}</h3>
          <div className="text-xs text-emerald-600 font-bold">{LEADERBOARD_DATA[2].role}</div>
          <div className="text-2xl font-black text-slate-900 font-display">{LEADERBOARD_DATA[2].points.toLocaleString()} pts</div>
          <div className="text-xs text-slate-500">{LEADERBOARD_DATA[2].meals.toLocaleString()} meals rescued</div>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="glass-panel rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 text-xs">
          {LEADERBOARD_DATA.map((u) => (
            <div key={u.rank} className="p-5 flex items-center justify-between hover:bg-slate-50 transition">
              <div className="flex items-center space-x-4">
                <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-black flex items-center justify-center text-xs">
                  {u.rank}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{u.name}</h4>
                  <div className="text-slate-500 text-xs">{u.role}</div>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-right">
                <div className="hidden sm:flex flex-wrap gap-1 max-w-xs justify-end">
                  {u.badges.map((b) => (
                    <span key={b} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                      {b}
                    </span>
                  ))}
                </div>
                <div>
                  <div className="font-black text-sm text-slate-900">{u.points.toLocaleString()} pts</div>
                  <div className="text-slate-400 text-[10px]">{u.meals} meals</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
