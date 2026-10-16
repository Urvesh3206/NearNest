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
  DollarSign,
  ShieldCheck,
  Zap,
  Check,
  X,
  Radio,
  User,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { RbacProfileSwitcher } from '@/components/auth/RbacProfileSwitcher';
import { useAuth } from '@/providers/AuthProvider';
import { useSocket } from '@/providers/SocketProvider';
import toast from 'react-hot-toast';
import { 
  getStoredBookings, 
  updateBookingStatusAction, 
  BookingStatus, 
  ServiceBookingRecord 
} from '@/actions/bookingActions';

export default function ServiceDashboardPage() {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [isAvailable, setIsAvailable] = useState(true);
  const [bookings, setBookings] = useState<ServiceBookingRecord[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'COMPLETED'>('ALL');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Play two-tone doorbell chime when a new booking arrives
  const playOrderNotificationSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Tone 1: High chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(784, now); // G5
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Tone 2: Ring chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1046.5, now + 0.15); // C6
      gain2.gain.setValueAtTime(0.25, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.7);
    } catch (e) {}

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch (e) {}
    }
  };

  // 1. Live Data Loading & Auto-Sync Polling (across cloud & local devices)
  useEffect(() => {
    let isMounted = true;
    let initialLoaded = false;

    async function syncBookings(isInitial = false) {
      try {
        const stored = getStoredBookings();
        if (isInitial) {
          setBookings(stored);
        }

        const res = await fetch('/api/bookings');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.bookings)) {
            setBookings((prev) => {
              // Check if any new pending booking has arrived
              const prevIds = new Set(prev.map((b) => b.id));
              const newlyArrived = json.bookings.filter(
                (b: ServiceBookingRecord) => !prevIds.has(b.id) && b.status === 'PENDING'
              );

              if (!isInitial && newlyArrived.length > 0) {
                const firstNew = newlyArrived[0];
                playOrderNotificationSound();
                toast.success(
                  `🔔 New Order Received from ${firstNew.residentName || 'Resident'}!`,
                  {
                    icon: '⚡',
                    duration: 7000,
                  }
                );
              }

              // Merge
              const combinedMap = new Map<string, ServiceBookingRecord>();
              json.bookings.forEach((b: ServiceBookingRecord) => combinedMap.set(b.id, b));
              stored.forEach((b) => combinedMap.set(b.id, b));
              prev.forEach((b) => combinedMap.set(b.id, b));
              return Array.from(combinedMap.values()).sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
            });
          }
        }
      } catch (err) {
        console.warn('Booking sync notice:', err);
      } finally {
        if (isInitial && isMounted) {
          setLoading(false);
          initialLoaded = true;
        }
      }
    }

    // Initial fetch
    syncBookings(true);

    // Continuous cloud polling every 3.5s for instant multi-device order dispatch
    const interval = setInterval(() => {
      syncBookings(false);
    }, 3500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // 2. Real-Time Socket.io Listener for new-booking-request & status updates
  useEffect(() => {
    // A) Socket.io client listener
    if (socket) {
      const handleNewBooking = (payload: any) => {
        const booking: ServiceBookingRecord = payload.bookingDetails || payload;
        if (!booking || !booking.id) return;

        setBookings((prev) => {
          if (prev.some((b) => b.id === booking.id)) return prev;
          return [booking, ...prev];
        });

        toast.success(`New request from ${booking.residentName || 'Resident'}!`, {
          icon: '⚡',
          duration: 5000,
        });
      };

      const handleStatusUpdate = (payload: any) => {
        const { bookingId, status } = payload;
        if (!bookingId || !status) return;

        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: status as BookingStatus } : b))
        );
      };

      socket.on('new-booking-request', handleNewBooking);
      socket.on('booking-status-updated', handleStatusUpdate);

      return () => {
        socket.off('new-booking-request', handleNewBooking);
        socket.off('booking-status-updated', handleStatusUpdate);
      };
    }
  }, [socket]);

  // B) Cross-window custom events listener for local instant sync
  useEffect(() => {
    const handleLocalNewBooking = (e: any) => {
      const booking = e.detail?.booking;
      if (booking && booking.id) {
        setBookings((prev) => {
          if (prev.some((b) => b.id === booking.id)) return prev;
          return [booking, ...prev];
        });
      }
    };

    const handleLocalStatusUpdate = (e: any) => {
      const { bookingId, status } = e.detail || {};
      if (bookingId && status) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
        );
      }
    };

    window.addEventListener('nearnest:new-booking-request', handleLocalNewBooking);
    window.addEventListener('nearnest:booking-status-updated', handleLocalStatusUpdate);

    return () => {
      window.removeEventListener('nearnest:new-booking-request', handleLocalNewBooking);
      window.removeEventListener('nearnest:booking-status-updated', handleLocalStatusUpdate);
    };
  }, []);

  // 3. Status Update Server Action Handlers
  const handleUpdateStatus = async (bookingId: string, newStatus: BookingStatus) => {
    setUpdatingId(bookingId);
    try {
      const result = await updateBookingStatusAction(bookingId, newStatus);
      if (result.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );

        if (newStatus === 'ACCEPTED') {
          toast.success('Request accepted! Resident notified.', { icon: '✅' });
        } else if (newStatus === 'DECLINED') {
          toast('Request declined.', { icon: '🚫' });
        } else if (newStatus === 'COMPLETED') {
          toast.success('Work marked as completed!', { icon: '🎉' });
        }
      } else {
        toast.error(result.message || 'Failed to update request status.');
      }
    } catch (err: any) {
      toast.error('Could not update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'ALL') return true;
    return b.status === filter;
  });

  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;
  const latestPendingOrder = bookings.find((b) => b.status === 'PENDING');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Interactive RBAC Switcher Banner */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary">
            Role Profile Switcher
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                isConnected
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
              }`}
            >
              <Radio className={`w-3 h-3 ${isConnected ? 'animate-pulse text-emerald-500' : 'text-amber-500'}`} />
              <span>{isConnected ? 'Socket.io Live' : 'Connecting Socket...'}</span>
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              🔧 Service Provider Dashboard
            </span>
          </div>
        </div>
        <RbacProfileSwitcher />
      </div>

      {/* Service Header */}
      <div className="bg-surface border border-border-hairline rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold">
              Verified Service Provider
            </span>
            <span className="text-xs text-text-tertiary">Lic: MH-ELEC-48201</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-2">
            Service Console: {user?.name || 'Rajesh Kumar (Electrician)'}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time technician dashboard: Receive incoming resident booking requests via Socket.io and respond instantly.
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

      {/* Live Order Received Banner */}
      {latestPendingOrder && (
        <div className="bg-gradient-to-r from-emerald-500/15 via-brand-500/10 to-amber-500/15 border-2 border-emerald-500/50 rounded-3xl p-6 shadow-glow-brand flex flex-col md:flex-row items-start md:items-center justify-between gap-5 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Zap className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  ⚡ Order Received!
                </span>
                <span className="text-xs text-text-tertiary">Awaiting your response</span>
              </div>
              <h4 className="text-base font-bold text-text-primary mt-1">
                {latestPendingOrder.residentName} called for {latestPendingOrder.providerCategory || 'Service'}
              </h4>
              <p className="text-xs text-text-secondary mt-0.5">
                Location: <strong>{latestPendingOrder.residentFlat}</strong> • Task: "{latestPendingOrder.taskDescription}"
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => handleUpdateStatus(latestPendingOrder.id, 'ACCEPTED')}
              disabled={updatingId === latestPendingOrder.id}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Accept Order</span>
            </button>
            <a
              href={`tel:${latestPendingOrder.residentPhone?.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-surface hover:bg-surface-subtle text-text-primary border border-border-hairline text-xs font-bold rounded-xl transition-all"
            >
              <Phone className="w-4 h-4 text-brand-600" />
              <span>Call Resident</span>
            </a>
          </div>
        </div>
      )}

      {/* Service KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Requests', val: `${pendingCount} New`, icon: Zap, color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Client Rating', val: '4.9 ★ (142 Reviews)', icon: Star, color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Completed Visits', val: `${bookings.filter(b => b.status === 'COMPLETED').length + 340} Total`, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
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

      {/* Main Content: Incoming Direct Service Bookings & Society Rate Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incoming Service Bookings Feed (Real-Time Socket.io) */}
        <div className="lg:col-span-2 bg-surface border border-border-hairline rounded-3xl p-6 shadow-card space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-hairline gap-3">
            <div>
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span>Incoming ServiceBooking Requests</span>
              </h3>
              <p className="text-xs text-text-tertiary mt-0.5">
                Live requests submitted by residents via the in-app booking modal.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-surface-subtle p-1 rounded-xl border border-border-hairline text-xs font-semibold">
              {(['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filter === tab
                      ? 'bg-surface text-brand-600 shadow-sm'
                      : 'text-text-tertiary hover:text-text-primary'
                  }`}
                >
                  {tab === 'PENDING' && pendingCount > 0 ? `Pending (${pendingCount})` : tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-text-tertiary">
              Loading incoming requests...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-12 text-center bg-surface-subtle rounded-2xl border border-dashed border-border-hairline p-6">
              <AlertCircle className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
              <h4 className="text-sm font-bold text-text-primary">No requests found</h4>
              <p className="text-xs text-text-tertiary mt-1">
                {filter === 'ALL'
                  ? 'No incoming service requests yet. When a resident hires you, their request appears here in real-time!'
                  : `No requests with status: ${filter}`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => {
                const isPending = b.status === 'PENDING';
                const isAccepted = b.status === 'ACCEPTED';
                const isDeclined = b.status === 'DECLINED';
                const isCompleted = b.status === 'COMPLETED';

                return (
                  <div
                    key={b.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isPending
                        ? 'bg-amber-50/30 dark:bg-amber-950/10 border-amber-300 dark:border-amber-800/50 shadow-sm'
                        : isAccepted
                        ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-300 dark:border-emerald-800/40'
                        : isDeclined
                        ? 'bg-surface-subtle border-border-hairline opacity-75'
                        : 'bg-surface-subtle border-border-hairline'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: Resident Info & Task Description */}
                      <div className="space-y-2.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-text-primary flex items-center gap-1.5">
                            <User className="w-4 h-4 text-brand-600" />
                            {b.residentName}
                          </span>

                          <span className="text-xs text-text-tertiary font-mono">•</span>

                          <span className="text-xs text-text-secondary flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                            {b.residentFlat}
                          </span>

                          {/* Status Badge */}
                          <span
                            className={`ml-auto text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isPending
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                : isAccepted
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : isDeclined
                                ? 'bg-coral-500/15 text-coral-600 dark:text-coral-400 border border-coral-500/30'
                                : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>

                        {/* Task Description (Prominent Section) */}
                        <div className="p-3 rounded-xl bg-surface border border-border-hairline">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary block mb-1">
                            Task Description
                          </span>
                          <p className="text-xs sm:text-sm text-text-primary font-medium leading-relaxed">
                            "{b.taskDescription}"
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-[11px] text-text-tertiary">
                          <span>
                            Received: {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                          {b.residentPhone && (
                            <span className="font-mono">
                              Phone: {b.residentPhone}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Action Buttons (Accept & Decline) */}
                      <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        {isPending && (
                          <>
                            {/* Accept Button */}
                            <button
                              onClick={() => handleUpdateStatus(b.id, 'ACCEPTED')}
                              disabled={updatingId === b.id}
                              className="w-full sm:w-28 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 shadow-sm transition-all"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept</span>
                            </button>

                            {/* Decline Button */}
                            <button
                              onClick={() => handleUpdateStatus(b.id, 'DECLINED')}
                              disabled={updatingId === b.id}
                              className="w-full sm:w-28 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-coral-600 hover:bg-coral-500/10 border border-coral-200 dark:border-coral-800 disabled:opacity-50 transition-all"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>
                          </>
                        )}

                        {isAccepted && (
                          <div className="flex flex-col gap-2 w-full sm:w-28">
                            <button
                              onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                              disabled={updatingId === b.id}
                              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Done</span>
                            </button>

                            {b.residentPhone && (
                              <a
                                href={`tel:${b.residentPhone}`}
                                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-text-secondary bg-surface border border-border-hairline hover:bg-surface-subtle transition-all"
                              >
                                <Phone className="w-3 h-3 text-emerald-500" />
                                <span>Call</span>
                              </a>
                            )}
                          </div>
                        )}

                        {isDeclined && (
                          <span className="text-xs text-text-tertiary italic">
                            Request Declined
                          </span>
                        )}

                        {isCompleted && (
                          <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rate Card & Society Verification */}
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
