"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Store, 
  ShoppingBag, 
  Clock, 
  Star, 
  Plus, 
  CheckCircle2, 
  Bike, 
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { RbacProfileSwitcher } from '@/components/auth/RbacProfileSwitcher';
import { useAuth } from '@/providers/AuthProvider';
import toast from 'react-hot-toast';

export default function BusinessDashboardPage() {
  const { user } = useAuth();
  const [isOpenForOrders, setIsOpenForOrders] = useState(true);
  const [flashDeals, setFlashDeals] = useState([
    { id: '1', title: '20% OFF Organic Alphonso Mangoes', code: 'MANGO20', active: true },
    { id: '2', title: 'Free Doorstep Delivery on orders above ₹299', code: 'FREEDEL', active: true },
  ]);
  const [newDealTitle, setNewDealTitle] = useState('');

  const [orders, setOrders] = useState([
    { id: 'ORD-9021', customer: 'Aarav Patel', unit: 'Tower B - 402', items: '2L Cow Milk, 1kg Brown Bread', amount: '₹185', time: '8 mins ago', status: 'Out for Delivery' },
    { id: 'ORD-9022', customer: 'Sneha Kulkarni', unit: 'Tower A - 204', items: '5kg Aashirvaad Atta, 1L Sunflower Oil', amount: '₹420', time: '14 mins ago', status: 'Delivered' },
  ]);

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealTitle.trim()) return;
    const newDeal = {
      id: Date.now().toString(),
      title: newDealTitle.trim(),
      code: `DEAL${Math.floor(100 + Math.random() * 900)}`,
      active: true,
    };
    setFlashDeals([newDeal, ...flashDeals]);
    setNewDealTitle('');
    toast.success('Live Daily Offer Published to Society Feed!');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Interactive RBAC Switcher Banner */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary">
            Interactive Test Hub
          </span>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            🏪 Business Owner Zone (/dashboard/business)
          </span>
        </div>
        <RbacProfileSwitcher />
      </div>

      {/* Business Header */}
      <div className="bg-surface border border-border-hairline rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold">
              BUSINESS Specification
            </span>
            <span className="text-xs text-text-tertiary">{user?.society || 'Ajeenkya Commercial Complex'} • Shop 12</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-2">
            Green Mart Organic Groceries (Priya Sharma)
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Society merchant console: Manage instant doorstep deliveries, publish flash offers, and check resident ratings.
          </p>
        </div>

        {/* Store Active Status Toggle */}
        <div className="flex items-center gap-3 bg-surface-subtle p-2 rounded-2xl border border-border-hairline shrink-0">
          <div className="text-right">
            <span className="text-xs font-bold text-text-primary block">
              {isOpenForOrders ? 'Store Open & Accepting' : 'Orders Paused'}
            </span>
            <span className="text-[10px] text-text-tertiary">Doorstep Dispatch: 15 mins</span>
          </div>
          <button
            onClick={() => {
              setIsOpenForOrders(!isOpenForOrders);
              toast.success(`Store status updated: ${!isOpenForOrders ? 'Open' : 'Paused'}`);
            }}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
              isOpenForOrders ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                isOpenForOrders ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Business KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Store Rating', val: '4.9 ★ (86 Reviews)', icon: Star, color: 'text-amber-500 bg-amber-500/10' },
          { label: "Today's Deliveries", val: '28 Doorsteps', icon: Bike, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Avg Delivery Speed', val: '15 Minutes', icon: Clock, color: 'text-blue-500 bg-blue-500/10' },
          { label: "Today's Volume", val: '₹6,420', icon: TrendingUp, color: 'text-purple-500 bg-purple-500/10' },
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

      {/* Two Column Grid: Doorstep Delivery Queue & Flash Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doorstep Delivery Orders */}
        <div className="lg:col-span-2 bg-surface border border-border-hairline rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <span>Society Doorstep Orders Queue</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 font-bold">
              Live Fulfillment
            </span>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-surface-subtle border border-border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-text-tertiary">{ord.id}</span>
                    <span className="text-sm font-bold text-text-primary">{ord.customer}</span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      {ord.unit}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{ord.items}</p>
                  <span className="text-[10px] text-text-tertiary mt-0.5 block">{ord.time}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-extrabold text-text-primary">{ord.amount}</span>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    ord.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600 animate-pulse'
                  }`}>
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Publish Daily Flash Deals */}
        <div className="bg-surface border border-border-hairline rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Broadcast Flash Deal</span>
            </h3>
          </div>

          <form onSubmit={handleAddDeal} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">
                Society Flash Deal Text
              </label>
              <input
                type="text"
                placeholder="e.g. 15% OFF Cold-Pressed Mustard Oil"
                value={newDealTitle}
                onChange={(e) => setNewDealTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border-hairline bg-surface-subtle focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-md"
            >
              🚀 Publish Deal to Resident Feed
            </button>
          </form>

          <div className="space-y-2 pt-2 border-t border-border-hairline">
            <span className="text-[10px] uppercase font-mono text-text-tertiary tracking-wider block">
              Active Society Offers:
            </span>
            {flashDeals.map((d) => (
              <div key={d.id} className="p-3 rounded-xl bg-surface-subtle border border-border-hairline flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-text-primary block">{d.title}</span>
                  <span className="text-[10px] font-mono text-amber-600 font-bold">Use Code: {d.code}</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
