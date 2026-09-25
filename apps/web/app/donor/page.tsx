'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { FoodCategory, StorageCondition, DietaryFlag, DonationStatus, PriorityLevel } from '@foodx/shared-types';
import {
  PlusCircle,
  Utensils,
  Clock,
  MapPin,
  CheckCircle2,
  Award,
  FileText,
  AlertTriangle,
  QrCode,
  Sparkles,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { formatHoursRemaining } from '../../lib/utils';
import confetti from 'canvas-confetti';

interface DonationItem {
  id: string;
  title: string;
  category: FoodCategory;
  quantity: number;
  unit: string;
  numberOfMeals: number;
  status: DonationStatus;
  priority: PriorityLevel;
  expiryTime: string;
  pickupAddress: string;
  qrCode: string;
  otpCode: string;
}

const INITIAL_DONATIONS: DonationItem[] = [
  {
    id: 'don-01',
    title: '150 Portions Royal Veg Biryani & Paneer Gravy',
    category: FoodCategory.HOTEL_SURPLUS,
    quantity: 45,
    unit: 'kg',
    numberOfMeals: 150,
    status: DonationStatus.IN_TRANSIT,
    priority: PriorityLevel.HIGH,
    expiryTime: new Date(Date.now() + 3.5 * 3600 * 1000).toISOString(),
    pickupAddress: '12 MG Road, Connaught Place, New Delhi',
    qrCode: 'QR-PK-99281-CONFIRMED',
    otpCode: '482910'
  },
  {
    id: 'don-02',
    title: '80kg Fresh Farm Apples & Bakery Breads',
    category: FoodCategory.FRUITS,
    quantity: 80,
    unit: 'kg',
    numberOfMeals: 220,
    status: DonationStatus.PUBLISHED,
    priority: PriorityLevel.NORMAL,
    expiryTime: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    pickupAddress: '45 South Ext Block 2, New Delhi',
    qrCode: 'QR-PK-33109-READY',
    otpCode: '891023'
  }
];

export default function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<DonationItem[]>(INITIAL_DONATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQr, setSelectedQr] = useState<DonationItem | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FoodCategory>(FoodCategory.COOKED_MEALS);
  const [quantity, setQuantity] = useState(25);
  const [numberOfMeals, setNumberOfMeals] = useState(75);
  const [hoursToExpiry, setHoursToExpiry] = useState(4);
  const [dietaryFlags, setDietaryFlags] = useState<DietaryFlag[]>([DietaryFlag.VEGETARIAN]);
  const [storageCondition, setStorageCondition] = useState<StorageCondition>(StorageCondition.HOT_HEATED);
  const [streetAddress, setStreetAddress] = useState('12 MG Road, Connaught Place, New Delhi');

  const handleCreateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const expiryDate = new Date(Date.now() + hoursToExpiry * 3600 * 1000);
    const newDonation: DonationItem = {
      id: `don-${Date.now()}`,
      title: title || 'Fresh Cooked Surplus Meal Batch',
      category,
      quantity,
      unit: 'kg',
      numberOfMeals,
      status: DonationStatus.PUBLISHED,
      priority: hoursToExpiry <= 2 ? PriorityLevel.EMERGENCY : hoursToExpiry <= 4 ? PriorityLevel.HIGH : PriorityLevel.NORMAL,
      expiryTime: expiryDate.toISOString(),
      pickupAddress: streetAddress,
      qrCode: `QR-PK-${Math.floor(10000 + Math.random() * 90000)}`,
      otpCode: Math.floor(100000 + Math.random() * 900000).toString()
    };

    setDonations([newDonation, ...donations]);
    setIsModalOpen(false);
    setTitle('');

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Donor Control Center</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">FSSAI Certified</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-display mt-1">
            {user?.fullName || 'Grand Palace Hotel (Donor)'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage active surplus listings, volunteer courier dispatches, and certificates.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/30 transition transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Surplus Donation</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl bg-white space-y-2 border-l-4 border-l-emerald-500">
          <div className="text-xs font-semibold text-slate-500">Total Meals Donated</div>
          <div className="text-3xl font-black text-slate-900 font-display">4,800+</div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+370 meals this week</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl bg-white space-y-2 border-l-4 border-l-teal-500">
          <div className="text-xs font-semibold text-slate-500">Food Waste Diverted</div>
          <div className="text-3xl font-black text-teal-700 font-display">1.44 Tons</div>
          <div className="text-[11px] text-slate-500 font-medium">Prevented 3.6t CO₂ emissions</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl bg-white space-y-2 border-l-4 border-l-amber-500">
          <div className="text-xs font-semibold text-slate-500">Reward Points & Badges</div>
          <div className="text-3xl font-black text-amber-600 font-display">{user?.rewardPoints || 6500} pts</div>
          <div className="text-[11px] text-amber-700 font-medium">Rank #2 on City Leaderboard 🏆</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl bg-white space-y-2 border-l-4 border-l-purple-500">
          <div className="text-xs font-semibold text-slate-500">Average Pickup Time</div>
          <div className="text-3xl font-black text-purple-700 font-display">28 Mins</div>
          <div className="text-[11px] text-purple-600 font-medium">98.4% On-Time Volunteer Arrival</div>
        </div>
      </div>

      {/* Active Listings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 font-display">Active & Recent Surplus Batches</h2>
          <span className="text-xs font-semibold text-slate-500">{donations.length} Active Listings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {donations.map((item) => {
            const timeInfo = formatHoursRemaining(item.expiryTime);
            return (
              <div key={item.id} className="glass-panel p-6 rounded-2xl bg-white space-y-4 border border-slate-200 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.category.replace('_', ' ')}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    timeInfo.isEmergency
                      ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                      : timeInfo.isUrgent
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {timeInfo.text}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block">Quantity & Meals</span>
                    <strong className="text-slate-800 font-bold">{item.quantity} {item.unit} ({item.numberOfMeals} Meals)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Status</span>
                    <span className="inline-flex items-center space-x-1 text-emerald-600 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{item.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-1 truncate max-w-[240px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.pickupAddress}</span>
                  </div>

                  <button
                    onClick={() => setSelectedQr(item)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
                  >
                    <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Handshake QR</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sustainability Certificate Card */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
            <Award className="w-4 h-4" />
            <span>Audited Corporate Social Responsibility (CSR) Certificate</span>
          </div>
          <h3 className="text-2xl font-bold font-display">Certificate of Excellence in Food Rescue & Zero Waste</h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Issued to Grand Palace Hospitality Ltd. for rescuing 4,800 meals (1,440 kg) from municipal landfill waste.
          </p>
        </div>

        <button
          onClick={() => alert('Downloading official stamped PDF Certificate (Ref: CERT-FOODX-2026-00482)...')}
          className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center space-x-2 shrink-0 transition"
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Download Tax Certificate</span>
        </button>
      </div>

      {/* New Donation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center space-x-2">
                <Utensils className="w-5 h-5 text-emerald-600" />
                <span>Post Food Surplus Batch</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDonation} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Food Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 60 Portions Dal Makhani, Jeera Rice & Chapatis"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FoodCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={FoodCategory.COOKED_MEALS}>Cooked Meals</option>
                    <option value={FoodCategory.HOTEL_SURPLUS}>Hotel Surplus</option>
                    <option value={FoodCategory.RESTAURANT_SURPLUS}>Restaurant Surplus</option>
                    <option value={FoodCategory.FRUITS}>Fresh Fruits</option>
                    <option value={FoodCategory.BAKERY}>Bakery Items</option>
                    <option value={FoodCategory.GROCERIES}>Packaged Groceries</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Storage Condition</label>
                  <select
                    value={storageCondition}
                    onChange={(e) => setStorageCondition(e.target.value as StorageCondition)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={StorageCondition.HOT_HEATED}>Hot / Insulated</option>
                    <option value={StorageCondition.ROOM_TEMPERATURE}>Room Temp</option>
                    <option value={StorageCondition.REFRIGERATED}>Refrigerated (Cold)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Number of Meals</label>
                  <input
                    type="number"
                    min="1"
                    value={numberOfMeals}
                    onChange={(e) => setNumberOfMeals(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Expiry (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="48"
                    value={hoursToExpiry}
                    onChange={(e) => setHoursToExpiry(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pickup Address</label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/30"
                >
                  Publish & Match NGOs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Handshake Modal */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 text-center shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold">
              <QrCode className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Volunteer Pickup Handshake</h3>
              <p className="text-xs text-slate-500">Show this QR code to the arriving volunteer courier upon pickup.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center space-y-2">
              <div className="w-40 h-40 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-2 shadow-sm">
                {/* Visual SVG QR representation */}
                <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M22,22 h6 v6 h-6 z" />
                  <path d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M72,22 h6 v6 h-6 z" />
                  <path d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M22,72 h6 v6 h-6 z" />
                  <rect x="45" y="15" width="8" height="8" />
                  <rect x="45" y="30" width="8" height="15" />
                  <rect x="60" y="55" width="10" height="10" />
                  <rect x="75" y="55" width="15" height="8" />
                  <rect x="45" y="75" width="15" height="15" />
                  <rect x="70" y="75" width="20" height="15" />
                </svg>
              </div>
              <span className="font-mono text-xs font-black tracking-wider text-slate-800">{selectedQr.qrCode}</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-left text-xs">
              <span className="text-amber-800 font-bold block">Backup Security OTP:</span>
              <span className="text-amber-950 font-mono text-lg font-black tracking-widest">{selectedQr.otpCode}</span>
            </div>

            <button
              onClick={() => setSelectedQr(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
            >
              Close Handshake Screen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
