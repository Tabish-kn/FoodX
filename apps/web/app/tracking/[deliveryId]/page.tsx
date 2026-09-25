'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  MessageSquare,
  ShieldCheck,
  Clock,
  ArrowLeft,
  Send,
  Truck,
  Building2,
  HeartHandshake
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  sender: string;
  role: string;
  text: string;
  time: string;
}

export default function DeliveryTrackingPage({ params }: { params: { deliveryId: string } }) {
  const [eta, setEta] = useState(14);
  const [distance, setDistance] = useState(4.2);
  const [courierPos, setCourierPos] = useState({ x: 42, y: 55 }); // percentage along the path

  // Live courier movement simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCourierPos((prev) => {
        const nextX = prev.x + 0.8;
        const nextY = prev.y + 0.6;
        if (nextX > 75) return { x: 75, y: 80 };
        return { x: nextX, y: nextY };
      });
      setEta((prev) => Math.max(1, prev - 1));
      setDistance((prev) => Math.max(0.2, parseFloat((prev - 0.2).toFixed(1))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Live Chat messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'Chef Vikramaditya',
      role: 'Donor (Grand Palace)',
      text: 'The 3 hot biryani containers are sealed in insulated thermal bags at Gate 1.',
      time: '12 mins ago'
    },
    {
      id: 'm2',
      sender: 'Alex Sharma',
      role: 'Volunteer Courier',
      text: 'Picked up! Food temperature verified hot. In transit on electric scooter.',
      time: '8 mins ago'
    },
    {
      id: 'm3',
      sender: 'Anna Foundation NGO',
      role: 'Shelter Hub',
      text: 'Our team is at the drop-off bay ready with trolleys for fast distribution.',
      time: '3 mins ago'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setMessages([
      ...messages,
      {
        id: `m-${Date.now()}`,
        sender: 'You',
        role: 'Live Participant',
        text: chatInput,
        time: 'Just now'
      }
    ]);
    setChatInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/volunteer"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-emerald-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks</span>
        </Link>
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>GPS Courier Tracking Live</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Map Viewport (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel p-6 rounded-3xl bg-slate-950 text-white relative h-[480px] overflow-hidden flex flex-col justify-between shadow-2xl border border-slate-800">
            {/* Interactive Vector Map Simulation Canvas */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Simulated Road Network Polyline */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 120 100 Q 250 180 340 260 T 600 380"
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="8 6"
                className="animate-pulse"
              />
            </svg>

            {/* Marker 1: Donor (Grand Palace) */}
            <div className="absolute top-[80px] left-[100px] flex flex-col items-center group cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/50 border-2 border-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700 mt-1">
                Grand Palace Hotel
              </span>
            </div>

            {/* Marker 2: Courier Vehicle (Live moving) */}
            <div
              className="absolute flex flex-col items-center transition-all duration-1000 ease-linear z-20"
              style={{ top: `${courierPos.y}%`, left: `${courierPos.x}%` }}
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/60 border-2 border-white animate-bounce">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md mt-1">
                Alex (Courier)
              </span>
            </div>

            {/* Marker 3: Destination Shelter */}
            <div className="absolute bottom-[70px] right-[120px] flex flex-col items-center group cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/50 border-2 border-white">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700 mt-1">
                Anna Foundation NGO
              </span>
            </div>

            {/* Map Top Floating Header */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700">
                <div className="text-xs text-slate-400 font-medium">Mission Progress</div>
                <div className="text-base font-bold text-emerald-400 font-display">150 Meals In Transit</div>
              </div>

              <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700 text-right">
                <div className="text-xs text-slate-400 font-medium">Estimated Arrival</div>
                <div className="text-base font-black text-amber-400 font-display">{eta} Mins ({distance} km)</div>
              </div>
            </div>

            {/* Map Bottom Status Bar */}
            <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-emerald-400 animate-spin" />
                <span className="text-slate-200 font-medium">Following Optimized Eco-Route via Outer Ring Road</span>
              </div>
              <span className="text-emerald-400 font-bold">Speed: 28 km/h</span>
            </div>
          </div>
        </div>

        {/* Right Task Details & Live Task Chat (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-3xl bg-white border border-slate-200 space-y-4 h-[480px] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 font-display">Task Coordination Chat</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                3 Online
              </span>
            </div>

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {messages.map((m) => (
                <div key={m.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">{m.sender}</strong>
                    <span className="text-[10px] text-slate-400">{m.time}</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">{m.role}</div>
                  <p className="text-slate-700 text-xs leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-100 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type coordination message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
