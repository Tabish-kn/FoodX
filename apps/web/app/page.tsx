'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  Utensils,
  Truck,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Users,
  Building,
  TrendingUp,
  Award,
  ChevronRight,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { UserRole } from '@foodx/shared-types';

export default function HomePage() {
  const { switchRoleDemo } = useAuth();
  const [activeTab, setActiveTab] = useState<'donors' | 'ngos' | 'volunteers'>('donors');

  // Live impact counters ticker simulation
  const [mealsCount, setMealsCount] = useState(14820);
  useEffect(() => {
    const timer = setInterval(() => {
      setMealsCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. Live Emergency Banner Ticker */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white py-2.5 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm font-semibold">
          <div className="flex items-center space-x-2 animate-pulse">
            <span className="bg-white text-rose-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              EMERGENCY RELIEF
            </span>
            <span>🚨 120 hot meals urgently needed for Night Shelter, Lajpat Nagar IV</span>
          </div>
          <Link
            href="/donor"
            className="hidden md:inline-flex items-center space-x-1 underline hover:text-amber-100 transition"
          >
            <span>Claim & Donate Now</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12">
        {/* Background decorative glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-400/15 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-amber-400/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 border border-emerald-300/60 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AI-Powered Real-Time Food Rescue Network</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] font-display">
              Turn Daily Surplus Food into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Immediate Hope.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Every day, restaurants and supermarkets discard thousands of fresh meals while nearby shelters struggle. FoodX uses smart AI matching and real-time volunteer courier tracking to bridge the gap in under 60 minutes.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/donor"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition flex items-center justify-center space-x-2"
              >
                <Utensils className="w-4 h-4" />
                <span>Donate Surplus Food</span>
              </Link>
              <Link
                href="/volunteer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300/90 shadow-sm hover:-translate-y-0.5 transition flex items-center justify-center space-x-2"
              >
                <Truck className="w-4 h-4 text-amber-500" />
                <span>Volunteer Courier</span>
              </Link>
              <Link
                href="/beneficiary"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 font-bold text-sm border border-amber-200 transition flex items-center justify-center space-x-2"
              >
                <HeartHandshake className="w-4 h-4 text-amber-600" />
                <span>Find Food Aid</span>
              </Link>
            </div>

            {/* Live Counter Stats */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                  {mealsCount.toLocaleString()}+
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Meals Rescued</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-display">
                  37.1 tons
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">CO₂ Landfill Prevented</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-display">
                  100%
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Verified NGO Partners</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Card / Live Simulation Card */}
          <div className="lg:col-span-5 relative">
            <div className="glass-panel p-6 rounded-3xl shadow-xl shadow-slate-200/50 space-y-5 relative overflow-hidden bg-white/95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live Rescue Courier in Transit</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ETA 14 Mins
                </span>
              </div>

              {/* Sample In-transit delivery snippet */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 font-bold">
                    🍲
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">150 Portions Royal Veg Biryani</h4>
                    <p className="text-xs text-slate-500 truncate">Grand Palace Hotel ➔ Anna Foundation NGO</p>
                  </div>
                </div>

                {/* Logistics Route Stepper */}
                <div className="space-y-2 py-1 px-1">
                  <div className="flex items-center space-x-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                    <span className="text-slate-700 font-medium">Picked up with QR Code verification</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold animate-pulse">🚚</div>
                    <span className="text-amber-700 font-semibold">Courier Alex en route (4.2 km remaining)</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs opacity-50">
                    <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">3</div>
                    <span className="text-slate-500">Destination drop-off & shelter distribution</span>
                  </div>
                </div>

                <Link
                  href="/tracking/active-demo-01"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Live Interactive GPS Map</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works (Visual 4-Step Pipeline) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600">Seamless & Tamper-Proof</h2>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">How the FoodX Rescue Pipeline Works</h3>
          <p className="text-slate-600 text-sm sm:text-base">
            Engineered with strict FSSAI food safety parameters, cryptographic dual-QR tokens, and automated volunteer dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="glass-panel p-6 rounded-2xl relative space-y-4 hover:-translate-y-1 transition duration-200 bg-white">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">
              01
            </div>
            <h4 className="text-lg font-bold text-slate-900">Donor Posts Surplus</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hotels, banquet halls, or supermarkets list quantity, dietary flags, preparation time, and best-before window.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-6 rounded-2xl relative space-y-4 hover:-translate-y-1 transition duration-200 bg-white">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-lg">
              02
            </div>
            <h4 className="text-lg font-bold text-slate-900">AI Smart Matching</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our algorithm scores proximity, intake capacity, and dietary compatibility to instantly notify verified shelter partners.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-6 rounded-2xl relative space-y-4 hover:-translate-y-1 transition duration-200 bg-white">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-lg">
              03
            </div>
            <h4 className="text-lg font-bold text-slate-900">Courier Dispatch</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Volunteer couriers accept the task, navigate to the kitchen, and perform secure QR Code + OTP pickup verification.
            </p>
          </div>

          {/* Step 4 */}
          <div className="glass-panel p-6 rounded-2xl relative space-y-4 hover:-translate-y-1 transition duration-200 bg-white">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-lg">
              04
            </div>
            <h4 className="text-lg font-bold text-slate-900">Shelter Distribution</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              NGO scans final delivery token, meals feed beneficiaries, and impact certificates & badges are awarded automatically.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Interactive Portal Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 mb-8">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Role Portals</span>
            <h3 className="text-3xl sm:text-4xl font-black font-display">Dedicated Workspaces for Every Stakeholder</h3>
            <p className="text-slate-400 text-sm">
              Click below to explore the custom dashboards tailored for donors, charities, and logistics couriers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-bold text-white">Food Donors</h4>
              <p className="text-xs text-slate-400">
                Post surplus food batches with expiry countdowns, monitor volunteer pickups, and generate sustainability tax certificates.
              </p>
              <Link
                href="/donor"
                onClick={() => switchRoleDemo(UserRole.DONOR)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                <span>Launch Donor Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-bold text-white">NGOs & Shelters</h4>
              <p className="text-xs text-slate-400">
                Browse available nearby surplus, filter by dietary requirements, file emergency meal requests, and manage distribution.
              </p>
              <Link
                href="/ngo"
                onClick={() => switchRoleDemo(UserRole.NGO)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
              >
                <span>Launch NGO Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-bold text-white">Volunteer Couriers</h4>
              <p className="text-xs text-slate-400">
                Accept rapid transport tasks, stream live GPS tracking, perform QR/OTP handshakes, and climb the Hero Leaderboard.
              </p>
              <Link
                href="/volunteer"
                onClick={() => switchRoleDemo(UserRole.VOLUNTEER)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-400 hover:text-teal-300"
              >
                <span>Launch Courier Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Community Kitchens Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Zero-Waste Community Kitchens</span>
            <h3 className="text-3xl font-black text-slate-900 font-display">Serving 1,200+ Daily Warm Meals from Surplus Raw Ingredients</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our partner community kitchens convert bulk raw produce (fruits, grains, dairy, and vegetables) from supermarkets into wholesome, sanitized meals served daily to daily-wage workers and children.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Central Jan Aahar Kitchen: 640/1,200 meals served today</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% compliant with clean water & hygienic food prep standards</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80"
                alt="Community Kitchen Volunteers"
                className="w-full h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-sm font-bold">Jan Aahar Community Hub #1</div>
                  <div className="text-xs text-slate-300">Near AIIMS Metro Station, New Delhi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-black text-slate-900 font-display">Frequently Asked Questions</h3>
          <p className="text-sm text-slate-500">Everything you need to know about food safety and the FoodX network.</p>
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl bg-white space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>How do you guarantee food safety for cooked surplus?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">
              All donors specify preparation and strict best-before timestamps. Perishable donations expiring within 3 hours are flagged as high/urgent priority, requiring insulated thermal logistics and immediate delivery directly to shelter kitchens.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl bg-white space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>How does the QR + OTP verification prevent fraudulent deliveries?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">
              Every donation listing generates cryptographically unique pickup and delivery tokens. The volunteer courier must scan the donor&apos;s QR code and submit the donor&apos;s OTP before the food can leave the premises.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl bg-white space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Can restaurants receive CSR and tax deduction certificates?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">
              Yes! Every verified completed donation automatically logs kilograms rescued and generates printable, auditable sustainability certificates in the donor dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-10 sm:p-16 text-center space-y-6 shadow-xl shadow-emerald-600/20">
          <h3 className="text-3xl sm:text-4xl font-black font-display max-w-2xl mx-auto">
            Ready to Make Zero Hunger a Reality in Your City?
          </h3>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
            Join hundreds of food businesses, volunteers, and certified NGOs creating an equitable, hunger-free world.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/donor"
              className="px-8 py-3.5 rounded-xl bg-white text-emerald-800 font-bold text-sm hover:bg-emerald-50 transition shadow-md"
            >
              List a Food Donation
            </Link>
            <Link
              href="/volunteer"
              className="px-8 py-3.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-400/50 font-bold text-sm transition"
            >
              Join as a Volunteer Courier
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
