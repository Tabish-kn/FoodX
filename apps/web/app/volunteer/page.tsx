'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import {
  Truck,
  MapPin,
  QrCode,
  CheckCircle2,
  Navigation,
  Phone,
  MessageSquare,
  Award,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Route,
  Zap,
  Leaf,
  Layers,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface Task {
  id: string;
  donationId: string;
  title: string;
  meals: number;
  donorName: string;
  donorAddress: string;
  donorCoords: { latitude: number; longitude: number };
  ngoName: string;
  ngoAddress: string;
  ngoCoords: { latitude: number; longitude: number };
  distanceKm: number;
  rewardPoints: number;
  isUrgent: boolean;
}

const AVAILABLE_TASKS: Task[] = [
  {
    id: 'task-01',
    donationId: 'don-01',
    title: '80kg Fresh Farm Apples & Bakery Loaves',
    meals: 220,
    donorName: 'FreshMart Superstore #104',
    donorAddress: '45 South Ext Block 2, New Delhi',
    donorCoords: { latitude: 28.572, longitude: 77.221 },
    ngoName: 'Anna Foundation NGO',
    ngoAddress: '88 Okhla Phase 3 Hub, New Delhi',
    ngoCoords: { latitude: 28.535, longitude: 77.271 },
    distanceKm: 6.8,
    rewardPoints: 200,
    isUrgent: false
  },
  {
    id: 'task-02',
    donationId: 'don-02',
    title: '65 Portions Paneer Butter Masala & Roti',
    meals: 65,
    donorName: 'Spice Garden Banquet Hall',
    donorAddress: 'Ring Road Lajpat Nagar, New Delhi',
    donorCoords: { latitude: 28.567, longitude: 77.243 },
    ngoName: 'Hope & Nutrition Shelter',
    ngoAddress: '14 Lajpat Nagar IV, New Delhi',
    ngoCoords: { latitude: 28.552, longitude: 77.241 },
    distanceKm: 2.1,
    rewardPoints: 250,
    isUrgent: true
  },
  {
    id: 'task-03',
    donationId: 'don-03',
    title: '140 Trays Mixed Vegetable Pulao & Dal',
    meals: 140,
    donorName: 'Grand Hyatt Hotel Kitchens',
    donorAddress: 'Bhikaiji Cama Place, New Delhi',
    donorCoords: { latitude: 28.568, longitude: 77.187 },
    ngoName: 'Mission Hunger Relief Care Home',
    ngoAddress: 'Sarojini Nagar Distribution Point, New Delhi',
    ngoCoords: { latitude: 28.574, longitude: 77.198 },
    distanceKm: 2.4,
    rewardPoints: 180,
    isUrgent: false
  }
];

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(AVAILABLE_TASKS);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(['task-01', 'task-02']);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedRoute, setOptimizedRoute] = useState<any>(null);

  const [activeDelivery, setActiveDelivery] = useState<any>({
    id: 'del-live-01',
    title: '150 Portions Royal Veg Biryani',
    donorName: 'Grand Palace Hotel',
    donorAddress: '12 MG Road, Connaught Place',
    donorPhone: '+91 98765 43201',
    ngoName: 'Anna Foundation NGO',
    ngoAddress: '88 Okhla Phase 3 Hub',
    ngoPhone: '+91 98765 43210',
    status: 'IN_TRANSIT',
    etaMinutes: 14,
    distanceKm: 4.2
  });

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [scanType, setScanType] = useState<'PICKUP' | 'DELIVERY'>('DELIVERY');

  const toggleTaskSelection = (id: string) => {
    if (selectedTaskIds.includes(id)) {
      setSelectedTaskIds(selectedTaskIds.filter((tId) => tId !== id));
    } else {
      setSelectedTaskIds([...selectedTaskIds, id]);
    }
  };

  const handleOptimizeRoute = () => {
    setIsOptimizing(true);

    const selectedTasks = tasks.filter((t) => selectedTaskIds.includes(t.id));
    if (selectedTasks.length === 0) {
      alert('Please select at least 1 rescue task to optimize.');
      setIsOptimizing(false);
      return;
    }

    setTimeout(() => {
      // Simulate route optimizer response with precedence guarantee
      const waypoints: any[] = [];
      let stepCounter = 1;
      let cumMinutes = 8;
      let cumKm = 0;

      // 1. Pickups first
      selectedTasks.forEach((t) => {
        cumKm += parseFloat((Math.random() * 2.5 + 1.2).toFixed(1));
        cumMinutes += Math.round(Math.random() * 6 + 6);
        waypoints.push({
          stopNumber: stepCounter++,
          type: 'PICKUP',
          donationId: t.donationId,
          title: t.donorName,
          address: t.donorAddress,
          portions: t.meals,
          urgency: t.isUrgent ? 'URGENT' : 'NORMAL',
          etaMinutes: cumMinutes,
          stepDistanceKm: cumKm
        });
      });

      // 2. Dropoffs second
      selectedTasks.forEach((t) => {
        cumKm += parseFloat((Math.random() * 2.8 + 1.5).toFixed(1));
        cumMinutes += Math.round(Math.random() * 8 + 8);
        waypoints.push({
          stopNumber: stepCounter++,
          type: 'DROPOFF',
          donationId: t.donationId,
          title: t.ngoName,
          address: t.ngoAddress,
          portions: t.meals,
          urgency: t.isUrgent ? 'URGENT' : 'NORMAL',
          etaMinutes: cumMinutes,
          stepDistanceKm: cumKm
        });
      });

      const unoptimized = parseFloat(
        selectedTasks.reduce((acc, curr) => acc + curr.distanceKm * 1.6, 0).toFixed(1)
      );
      const optimized = parseFloat((unoptimized * 0.68).toFixed(1));
      const saved = parseFloat((unoptimized - optimized).toFixed(1));
      const co2 = parseFloat((saved * 0.192).toFixed(2));
      const fuelInr = parseFloat((saved * 8.5).toFixed(0));
      const totalPortions = selectedTasks.reduce((acc, curr) => acc + curr.meals, 0);

      setOptimizedRoute({
        totalStops: waypoints.length,
        unoptimizedDistanceKm: unoptimized,
        totalDistanceKm: optimized,
        distanceSavedKm: saved,
        percentageEfficiencyGain: Math.round((saved / unoptimized) * 100),
        totalEstimatedDurationMinutes: cumMinutes,
        totalPortionsRescued: totalPortions,
        co2SavedKg: co2,
        fuelCostSavedInr: fuelInr,
        waypoints
      });

      setIsOptimizing(false);
    }, 600);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScannerOpen(false);

    if (scanType === 'PICKUP') {
      setActiveDelivery({ ...activeDelivery, status: 'IN_TRANSIT' });
      alert('✅ Pickup Verified! Status changed to IN TRANSIT.');
    } else {
      setActiveDelivery({ ...activeDelivery, status: 'DELIVERED', etaMinutes: 0, distanceKm: 0 });
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      alert('🎉 Delivery Verified & Completed! +200 Reward Points added to your profile.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Courier Dispatch Portal</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Available & Online</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-display mt-1">
            {user?.fullName || 'Alex Sharma (Courier)'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Electric Scooter • Insulated Thermal Cargo Box #DL-04</p>
        </div>

        <div className="flex items-center space-x-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm text-xs">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-400 font-medium">Hero Points</div>
            <strong className="text-slate-900 font-extrabold text-sm">{user?.rewardPoints || 3400} pts</strong>
          </div>
        </div>
      </div>

      {/* Active In-Progress Delivery Mission Card */}
      {activeDelivery && (
        <div className="glass-panel p-6 rounded-3xl bg-slate-900 text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Active Delivery Mission</span>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href={`/tracking/${activeDelivery.id}`}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open GPS Live Map</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xl font-bold font-display">{activeDelivery.title}</h3>

              {/* Waypoints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 space-y-1.5">
                  <div className="text-emerald-400 font-bold uppercase text-[10px]">Pickup Location</div>
                  <div className="font-bold text-slate-100">{activeDelivery.donorName}</div>
                  <div className="text-slate-400 truncate">{activeDelivery.donorAddress}</div>
                  <div className="pt-1 flex items-center space-x-2 text-emerald-400">
                    <Phone className="w-3 h-3" />
                    <span>{activeDelivery.donorPhone}</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 space-y-1.5">
                  <div className="text-amber-400 font-bold uppercase text-[10px]">Dropoff Shelter</div>
                  <div className="font-bold text-slate-100">{activeDelivery.ngoName}</div>
                  <div className="text-slate-400 truncate">{activeDelivery.ngoAddress}</div>
                  <div className="pt-1 flex items-center space-x-2 text-amber-400">
                    <Phone className="w-3 h-3" />
                    <span>{activeDelivery.ngoPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 text-center space-y-3">
              <div>
                <div className="text-2xl font-black font-display text-emerald-400">
                  {activeDelivery.status === 'DELIVERED' ? 'COMPLETED' : `${activeDelivery.etaMinutes} Mins`}
                </div>
                <div className="text-[11px] text-slate-400">
                  {activeDelivery.status === 'DELIVERED' ? 'All portions distributed' : `${activeDelivery.distanceKm} km remaining`}
                </div>
              </div>

              {activeDelivery.status !== 'DELIVERED' ? (
                <button
                  onClick={() => {
                    setScanType('DELIVERY');
                    setIsScannerOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-extrabold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/20"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan Shelter Drop-Off QR</span>
                </button>
              ) : (
                <div className="py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 font-bold text-xs flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mission Accomplished</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NEW FEATURE: AI Multi-Stop Route Optimizer & Multi-Waypoint Batching */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white space-y-6 shadow-xl border border-teal-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-teal-500/20 text-teal-400">
                <Route className="w-5 h-5" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-teal-300">
                AI Smart Multi-Stop Route Optimizer
              </span>
            </div>
            <h2 className="text-xl font-bold font-display text-white">
              Multi-Pickup & Multi-Drop Batching Engine
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Combine multiple nearby food surplus runs into a single optimized circuit. Satisfies pickup-before-dropoff precedence, saves travel time, and reduces carbon footprint.
            </p>
          </div>

          <button
            onClick={handleOptimizeRoute}
            disabled={isOptimizing || selectedTaskIds.length === 0}
            className="px-5 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-teal-500/25 shrink-0"
          >
            <Zap className="w-4 h-4" />
            <span>{isOptimizing ? 'Optimizing Itinerary...' : `Optimize Selected (${selectedTaskIds.length})`}</span>
          </button>
        </div>

        {/* Selected Tasks Chip Matrix */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Select Tasks to Include in Circuit:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tasks.map((task) => {
              const isSelected = selectedTaskIds.includes(task.id);
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTaskSelection(task.id)}
                  className={`cursor-pointer p-3.5 rounded-2xl border transition text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-teal-950/70 border-teal-500 text-white'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold truncate text-slate-200">{task.donorName}</span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="rounded border-slate-600 text-teal-500 focus:ring-0"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{task.meals} meals</span>
                    <span className="font-semibold text-teal-400">➔ {task.ngoName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optimized Output Itinerary & Metric Gauges */}
        {optimizedRoute && (
          <div className="pt-4 border-t border-slate-800 space-y-6 animate-in fade-in">
            {/* Efficiency KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
                <div className="text-[10px] uppercase font-bold text-slate-400">Optimized Distance</div>
                <div className="text-xl font-black text-teal-400">{optimizedRoute.totalDistanceKm} km</div>
                <div className="text-[10px] text-emerald-400 font-bold">-{optimizedRoute.distanceSavedKm} km saved</div>
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Duration</div>
                <div className="text-xl font-black text-white">{optimizedRoute.totalEstimatedDurationMinutes} mins</div>
                <div className="text-[10px] text-slate-400">{optimizedRoute.totalStops} stops circuit</div>
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
                <div className="text-[10px] uppercase font-bold text-slate-400">CO₂ Offset</div>
                <div className="text-xl font-black text-emerald-400 flex items-center justify-center space-x-1">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span>{optimizedRoute.co2SavedKg} kg</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">+{optimizedRoute.percentageEfficiencyGain}% Efficiency</div>
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
                <div className="text-[10px] uppercase font-bold text-slate-400">Portions Rescued</div>
                <div className="text-xl font-black text-amber-400">{optimizedRoute.totalPortionsRescued}</div>
                <div className="text-[10px] text-slate-400">₹{optimizedRoute.fuelCostSavedInr} fuel saved</div>
              </div>
            </div>

            {/* Turn-by-Turn Waypoints Stepper */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Turn-by-Turn Optimized Route Itinerary:
              </div>
              <div className="space-y-2">
                {optimizedRoute.waypoints.map((wp: any) => (
                  <div
                    key={wp.stopNumber}
                    className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/70 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-teal-400/20 text-teal-300 font-black text-[11px] flex items-center justify-center shrink-0">
                        {wp.stopNumber}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                              wp.type === 'PICKUP'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {wp.type}
                          </span>
                          <span className="font-bold text-slate-100">{wp.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-md">{wp.address}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-teal-400">ETA: {wp.etaMinutes}m</div>
                      <div className="text-[10px] text-slate-400">{wp.portions} portions</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Available Volunteer Tasks Feed */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Available Delivery Runs Nearby</h2>
          <p className="text-xs text-slate-500">Claim single runs or select multiple for batch circuit delivery</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tasks.map((task) => (
            <div key={task.id} className="glass-panel p-5 rounded-2xl bg-white space-y-4 border border-slate-200 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    +{task.rewardPoints} Points
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{task.title}</h3>
                </div>
                <span className="text-xs font-bold text-slate-500">{task.distanceKm} km total</span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-semibold text-slate-900">From:</span>
                  <span className="truncate">{task.donorName} ({task.donorAddress})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-semibold text-slate-900">To:</span>
                  <span className="truncate">{task.ngoName} ({task.ngoAddress})</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveDelivery({
                    id: task.id,
                    title: task.title,
                    donorName: task.donorName,
                    donorAddress: task.donorAddress,
                    donorPhone: '+91 98765 43201',
                    ngoName: task.ngoName,
                    ngoAddress: task.ngoAddress,
                    ngoPhone: '+91 98765 43210',
                    status: 'PICKUP_EN_ROUTE',
                    etaMinutes: 18,
                    distanceKm: task.distanceKm
                  });
                  setTasks(tasks.filter((t) => t.id !== task.id));
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition"
              >
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Accept Delivery Task</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* QR Scanner & OTP Handshake Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold">
              <QrCode className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {scanType === 'PICKUP' ? 'Donor Pickup Verification' : 'Shelter Drop-Off Verification'}
              </h3>
              <p className="text-xs text-slate-500">Scan recipient QR code or enter their 6-digit verification OTP.</p>
            </div>

            {/* Camera Viewfinder Simulation */}
            <div className="w-full h-44 bg-slate-900 rounded-2xl relative flex items-center justify-center overflow-hidden border border-slate-800">
              <div className="w-32 h-32 border-2 border-emerald-400 rounded-xl relative animate-pulse flex items-center justify-center">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Align QR Code</span>
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-3 text-xs text-left">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Enter 6-digit OTP Handshake</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 719384"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-center tracking-widest text-lg font-bold"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  Verify Handshake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
