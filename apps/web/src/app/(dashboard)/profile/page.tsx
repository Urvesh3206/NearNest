"use client";

import React, { useState, useEffect } from 'react';
import { 
  Camera, MapPin, Building2, Calendar, Edit3, Phone, Mail, ShieldCheck, 
  LogOut, QrCode, CreditCard, Wrench, Store, Plus, CheckCircle2, 
  Clock, AlertTriangle, ExternalLink, Download, FileText, Send, 
  Sparkles, MessageSquare, Star, ArrowRight, User, Check, RefreshCw
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { UserRole } from '@/types';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, logout, switchRole } = useAuth();
  const currentRole: UserRole = user?.role || 'RESIDENT';

  // Role-specific active tab state
  const [residentTab, setResidentTab] = useState<'passes' | 'dues' | 'services' | 'complaints' | 'emergency'>('passes');
  const [businessTab, setBusinessTab] = useState<'store' | 'orders' | 'reviews' | 'contact'>('store');
  const [serviceTab, setServiceTab] = useState<'workorders' | 'rates' | 'skills' | 'reviews' | 'email'>('workorders');
  const [adminTab, setAdminTab] = useState<'governance' | 'broadcast' | 'financials' | 'system'>('governance');

  // Interactive states for Resident features
  const [visitorName, setVisitorName] = useState('');
  const [visitorVehicle, setVisitorVehicle] = useState('');
  const [visitorPurpose, setVisitorPurpose] = useState('Guest / Family Visit');
  const [generatedPass, setGeneratedPass] = useState<any>(null);

  // Interactive states for Business features
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [dealTitle, setDealTitle] = useState('');
  const [dealDiscount, setDealDiscount] = useState('20% OFF');
  const [deals, setDeals] = useState([
    { id: 'd1', title: 'Fresh Farm Organic Tomatoes & Greens', discount: '20% OFF', code: 'SOCIETY20', expiry: 'Today Only' },
    { id: 'd2', title: 'Buy 2 Get 1 Free on Fresh Farm Dairy Butter', discount: 'B2G1 FREE', code: 'DAIRYFREE', expiry: 'This Weekend' },
  ]);

  // Interactive states for Service Provider features
  const [isAvailableToday, setIsAvailableToday] = useState(true);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Load real bookings from database for work orders
  useEffect(() => {
    async function loadBookings() {
      setLoadingOrders(true);
      try {
        const res = await fetch('/api/services/book');
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings) && data.bookings.length > 0) {
          setWorkOrders(data.bookings);
        } else {
          // Fallback mock bookings
          setWorkOrders([
            {
              id: 'book_demo_1',
              providerName: user?.name || 'Rajesh Kumar',
              residentName: 'Priya Deshmukh',
              residentPhone: '+91 98901 54321',
              unitAddress: 'Flat 304, Tower C, Ajeenkya Residency',
              serviceRequired: 'Kitchen sink pipe repair & master tap installation',
              date: '2026-10-16',
              time: '11:00 AM',
              rate: '₹250/hr',
              status: 'CONFIRMED',
            },
            {
              id: 'book_demo_2',
              providerName: user?.name || 'Rajesh Kumar',
              residentName: 'Aarav Patel',
              residentPhone: '+91 98765 43210',
              unitAddress: 'Flat 402, Tower B, Ajeenkya Residency',
              serviceRequired: 'MCB tripping fix & electrical circuit diagnostics',
              date: '2026-10-17',
              time: '03:30 PM',
              rate: '₹250/hr',
              status: 'CONFIRMED',
            },
          ]);
        }
      } catch (e) {
        console.warn('Could not load bookings:', e);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadBookings();
  }, [currentRole, user]);

  const handleGeneratePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) {
      toast.error('Please enter the visitor name');
      return;
    }
    const newPass = {
      id: `PASS-${Math.floor(1000 + Math.random() * 9000)}`,
      name: visitorName,
      vehicle: visitorVehicle || 'Walking / Cab',
      purpose: visitorPurpose,
      validUntil: 'Today, 11:59 PM',
      society: user?.society || 'Ajeenkya Residency',
      unit: user?.unit || 'Unit 402, Tower B',
    };
    setGeneratedPass(newPass);
    toast.success(`Digital Gate Pass generated for ${visitorName}!`);
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle.trim()) {
      toast.error('Please enter deal description');
      return;
    }
    setDeals([
      { id: `d_${Date.now()}`, title: dealTitle, discount: dealDiscount, code: 'NEIGHBOR10', expiry: 'Active' },
      ...deals,
    ]);
    setDealTitle('');
    toast.success('Society deal published to community feed!');
  };

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">
      {/* Role Profile Switcher Bar (Quick Navigation Bar) */}
      <div className="bg-surface rounded-2xl border border-border-hairline p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-500/10 text-brand-600 rounded-xl">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-text-primary">Profile Specification Modes</h2>
            <p className="text-[11px] text-text-secondary">
              Viewing customized profile features tailored for: <span className="font-bold text-brand-600">{currentRole}</span>
            </p>
          </div>
        </div>

        {/* 4 Dedicated Profile Switcher Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { role: 'RESIDENT', label: '🏡 Resident', desc: 'Aarav Patel' },
            { role: 'BUSINESS', label: '🏪 Business Owner', desc: 'Priya Sharma' },
            { role: 'SERVICE_PROVIDER', label: '🔧 Service Pro', desc: 'Rajesh Electrician' },
            { role: 'ADMIN', label: '👑 Super Admin', desc: 'Urvesh Rane' },
          ].map((item) => {
            const isSelected = item.role === currentRole;
            return (
              <button
                key={item.role}
                onClick={() => {
                  switchRole(item.role as UserRole);
                  toast.success(`Switched to ${item.label} Profile!`, { icon: '✨' });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-brand-500 text-white shadow-md scale-[1.02]'
                    : 'bg-surface-subtle text-text-secondary hover:text-text-primary hover:bg-surface border border-border-hairline'
                }`}
              >
                <span>{item.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Profile Card Header */}
      <div className="bg-surface rounded-3xl border border-border-hairline overflow-hidden shadow-card">
        {/* Cover Photo */}
        <div 
          className="relative h-44 sm:h-56 bg-cover bg-center"
          style={{
            backgroundImage: `url('${user?.coverURL || "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1600&auto=format&fit=crop"}')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute top-4 right-4">
            <Button asChild variant="outline" className="bg-black/40 hover:bg-black/60 border-white/30 text-white backdrop-blur-md rounded-full text-xs">
              <Link href="/profile/edit">
                <Camera className="h-3.5 w-3.5 mr-1.5" /> Change Cover
              </Link>
            </Button>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-5 sm:px-8 pb-6 -mt-14 sm:-mt-16 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            <div className="relative inline-block">
              <img 
                src={user?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"} 
                alt={user?.name || "User"}
                className="h-28 w-28 sm:h-36 sm:w-36 rounded-full object-cover border-4 border-surface shadow-xl bg-surface" 
              />
              <Link 
                href="/profile/edit"
                className="absolute bottom-1 right-1 bg-brand-500 hover:bg-brand-600 text-white p-2 rounded-full shadow-md transition-transform hover:scale-105"
                title="Change Photo"
              >
                <Camera className="h-3.5 w-3.5" />
              </Link>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button asChild className="rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium px-4 text-xs">
                <Link href="/profile/edit"><Edit3 className="h-3.5 w-3.5 mr-1.5" /> Edit Profile Details</Link>
              </Button>
              <Button onClick={logout} variant="outline" className="rounded-xl text-coral-600 hover:bg-coral-50 border-coral-200 text-xs">
                <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign Out
              </Button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary">{user?.name}</h1>
              <Badge className={`border-none rounded-full px-3 py-1 font-bold text-xs ${
                currentRole === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300' :
                currentRole === 'BUSINESS' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300' :
                currentRole === 'SERVICE_PROVIDER' ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300' :
                'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> 
                {currentRole === 'ADMIN' ? 'Platform Super Administrator' :
                 currentRole === 'BUSINESS' ? 'Verified Society Merchant' :
                 currentRole === 'SERVICE_PROVIDER' ? 'Certified Service Professional' :
                 'Verified Society Resident'}
              </Badge>
            </div>
            
            <p className="text-text-secondary mb-4 max-w-3xl text-xs sm:text-sm leading-relaxed">
              {user?.bio}
            </p>
            
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-text-secondary">
              <span className="flex items-center"><Building2 className="h-3.5 w-3.5 mr-1 text-brand-500" /> {user?.society}, {user?.unit}</span>
              <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1 text-emerald-500" /> {user?.city}</span>
              <span className="flex items-center"><Mail className="h-3.5 w-3.5 mr-1 text-blue-500" /> {user?.email}</span>
              <span className="flex items-center"><Phone className="h-3.5 w-3.5 mr-1 text-amber-500" /> {user?.phone}</span>
              <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1 text-purple-500" /> Joined {user?.joinedDate}</span>
            </div>
          </div>
        </div>

        {/* ROLE SPECIFIC KPI STATS BAR */}
        <div className="border-t border-border-hairline bg-surface-subtle/40 px-5 sm:px-8 py-4">
          {currentRole === 'RESIDENT' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-2">
                <span className="block font-black text-xl text-text-primary">{user?.unit?.split(',')[0] || 'Unit 402'}</span>
                <span className="text-[11px] text-text-secondary uppercase font-semibold">Society Flat</span>
              </div>
              <div className="p-2">
                <span className="block font-black text-xl text-emerald-600">PAID</span>
                <span className="text-[11px] text-text-secondary uppercase font-semibold">Oct 2026 Dues</span>
              </div>
              <div className="p-2">
                <span className="block font-black text-xl text-text-primary">2 Active</span>
                <span className="text-[11px] text-text-secondary uppercase font-semibold">Hired Services</span>
              </div>
              <div className="p-2">
                <span className="block font-black text-xl text-brand-600">5 Valid</span>
                <span className="text-[11px] text-text-secondary uppercase font-semibold">Visitor Passes</span>
              </div>
            </div>
          )}

          {currentRole === 'BUSINESS' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-2">
                <span className="block font-black text-xl text-amber-600">4.9 ★</span>
                <span className="text-[11px] text-text-secondary uppercase font-semibold">Store Rating (140)</span>
              </div>
              <div className="p-2">
                <span className="block font-black text-xl text-text-primary">28 Orders</span>
                <span className="text-[11px] text-text-secondary uppercase font-semibold">Today's Delivery</span>
              </div>
              <div className="p-2">
                <span className="block font-black text-xl text-brand-600">15 Mins</span>
                <span className="text-[11px] text-text-secondary uppercase font-semibold">Avg Doorstep Speed</span>
              </div>
              <div className="p-2">
                <span className={`block font-black text-xl ${isStoreOpen ? 'text-emerald-600' : 'text-coral-600'}`}>
                  {isStoreOpen ? 'OPEN NOW' : 'CLOSED'}
                </span>
                <span className="text-[11px] text-text-secondary uppercase font-semibold">Store Status</span>
              </div>
            </div>
          )}

          {currentRole === 'SERVICE_PROVIDER' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-2">
                <span className="block font-black text-xl text-blue-600">4.9 ★</span>
                <span className="text-[11px] text-text-secondary uppercase font-semibold">Client Rating (120)</span>
              </div>
              <div className="p-2">
                <span className="block font-black text-xl text-text-primary">340+</span>
                <span className="text-[11px] text-text-secondary uppercase font-semibold">Society Visits</span>
              </div>
              <div className="p-2">
                <span className="block font-black text-xl text-emerald-600">₹250/hr</span>
                <span className="text-[11px] text-text-secondary uppercase font-semibold">Standard Rate</span>
              </div>
              <div className="p-2">
                <span className={`block font-black text-xl ${isAvailableToday ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {isAvailableToday ? 'AVAILABLE' : 'BUSY'}
                </span>
                <span className="text-[11px] text-text-secondary uppercase font-semibold">Today's Schedule</span>
              </div>
            </div>
          )}

          {currentRole === 'ADMIN' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-2">
                <span className="block font-black text-xl text-purple-600">12</span>
                <span className="text-[11px] text-text-secondary uppercase font-semibold">Managed Societies</span>
              </div>
              <div className="p-2">
                <span className="block font-black text-xl text-text-primary">1,240</span>
                <span className="text-[11px] text-text-secondary uppercase font-semibold">Total Residents</span>
              </div>
              <div className="p-2">
                <span className="block font-black text-xl text-emerald-600">₹48,500</span>
                <span className="text-[11px] text-text-secondary uppercase font-semibold">Dues Collected (96%)</span>
              </div>
              <div className="p-2">
                <span className="block font-black text-xl text-brand-600">CLEAR</span>
                <span className="text-[11px] text-text-secondary uppercase font-semibold">System Audit</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. DEDICATED RESIDENT PROFILE FEATURES                    */}
      {/* ========================================================= */}
      {currentRole === 'RESIDENT' && (
        <div className="space-y-6">
          {/* Resident Navigation Tabs */}
          <div className="flex border-b border-border-hairline gap-2 overflow-x-auto pb-1">
            {[
              { id: 'passes', label: '🎫 Visitor Gate Passes', icon: QrCode },
              { id: 'dues', label: '💳 Maintenance & Bills', icon: CreditCard },
              { id: 'services', label: '🛠️ My Hired Services', icon: Wrench },
              { id: 'complaints', label: '📢 Society Complaints', icon: AlertTriangle },
              { id: 'emergency', label: '🚨 Emergency Info', icon: Phone },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setResidentTab(tab.id as any)}
                className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                  residentTab === tab.id
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-surface hover:bg-surface-subtle text-text-secondary border border-border-hairline'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: Visitor Gate Passes */}
          {residentTab === 'passes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Generate Visitor Pass Form */}
              <div className="bg-surface rounded-2xl border border-border-hairline p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border-hairline">
                  <QrCode className="w-5 h-5 text-brand-600" />
                  <div>
                    <h3 className="font-bold text-sm text-text-primary">Instant Visitor Gate Pass</h3>
                    <p className="text-[11px] text-text-secondary">Generate secure digital entry pass for security gate approval</p>
                  </div>
                </div>

                <form onSubmit={handleGeneratePass} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">Visitor Full Name *</label>
                    <input 
                      required 
                      type="text" 
                      value={visitorName} 
                      onChange={(e) => setVisitorName(e.target.value)} 
                      placeholder="e.g. Ramesh Kulkarni (Delivery / Guest)" 
                      className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-xs text-text-primary outline-none focus:ring-2 focus:ring-brand-500" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Vehicle / Cab No.</label>
                      <input 
                        type="text" 
                        value={visitorVehicle} 
                        onChange={(e) => setVisitorVehicle(e.target.value)} 
                        placeholder="e.g. MH 12 AB 4455" 
                        className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-xs text-text-primary outline-none focus:ring-2 focus:ring-brand-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Visit Purpose</label>
                      <select 
                        value={visitorPurpose} 
                        onChange={(e) => setVisitorPurpose(e.target.value)} 
                        className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-xs text-text-primary outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option>Guest / Family Visit</option>
                        <option>Package Delivery</option>
                        <option>Cab / Uber Pickup</option>
                        <option>Service Technician</option>
                      </select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-sm">
                    Generate Digital Gate Pass
                  </Button>
                </form>
              </div>

              {/* Active / Generated Pass Preview */}
              <div className="bg-surface rounded-2xl border border-border-hairline p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-text-primary flex items-center justify-between pb-2 border-b border-border-hairline">
                  <span>Current Digital Gate Pass</span>
                  <Badge variant="success" className="text-[10px]">Security Verified</Badge>
                </h3>

                <div className="p-4 bg-surface-subtle rounded-2xl border border-dashed border-brand-300 dark:border-brand-800 text-center space-y-3">
                  <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(generatedPass ? generatedPass.id : 'PASS-7721-UNIT402')}`} 
                      alt="Gate Pass QR"
                      className="w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-text-primary">
                      {generatedPass ? generatedPass.name : 'Vikas Jadhav (Family Guest)'}
                    </h4>
                    <p className="text-xs text-text-secondary">
                      Destination: <strong className="text-brand-600">{user?.unit || 'Unit 402, Tower B'}</strong>
                    </p>
                    <p className="text-[11px] text-text-tertiary mt-1">
                      Pass ID: {generatedPass ? generatedPass.id : 'PASS-7721'} • Valid for 24 Hours
                    </p>
                  </div>

                  <div className="flex gap-2 justify-center pt-1">
                    <Button 
                      onClick={() => toast.success('Gate Pass copied to clipboard & ready to share on WhatsApp!')} 
                      variant="outline" 
                      className="text-xs py-1.5 px-3 rounded-xl"
                    >
                      Share via WhatsApp
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-canvas rounded-xl border border-border-hairline text-xs flex justify-between items-center">
                  <span className="text-text-secondary">Allotted Parking Bay:</span>
                  <span className="font-bold text-text-primary">Slot #B-42 (Basement 1)</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Maintenance Dues & Bills */}
          {residentTab === 'dues' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-border-hairline">
                <div>
                  <h3 className="font-bold text-base text-text-primary">Society Maintenance Dues & Digital Receipts</h3>
                  <p className="text-xs text-text-secondary">Track payments, download GST invoices, and verify society accounts</p>
                </div>
                <Button 
                  onClick={() => toast.success('Official payment receipt downloaded (PDF)!')} 
                  variant="outline" 
                  className="text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Receipt (PDF)</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Status</span>
                  <p className="text-2xl font-black text-emerald-600 mt-1">PAID IN FULL</p>
                  <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 mt-1">Paid on Oct 02, 2026 via UPI</p>
                </div>
                <div className="p-4 bg-surface-subtle border border-border-hairline rounded-2xl">
                  <span className="text-xs font-semibold text-text-secondary">Total Amount</span>
                  <p className="text-2xl font-black text-text-primary mt-1">₹4,500.00</p>
                  <p className="text-[11px] text-text-tertiary mt-1">Transaction Ref: TXN_99214481</p>
                </div>
                <div className="p-4 bg-surface-subtle border border-border-hairline rounded-2xl">
                  <span className="text-xs font-semibold text-text-secondary">Next Due Date</span>
                  <p className="text-2xl font-black text-text-primary mt-1">05 Nov 2026</p>
                  <p className="text-[11px] text-text-tertiary mt-1">Auto-reminder enabled</p>
                </div>
              </div>

              {/* Dues Breakdown */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-text-secondary uppercase">Fee Breakdown for {user?.unit || 'Unit 402'}</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2.5 bg-canvas rounded-xl border border-border-hairline">
                    <span className="text-text-secondary">Monthly Common Society Maintenance</span>
                    <span className="font-bold text-text-primary">₹3,000.00</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-canvas rounded-xl border border-border-hairline">
                    <span className="text-text-secondary">Sinking & Capital Reserve Fund</span>
                    <span className="font-bold text-text-primary">₹800.00</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-canvas rounded-xl border border-border-hairline">
                    <span className="text-text-secondary">Water Consumption & Sewage Treatment (STP)</span>
                    <span className="font-bold text-text-primary">₹700.00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: My Hired Services */}
          {residentTab === 'services' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border-hairline">
                <div>
                  <h3 className="font-bold text-base text-text-primary">My Hired Services & Home Technicians</h3>
                  <p className="text-xs text-text-secondary">Work requests and technicians arriving at your society flat</p>
                </div>
                <Button asChild className="text-xs bg-brand-500 hover:bg-brand-600 text-white rounded-xl">
                  <Link href="/services"><Plus className="w-3.5 h-3.5 mr-1" /> Hire Service Pro</Link>
                </Button>
              </div>

              <div className="space-y-3">
                {workOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="p-4 bg-canvas rounded-2xl border border-border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-text-primary">{order.providerName}</h4>
                        <span className="px-2 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-bold rounded">
                          {order.providerCategory || 'Home Services'}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                          {order.status || 'CONFIRMED'}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">
                        Task: <strong>{order.serviceRequired}</strong>
                      </p>
                      <p className="text-[11px] text-text-tertiary mt-0.5">
                        Scheduled: 📅 {order.date} at {order.time} • Rate: {order.rate}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Hi ${order.providerName}, reaching out regarding my booking for ${order.serviceRequired} at ${user?.unit}.`)}`, '_blank')} 
                        variant="outline" 
                        className="text-xs py-1.5 px-3 rounded-xl"
                      >
                        WhatsApp
                      </Button>
                      <Button 
                        onClick={() => toast.success(`Calling ${order.providerName}...`)} 
                        className="text-xs py-1.5 px-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl"
                      >
                        Call Pro
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Complaints */}
          {residentTab === 'complaints' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border-hairline">
                <div>
                  <h3 className="font-bold text-base text-text-primary">Logged Society Complaints & Tickets</h3>
                  <p className="text-xs text-text-secondary">Official facility maintenance tickets for your apartment</p>
                </div>
                <Button 
                  onClick={() => toast.success('Ticket form opened! Society manager notified.', { icon: '🎫' })}
                  className="text-xs bg-brand-500 hover:bg-brand-600 text-white rounded-xl"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Log New Issue
                </Button>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'TKT-104', title: 'Elevator B display flicker and door sensor delay', status: 'RESOLVED', date: 'Oct 10, 2026', resolved: 'Technician replaced door optic sensor' },
                  { id: 'TKT-112', title: 'Clubhouse gym treadmill belt loose', status: 'IN PROGRESS', date: 'Oct 14, 2026', resolved: 'Assigned to Fitness Gear Services' },
                ].map((ticket) => (
                  <div key={ticket.id} className="p-4 bg-canvas rounded-2xl border border-border-hairline space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-brand-600">{ticket.id}</span>
                        <h4 className="font-bold text-xs sm:text-sm text-text-primary">{ticket.title}</h4>
                      </div>
                      <Badge variant={ticket.status === 'RESOLVED' ? 'success' : 'warning'} className="text-[10px]">
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-text-secondary">
                      Logged on: {ticket.date} • Resolution Note: <span className="font-medium text-text-primary">{ticket.resolved}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Emergency Contacts */}
          {residentTab === 'emergency' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-text-primary pb-2 border-b border-border-hairline">
                Society Emergency Contacts & Quick Dial
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-coral-50 dark:bg-coral-950/20 rounded-2xl border border-coral-200 dark:border-coral-800">
                  <span className="text-[10px] font-bold text-coral-600 uppercase">24/7 Security Gate</span>
                  <p className="text-base font-bold text-text-primary mt-1">Gate 1 Security Main Intercom</p>
                  <p className="text-coral-700 dark:text-coral-300 font-semibold mt-1">Intercom: Ext 101 / +91 98220 00101</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">Facility Manager</span>
                  <p className="text-base font-bold text-text-primary mt-1">Ajeenkya Estate Desk</p>
                  <p className="text-blue-700 dark:text-blue-300 font-semibold mt-1">+91 98220 00102 (Mon-Sun)</p>
                </div>
                <div className="p-4 bg-canvas rounded-2xl border border-border-hairline">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase">Personal Emergency Contact</span>
                  <p className="text-base font-bold text-text-primary mt-1">{user?.emergencyContact || 'Family Member'}</p>
                  <p className="text-text-secondary font-semibold mt-1">{user?.emergencyPhone || '+91 98765 00000'}</p>
                </div>
                <div className="p-4 bg-canvas rounded-2xl border border-border-hairline">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase">Nearest Hospital / Ambulance</span>
                  <p className="text-base font-bold text-text-primary mt-1">Columbia Asia & DHH Care</p>
                  <p className="text-brand-600 font-semibold mt-1">Emergency Dial: 108 / 020 6165 5555</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. DEDICATED BUSINESS OWNER PROFILE FEATURES              */}
      {/* ========================================================= */}
      {currentRole === 'BUSINESS' && (
        <div className="space-y-6">
          {/* Business Navigation Tabs */}
          <div className="flex border-b border-border-hairline gap-2 overflow-x-auto pb-1">
            {[
              { id: 'store', label: '🏪 Storefront & Daily Offers', icon: Store },
              { id: 'orders', label: '📦 Society Doorstep Orders', icon: FileText },
              { id: 'reviews', label: '⭐ Resident Reviews', icon: Star },
              { id: 'contact', label: '📞 Hours & WhatsApp Ordering', icon: Phone },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setBusinessTab(tab.id as any)}
                className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                  businessTab === tab.id
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-surface hover:bg-surface-subtle text-text-secondary border border-border-hairline'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: Storefront & Daily Offers */}
          {businessTab === 'store' && (
            <div className="space-y-6">
              {/* Status Banner */}
              <div className="p-4 bg-surface rounded-2xl border border-border-hairline shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full ${isStoreOpen ? 'bg-emerald-500 animate-pulse' : 'bg-coral-500'}`} />
                  <div>
                    <h3 className="font-bold text-sm text-text-primary">
                      Store Status: {isStoreOpen ? 'Accepting Society Orders (Open)' : 'Temporarily Closed'}
                    </h3>
                    <p className="text-xs text-text-secondary">Residents can view your items and order for 15-minute doorstep delivery</p>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    setIsStoreOpen(!isStoreOpen);
                    toast.success(isStoreOpen ? 'Store closed for new orders' : 'Store is now OPEN live on NearNest!');
                  }}
                  variant={isStoreOpen ? 'outline' : 'default'}
                  className="text-xs rounded-xl"
                >
                  {isStoreOpen ? 'Pause Orders' : 'Open Store Now'}
                </Button>
              </div>

              {/* Add New Promotional Deal */}
              <div className="bg-surface rounded-2xl border border-border-hairline p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border-hairline">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <div>
                    <h3 className="font-bold text-sm text-text-primary">Publish Special Deal for Society Residents</h3>
                    <p className="text-[11px] text-text-secondary">Appears directly on the Society Community Feed & Business Showcase</p>
                  </div>
                </div>

                <form onSubmit={handleAddDeal} className="flex flex-col sm:flex-row gap-3">
                  <input 
                    required 
                    type="text" 
                    value={dealTitle}
                    onChange={(e) => setDealTitle(e.target.value)}
                    placeholder="e.g. Fresh Organic Strawberries arrived @ ₹60/box" 
                    className="flex-1 p-2.5 bg-canvas border border-border-hairline rounded-xl text-xs text-text-primary outline-none focus:ring-2 focus:ring-amber-500" 
                  />
                  <select 
                    value={dealDiscount}
                    onChange={(e) => setDealDiscount(e.target.value)}
                    className="p-2.5 bg-canvas border border-border-hairline rounded-xl text-xs text-text-primary outline-none"
                  >
                    <option>10% OFF</option>
                    <option>20% OFF</option>
                    <option>BUY 1 GET 1</option>
                    <option>SPECIAL PRICE</option>
                  </select>
                  <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold px-4">
                    Publish Deal
                  </Button>
                </form>

                {/* Active Deals List */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-text-secondary uppercase">Active Society Promotions</span>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {deals.map((deal) => (
                      <div key={deal.id} className="p-3.5 bg-canvas rounded-xl border border-amber-200 dark:border-amber-900/40 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-text-primary">{deal.title}</p>
                          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5">{deal.discount} • Code: {deal.code}</p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800 text-[10px]">{deal.expiry}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Society Doorstep Orders */}
          {businessTab === 'orders' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border-hairline">
                <div>
                  <h3 className="font-bold text-base text-text-primary">Live Society Grocery & Essentials Orders</h3>
                  <p className="text-xs text-text-secondary">Doorstep delivery queue for Ajeenkya Residency towers</p>
                </div>
                <Badge variant="success" className="text-xs">3 Deliveries Active</Badge>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'ORD-882', flat: 'Flat 304, Tower C', items: '2L Cow Milk, Brown Bread, 1 Dozen Organic Eggs', amount: '₹280', time: '5 mins ago', status: 'OUT FOR DELIVERY' },
                  { id: 'ORD-881', flat: 'Flat 501, Tower A', items: 'Weekly Fresh Organic Veggie Basket (5kg)', amount: '₹420', time: '22 mins ago', status: 'DELIVERED' },
                  { id: 'ORD-880', flat: 'Flat 102, Tower B', items: 'Cold Pressed Sunflower Oil (1L), Poha, Desi Jaggery', amount: '₹680', time: '1 hr ago', status: 'DELIVERED' },
                ].map((order) => (
                  <div key={order.id} className="p-4 bg-canvas rounded-2xl border border-border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-amber-600">{order.id}</span>
                        <span className="font-bold text-text-primary">{order.flat}</span>
                        <Badge variant={order.status === 'DELIVERED' ? 'secondary' : 'success'} className="text-[10px]">
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-text-secondary mt-1">{order.items}</p>
                      <p className="text-text-tertiary text-[11px] mt-0.5">{order.time} • Total: <strong className="text-text-primary">{order.amount}</strong></p>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => toast.success(`Order marked delivered!`)}
                        variant="outline" 
                        className="text-xs py-1.5 px-3 rounded-xl"
                      >
                        Update Status
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {businessTab === 'reviews' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-text-primary pb-2 border-b border-border-hairline">
                Verified Resident Reviews (4.9 ★ Average)
              </h3>
              <div className="space-y-3 text-xs">
                {[
                  { name: 'Aarav Patel (Tower B)', rating: '5.0 ★', comment: 'Always fresh organic vegetables and delivered in less than 15 minutes to my flat door!' },
                  { name: 'Meera Joshi (Tower A)', rating: '5.0 ★', comment: 'The dairy items and cold pressed oils are unmatched in quality. Highly recommended for society members.' },
                ].map((rev, i) => (
                  <div key={i} className="p-4 bg-canvas rounded-2xl border border-border-hairline space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-text-primary">{rev.name}</span>
                      <span className="text-amber-500 font-bold">{rev.rating}</span>
                    </div>
                    <p className="text-text-secondary leading-relaxed">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Contact & Hours */}
          {businessTab === 'contact' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-text-primary pb-2 border-b border-border-hairline">
                Storefront Hours & Direct Resident Ordering
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-canvas rounded-2xl border border-border-hairline">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase">Operating Schedule</span>
                  <p className="font-bold text-sm text-text-primary mt-1">7:00 AM – 10:00 PM (Daily)</p>
                  <p className="text-emerald-600 font-semibold mt-1">Doorstep Society Delivery Available All Day</p>
                </div>
                <div className="p-4 bg-canvas rounded-2xl border border-border-hairline">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase">Direct WhatsApp Ordering</span>
                  <p className="font-bold text-sm text-text-primary mt-1">+91 91234 56789</p>
                  <Button 
                    onClick={() => window.open(`https://wa.me/919123456789?text=${encodeURIComponent('Hi Green Mart, I would like to place a society grocery order for delivery.')}`, '_blank')}
                    className="mt-2 text-xs py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                  >
                    Test WhatsApp Customer Link
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. DEDICATED SERVICE PRO PROFILE FEATURES                 */}
      {/* ========================================================= */}
      {currentRole === 'SERVICE_PROVIDER' && (
        <div className="space-y-6">
          {/* Service Pro Navigation Tabs */}
          <div className="flex border-b border-border-hairline gap-2 overflow-x-auto pb-1">
            {[
              { id: 'workorders', label: '📋 Incoming Work Orders', icon: FileText },
              { id: 'rates', label: '💼 Rate Card & Specialities', icon: CreditCard },
              { id: 'skills', label: '🛠️ License & Tools', icon: Wrench },
              { id: 'reviews', label: '⭐ Client Testimonials', icon: Star },
              { id: 'email', label: '📧 Gmail Dispatch Hub', icon: Mail },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setServiceTab(tab.id as any)}
                className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                  serviceTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-surface hover:bg-surface-subtle text-text-secondary border border-border-hairline'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: Incoming Society Work Orders */}
          {serviceTab === 'workorders' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-border-hairline">
                <div>
                  <h3 className="font-bold text-base text-text-primary">Incoming Society Work Orders & Bookings</h3>
                  <p className="text-xs text-text-secondary">Society members who clicked "Send Hire Request" to hire your services</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary">Schedule Status:</span>
                  <Button 
                    onClick={() => {
                      setIsAvailableToday(!isAvailableToday);
                      toast.success(isAvailableToday ? 'Marked status as BUSY' : 'Marked status as AVAILABLE TODAY!');
                    }}
                    variant={isAvailableToday ? 'outline' : 'default'}
                    className="text-xs rounded-xl"
                  >
                    {isAvailableToday ? '🟢 Available Today' : '🔴 Currently Busy'}
                  </Button>
                </div>
              </div>

              {loadingOrders && (
                <div className="py-8 text-center text-xs text-text-secondary">Loading work orders...</div>
              )}

              <div className="space-y-3">
                {workOrders.map((order) => (
                  <div key={order.id} className="p-4 bg-canvas rounded-2xl border border-border-hairline space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-hairline text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600 text-sm">📍 {order.unitAddress}</span>
                        <Badge variant="success" className="text-[10px]">
                          {order.status || 'CONFIRMED'}
                        </Badge>
                      </div>
                      <span className="font-bold text-text-primary">
                        📅 {order.date} at {order.time}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-text-tertiary block font-semibold text-[10px]">WORK REQUIRED:</span>
                        <p className="font-semibold text-text-primary mt-0.5">{order.serviceRequired}</p>
                        <p className="text-text-secondary text-[11px] mt-1">Rate: <strong className="text-brand-600">{order.rate || '₹250/hr'}</strong></p>
                      </div>

                      <div>
                        <span className="text-text-tertiary block font-semibold text-[10px]">SOCIETY MEMBER:</span>
                        <p className="font-semibold text-text-primary mt-0.5">{order.residentName}</p>
                        <p className="text-text-secondary text-[11px] mt-1">Contact Phone: <strong>{order.residentPhone}</strong></p>
                      </div>
                    </div>

                    {/* Action buttons on order */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border-hairline text-xs">
                      <Button 
                        onClick={() => toast.success(`Calling resident ${order.residentName} at ${order.residentPhone}...`)}
                        className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Resident
                      </Button>
                      <Button 
                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Hi ${order.residentName}, I am Rajesh (Service Provider). Confirming my arrival at ${order.unitAddress} for your requested service: ${order.serviceRequired}.`)}`, '_blank')}
                        variant="outline"
                        className="py-1.5 px-3 rounded-xl text-xs flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Arrival Time
                      </Button>
                      <Button 
                        onClick={() => toast.success('Work order marked completed and archived!')}
                        variant="outline"
                        className="py-1.5 px-3 rounded-xl text-xs text-emerald-600 border-emerald-300"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Done
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Rate Card */}
          {serviceTab === 'rates' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-text-primary pb-2 border-b border-border-hairline">
                Standard Rate Card & Pricing
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                {[
                  { service: 'General Electrical Inspection & Troubleshooting', price: '₹250 / visit' },
                  { service: 'MCB & Main Distribution Box Upgrade', price: '₹499' },
                  { service: 'Inverter & Battery Wiring Setup', price: '₹750' },
                  { service: 'Emergency Night Callout (After 9 PM)', price: '₹500' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-canvas rounded-xl border border-border-hairline flex justify-between items-center">
                    <span className="font-medium text-text-primary">{item.service}</span>
                    <span className="font-bold text-blue-600">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Skills & License */}
          {serviceTab === 'skills' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-text-primary pb-2 border-b border-border-hairline">
                Certifications, Government License & Tools
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-canvas rounded-2xl border border-border-hairline space-y-1">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase">Contractor License</span>
                  <p className="font-bold text-sm text-text-primary">Govt. Electrical License: MH-ELEC-44910</p>
                  <p className="text-emerald-600 font-semibold">Verified by Society Administration</p>
                </div>
                <div className="p-4 bg-canvas rounded-2xl border border-border-hairline space-y-1">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase">Tools Carried for Society Clearance</span>
                  <p className="font-medium text-text-primary">Insulation Megger, Digital Multimeter, Cordless Impact Drill, Wire Puller</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {serviceTab === 'reviews' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-text-primary pb-2 border-b border-border-hairline">
                Resident Reviews & Satisfaction (4.9 ★)
              </h3>
              <div className="space-y-3 text-xs">
                {[
                  { name: 'Sunita Rao (Tower A)', rating: '5.0 ★', text: 'Fixed our tripping kitchen MCB within 20 minutes on Sunday morning. Polite and wore shoe covers.' },
                  { name: 'Vikram Seth (Tower B)', rating: '5.0 ★', text: 'Carried official ID at the gate, accurate quote and clean work. Highly recommended.' },
                ].map((r, i) => (
                  <div key={i} className="p-4 bg-canvas rounded-2xl border border-border-hairline space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-text-primary">{r.name}</span>
                      <span className="text-amber-500 font-bold">{r.rating}</span>
                    </div>
                    <p className="text-text-secondary leading-relaxed">"{r.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Gmail Dispatch Settings */}
          {serviceTab === 'email' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-text-primary pb-2 border-b border-border-hairline flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Configured Gmail for Work Order Dispatch</span>
              </h3>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-800 text-xs space-y-2">
                <p className="text-text-primary">
                  All society member hire requests will be dispatched to your registered address:
                </p>
                <div className="p-3 bg-surface rounded-xl border border-blue-300 font-bold text-blue-700 dark:text-blue-300 text-sm">
                  {user?.email || 'rajesh.kumar.electrician@gmail.com'}
                </div>
                <p className="text-[11px] text-text-secondary">
                  Emails contain full resident address, scheduled date/time, and work descriptions so you can prepare the right tools before arriving.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. DEDICATED SUPER ADMIN PROFILE FEATURES                 */}
      {/* ========================================================= */}
      {currentRole === 'ADMIN' && (
        <div className="space-y-6">
          {/* Admin Navigation Tabs */}
          <div className="flex border-b border-border-hairline gap-2 overflow-x-auto pb-1">
            {[
              { id: 'governance', label: '🛡️ Master Governance Controls', icon: ShieldCheck },
              { id: 'broadcast', label: '📢 Society Broadcast Console', icon: Send },
              { id: 'financials', label: '📊 Financial ERP Summary', icon: CreditCard },
              { id: 'system', label: '🔒 System Architecture & Sync', icon: Wrench },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                  adminTab === tab.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-surface hover:bg-surface-subtle text-text-secondary border border-border-hairline'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: Governance */}
          {adminTab === 'governance' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border-hairline">
                <div>
                  <h3 className="font-bold text-base text-text-primary">Super Administrator Master Controls</h3>
                  <p className="text-xs text-text-secondary">Review verifications, manage society members, and maintain platform stability</p>
                </div>
                <Button asChild className="text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
                  <Link href="/admin">Open Full Admin Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
                </Button>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-canvas rounded-2xl border border-border-hairline space-y-2">
                  <h4 className="font-bold text-text-primary">Verification Approvals</h4>
                  <p className="text-text-secondary">Review friend registrations, commercial shops, and service pros</p>
                  <Button asChild variant="outline" className="w-full text-xs py-1.5 rounded-xl">
                    <Link href="/admin">Review Queue</Link>
                  </Button>
                </div>
                <div className="p-4 bg-canvas rounded-2xl border border-border-hairline space-y-2">
                  <h4 className="font-bold text-text-primary">Service Work Orders</h4>
                  <p className="text-text-secondary">Audit all society bookings dispatched to providers</p>
                  <Button asChild variant="outline" className="w-full text-xs py-1.5 rounded-xl">
                    <Link href="/admin">View Bookings</Link>
                  </Button>
                </div>
                <div className="p-4 bg-canvas rounded-2xl border border-border-hairline space-y-2">
                  <h4 className="font-bold text-text-primary">Society Gate ERP</h4>
                  <p className="text-text-secondary">Live visitor check-in logs and gate scanner records</p>
                  <Button asChild variant="outline" className="w-full text-xs py-1.5 rounded-xl">
                    <Link href="/society">Gate Scanner</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Broadcast */}
          {adminTab === 'broadcast' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-text-primary pb-2 border-b border-border-hairline">
                Emergency Society Broadcaster
              </h3>
              <div className="space-y-3 text-xs max-w-xl">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">Target Society Towers</label>
                  <select className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-xs text-text-primary">
                    <option>All Towers (Tower A, B, C & Commercial Complex)</option>
                    <option>Tower A Only</option>
                    <option>Tower B Only</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-text-primary mb-1">Announcement Message</label>
                  <textarea 
                    rows={3} 
                    placeholder="e.g. Municipal water pipeline inspection scheduled for tomorrow 2 PM - 4 PM. Please store adequate water." 
                    className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-xs text-text-primary outline-none"
                  />
                </div>
                <Button 
                  onClick={() => toast.success('Broadcast sent to all 1,240 society members via Push & SMS!', { icon: '📢' })}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs py-2 px-4 font-bold"
                >
                  Send Society Broadcast
                </Button>
              </div>
            </div>
          )}

          {/* Tab 3: Financials */}
          {adminTab === 'financials' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-text-primary pb-2 border-b border-border-hairline">
                Society Financial Health & Sinking Funds
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-canvas rounded-2xl border border-border-hairline space-y-1">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase">Current Month Inflow</span>
                  <p className="text-2xl font-black text-text-primary">₹48,500.00</p>
                  <p className="text-emerald-600 font-semibold">96% of planned revenue collected</p>
                </div>
                <div className="p-4 bg-canvas rounded-2xl border border-border-hairline space-y-1">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase">Capital Reserve / Sinking Fund</span>
                  <p className="text-2xl font-black text-text-primary">₹12,40,000.00</p>
                  <p className="text-purple-600 font-semibold">Held in HDFC Society Escrow Account</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: System Architecture */}
          {adminTab === 'system' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-text-primary pb-2 border-b border-border-hairline">
                System Status & Database Sync
              </h3>
              <div className="p-4 bg-canvas rounded-2xl border border-border-hairline text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Database File:</span>
                  <span className="font-mono text-[11px] text-text-primary">apps/web/src/data/db.json (Active)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">RBAC Clearance:</span>
                  <span className="font-bold text-purple-600">Level 5 (Master Root Access)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Work Order Dispatch Protocol:</span>
                  <span className="font-bold text-emerald-600">Active (Gmail Direct Hook)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
