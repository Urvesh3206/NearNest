"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wrench, 
  Clock, 
  Star, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Calendar, 
  DollarSign,
  ShieldCheck,
  Zap,
  Mail
} from 'lucide-react';
import { RbacProfileSwitcher } from '@/components/auth/RbacProfileSwitcher';
import { useAuth } from '@/providers/AuthProvider';
import toast from 'react-hot-toast';

export default function ServiceDashboardPage() {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services/book')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setBookings(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkDone = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'COMPLETED' } : b))
    );
    toast.success('Work order marked completed!');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Interactive RBAC Switcher Banner */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary">
            Interactive Test Hub
          </span>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
            🔧 Service Pro Zone (/dashboard/service)
          </span>
        </div>
        <RbacProfileSwitcher />
      </div>

      {/* Service Header */}
      <div className="bg-surface border border-border-hairline rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold">
              SERVICE_PROVIDER Specification
            </span>
            <span className="text-xs text-text-tertiary">Lic: MH-ELEC-48201</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-2">
            Service Pro Console: {user?.name || 'Rajesh Electrician'}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Society technician schedule: Track doorstep repair requests, manage rate cards, and direct dial resident flats.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <Link
            href="/join-pro"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Join as New Pro</span>
          </Link>

          {/* Realtime Availability Switch */}
          <div className="flex items-center gap-3 bg-surface-subtle p-2 rounded-2xl border border-border-hairline shrink-0">
            <div className="text-right">
              <span className="text-xs font-bold text-text-primary block">
                {isAvailable ? 'Available for Jobs' : 'Marked as Busy'}
              </span>
              <span className="text-[10px] text-text-tertiary">Rate: ₹299 / Visit</span>
            </div>
            <button
              onClick={() => {
                setIsAvailable(!isAvailable);
                toast.success(`Schedule status: ${!isAvailable ? 'Available' : 'Busy'}`);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                isAvailable ? 'bg-blue-600' : 'bg-slate-400'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isAvailable ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Service KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Client Rating', val: '4.9 ★ (142 Reviews)', icon: Star, color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Society Visits', val: '340+ Completed', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Hourly Rate', val: '₹299/visit', icon: DollarSign, color: 'text-blue-500 bg-blue-500/10' },
          { label: 'Avg Arrival Time', val: '25 Minutes', icon: Clock, color: 'text-purple-500 bg-purple-500/10' },
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

      {/* Two Column Grid: Incoming Work Orders & Rate Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incoming Work Orders */}
        <div className="lg:col-span-2 bg-surface border border-border-hairline rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <span>Incoming Society Work Orders</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 font-bold">
              Gmail Dispatch Active
            </span>
          </div>

          {loading ? (
            <div className="py-10 text-center text-xs text-text-tertiary">Loading work orders...</div>
          ) : bookings.length === 0 ? (
            <div className="py-10 text-center text-xs text-text-tertiary">No active work orders right now.</div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-surface-subtle border border-border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-text-primary">
                        {b.serviceDescription || 'Electrical Repair'}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 font-bold uppercase">
                        {b.status || 'CONFIRMED'}
                      </span>
                    </div>

                    <p className="text-xs text-text-secondary mt-1">
                      Resident Flat: <strong className="text-text-primary">{b.address || 'Tower B - Flat 402'}</strong>
                    </p>
                    <p className="text-[11px] text-text-tertiary mt-0.5">
                      Scheduled: {b.scheduledDate || 'Today'} at {b.scheduledTime || '4:00 PM'} • Est: {b.totalPrice || '₹299'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href="tel:+919876543210"
                      className="p-2 rounded-xl bg-surface border border-border-hairline hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors"
                      title="Call Resident"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => {
                        window.open(`https://api.whatsapp.com/send?phone=919876543210&text=Hi,%20this%20is%20Rajesh%20Electrician.%20I%20am%20on%20my%20way%20to%20your%20flat.`, '_blank');
                      }}
                      className="p-2 rounded-xl bg-surface border border-border-hairline hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors"
                      title="WhatsApp Resident"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-500" />
                    </button>
                    {b.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleMarkDone(b.id)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm"
                      >
                        Done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rate Card & Verified License */}
        <div className="bg-surface border border-border-hairline rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Standard Society Rates</span>
            </h3>
          </div>

          <div className="space-y-2.5">
            {[
              { task: 'General Electrical Inspection', price: '₹199' },
              { task: 'Ceiling Fan Installation / Fix', price: '₹249' },
              { task: 'MCB Tripping / Short Circuit', price: '₹349' },
              { task: 'Inverter Wiring & Battery Check', price: '₹499' },
              { task: 'Emergency Night Visit (10pm-6am)', price: '₹599' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-subtle border border-border-hairline">
                <span className="text-xs font-medium text-text-primary">{item.task}</span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">{item.price}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border-hairline">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <div className="text-[11px] leading-tight">
                <strong>Government Certified & Background Checked:</strong> License active until Dec 2028.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
