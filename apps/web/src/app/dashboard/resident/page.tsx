"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  QrCode, 
  Receipt, 
  Wrench, 
  AlertCircle, 
  Share2, 
  Phone, 
  CheckCircle2, 
  ArrowRight,
  MessageCircle,
  Home
} from 'lucide-react';
import { RbacProfileSwitcher } from '@/components/auth/RbacProfileSwitcher';
import { useAuth } from '@/providers/AuthProvider';
import toast from 'react-hot-toast';

export default function ResidentDashboardPage() {
  const { user } = useAuth();
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [purpose, setPurpose] = useState('Delivery / Guest');
  const [gatePassGenerated, setGatePassGenerated] = useState<any>(null);

  const handleGenerateGatePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName) {
      toast.error('Please enter visitor name');
      return;
    }
    const newPass = {
      passCode: `GATE-${Math.floor(1000 + Math.random() * 9000)}`,
      visitorName,
      visitorPhone: visitorPhone || 'N/A',
      purpose,
      unit: user?.unit || 'Tower B - Flat 402',
      validUntil: 'Today, 11:59 PM',
      qrText: `NEIS-PASS-${Date.now()}`,
    };
    setGatePassGenerated(newPass);
    toast.success(`Visitor Gate Pass Generated: ${newPass.passCode}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Interactive RBAC Switcher Banner */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary">
            Interactive Test Hub
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            🏡 Resident Zone (/dashboard/resident)
          </span>
        </div>
        <RbacProfileSwitcher />
      </div>

      {/* Resident Header */}
      <div className="bg-surface border border-border-hairline rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
              RESIDENT Specification
            </span>
            <span className="text-xs text-text-tertiary">Unit: {user?.unit || 'Tower B - 402'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-2">
            Resident Portal: {user?.name || 'Aarav Patel'}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Access your society flat amenities, generate instant visitor QR gate passes, pay maintenance, and connect with neighbors.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/society"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-subtle hover:bg-surface border border-border-hairline text-text-primary font-semibold text-xs transition-all"
          >
            <Home className="w-4 h-4 text-emerald-500" />
            <span>Society Hub</span>
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Resident Chat</span>
          </Link>
        </div>
      </div>

      {/* Resident KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Society Flat Unit', val: user?.unit || 'Tower B - 402', icon: Home, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'October Maintenance', val: 'Paid ₹3,500', icon: Receipt, color: 'text-blue-500 bg-blue-500/10' },
          { label: 'Active Hired Services', val: '1 In Progress', icon: Wrench, color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Active Gate Passes', val: '2 Today', icon: QrCode, color: 'text-purple-500 bg-purple-500/10' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-surface border border-border-hairline rounded-2xl p-5 shadow-card">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs text-text-tertiary font-medium">{kpi.label}</p>
              <h3 className="text-xl font-bold text-text-primary mt-0.5">{kpi.val}</h3>
            </div>
          );
        })}
      </div>

      {/* Interactive Tool 1: Instant Visitor Gate Pass Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-border-hairline rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-500" />
              <span>Generate Instant Visitor QR Gate Pass</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
              Instant Entry
            </span>
          </div>

          <form onSubmit={handleGenerateGatePass} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Visitor Name</label>
              <input
                type="text"
                placeholder="e.g. Swiggy Delivery / Friend"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border-hairline bg-surface-subtle focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Phone (Optional)</label>
              <input
                type="text"
                placeholder="+91 98765 00000"
                value={visitorPhone}
                onChange={(e) => setVisitorPhone(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border-hairline bg-surface-subtle focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Purpose</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border-hairline bg-surface-subtle focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Delivery / Guest">Delivery / Food</option>
                <option value="Family / Relative">Family / Relative</option>
                <option value="Cab Driver (Uber/Ola)">Cab / Taxi</option>
                <option value="Maintenance Worker">Maintenance Worker</option>
              </select>
            </div>
            <div className="sm:col-span-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md"
              >
                ⚡ Generate Digital QR Pass
              </button>
            </div>
          </form>

          {gatePassGenerated && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-600 uppercase font-bold tracking-wider">
                  Active Entry Pass Generated
                </span>
                <h4 className="text-lg font-bold text-text-primary mt-0.5">
                  {gatePassGenerated.passCode} • {gatePassGenerated.visitorName}
                </h4>
                <p className="text-xs text-text-secondary mt-0.5">
                  Authorized for {gatePassGenerated.unit} • Valid until {gatePassGenerated.validUntil}
                </p>
              </div>

              <button
                onClick={() => {
                  const text = `NearNest Security Gate Pass for ${gatePassGenerated.visitorName}: PassCode ${gatePassGenerated.passCode} for Unit ${gatePassGenerated.unit}. Valid: ${gatePassGenerated.validUntil}`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shrink-0 hover:bg-emerald-700 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share via WhatsApp</span>
              </button>
            </div>
          )}
        </div>

        {/* Resident Emergency Contact Card */}
        <div className="bg-surface border border-border-hairline rounded-3xl p-6 shadow-card space-y-4">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-500" />
            <span>Society Gate & Emergency</span>
          </h3>
          <p className="text-xs text-text-tertiary">
            Direct 1-tap connection with society staff.
          </p>

          <div className="space-y-2 pt-1">
            {[
              { name: 'Security Main Gate', contact: 'Intercom #101', tel: 'tel:101' },
              { name: 'Society Facility Manager', contact: '+91 93735 71631', tel: 'tel:+919373571631' },
              { name: 'Lifeline Hospital (1.2 km)', contact: '+91 20 2740 0000', tel: 'tel:+912027400000' },
            ].map((em, i) => (
              <a
                key={i}
                href={em.tel}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle hover:bg-surface border border-border-hairline transition-all group"
              >
                <div>
                  <span className="text-xs font-bold text-text-primary block">{em.name}</span>
                  <span className="text-[11px] text-text-tertiary font-mono">{em.contact}</span>
                </div>
                <Phone className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
