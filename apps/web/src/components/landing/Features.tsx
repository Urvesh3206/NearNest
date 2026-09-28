"use client";

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { 
  MessageSquare, 
  Store, 
  Calendar, 
  Shield, 
  Building2, 
  Sparkles, 
  Heart, 
  ArrowRight, 
  Star, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  PhoneCall,
  BellRing,
  Send,
  Zap
} from 'lucide-react';
import { Avatar, Badge, Button } from '@/components/ui';

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Interactive states for live previews
  const [feedLiked, setFeedLiked] = useState(false);
  const [feedLikesCount, setFeedLikesCount] = useState(24);
  const [sosActive, setSosActive] = useState(false);

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (feedLiked) {
      setFeedLikesCount((prev) => prev - 1);
      setFeedLiked(false);
    } else {
      setFeedLikesCount((prev) => prev + 1);
      setFeedLiked(true);
    }
  };

  const handleSosClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSosActive(true);
    setTimeout(() => setSosActive(false), 3000);
  };

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" ref={ref}>
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-4 border border-brand-200 dark:border-brand-800">
          <Zap className="w-3.5 h-3.5 text-brand-500" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">
          Everything Your Neighborhood Needs
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          A comprehensive suite of live interactive tools designed to connect neighbors, manage housing societies, support local shops, and ensure resident safety.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Community Feed (Span 2) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="md:col-span-2 bg-surface rounded-3xl border border-border-hairline p-7 sm:p-8 shadow-card hover:shadow-card-hover hover:border-brand-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500/10 text-blue-500">
                <MessageSquare className="w-6 h-6" />
              </div>
              <Link
                href="/feed"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform"
              >
                <span>Launch Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <h3 className="text-xl font-bold text-text-primary mb-2">Community Feed</h3>
            <p className="text-sm text-text-secondary">
              Share real-time announcements, organize neighborhood events, ask local questions, and foster authentic social ties with your residents.
            </p>
          </div>

          {/* Interactive Live Post Preview */}
          <div className="mt-6 bg-canvas/70 rounded-2xl border border-border-hairline p-4 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name="Aarav Sharma" size="sm" className="ring-2 ring-brand-500/20" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-text-primary">Aarav Sharma</span>
                    <Badge variant="success" size="sm" className="text-[10px] py-0 px-1.5">
                      Tower B Resident
                    </Badge>
                  </div>
                  <span className="text-[10px] text-text-tertiary">12 mins ago • Wing 2</span>
                </div>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium">
                Announcement 📢
              </span>
            </div>

            <p className="text-xs text-text-primary leading-relaxed">
              🌿 Community Sunday Plantation Drive is happening this Sunday at 8:30 AM in the Central Garden! Free saplings provided for all society flats.
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-border-hairline/60 text-xs">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-1.5 transition-colors font-medium ${
                    feedLiked ? 'text-rose-500 font-bold' : 'text-text-secondary hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${feedLiked ? 'fill-rose-500 scale-110' : ''} transition-transform`} />
                  <span>{feedLikesCount} Likes</span>
                </button>

                <Link
                  href="/feed"
                  className="flex items-center gap-1.5 text-text-secondary hover:text-brand-600 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>8 Comments</span>
                </Link>
              </div>

              <Link
                href="/feed"
                className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <span>View Discussion</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 2. Local Businesses (Span 1) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="col-span-1 bg-surface rounded-3xl border border-border-hairline p-7 sm:p-8 shadow-card hover:shadow-card-hover hover:border-amber-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-500/10 text-amber-500">
                <Store className="w-6 h-6" />
              </div>
              <Link
                href="/businesses"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <h3 className="text-xl font-bold text-text-primary mb-2">Local Businesses</h3>
            <p className="text-sm text-text-secondary">
              Discover hyper-local shops, grocery stores, bakeries, and cafes right within your housing area.
            </p>
          </div>

          {/* Mini Business Spotlight */}
          <Link
            href="/businesses"
            className="mt-6 block bg-canvas/70 rounded-2xl border border-border-hairline p-3.5 hover:border-amber-500/50 transition-colors group/card"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center font-bold text-amber-700 dark:text-amber-300 text-xs shrink-0">
                🥬 GM
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-text-primary truncate">Green Mart Organic</h4>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                    Open
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-text-secondary mt-0.5">
                  <span className="flex items-center text-amber-500 font-semibold">
                    <Star className="w-3 h-3 fill-amber-500 mr-0.5" /> 4.9
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-text-tertiary">
                    <MapPin className="w-3 h-3" /> 200m away
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* 3. Book Services (Span 1) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="col-span-1 bg-surface rounded-3xl border border-border-hairline p-7 sm:p-8 shadow-card hover:shadow-card-hover hover:border-purple-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-purple-500/10 text-purple-500">
                <Calendar className="w-6 h-6" />
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform"
              >
                <span>Hire Pros</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <h3 className="text-xl font-bold text-text-primary mb-2">Book Services</h3>
            <p className="text-sm text-text-secondary">
              Hire verified maids, plumbers, electricians, tutors, and mechanics with fixed pricing and instant bookings.
            </p>
          </div>

          {/* Mini Service Provider Preview */}
          <Link
            href="/services"
            className="mt-6 block bg-canvas/70 rounded-2xl border border-border-hairline p-3.5 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar name="Rajesh Kumar" size="sm" />
                <div>
                  <div className="flex items-center gap-1">
                    <h5 className="text-xs font-bold text-text-primary">Rajesh Electrician</h5>
                    <CheckCircle2 className="w-3 h-3 text-brand-500" />
                  </div>
                  <p className="text-[10px] text-text-secondary">ID & Police Verified Pro</p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-lg">
                ₹299
              </span>
            </div>
          </Link>
        </motion.div>

        {/* 4. Safety & Emergency SOS (Span 2) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="md:col-span-2 bg-surface rounded-3xl border border-border-hairline p-7 sm:p-8 shadow-card hover:shadow-card-hover hover:border-red-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-500/10 text-red-500">
                <Shield className="w-6 h-6" />
              </div>
              <Link
                href="/emergency"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform"
              >
                <span>Emergency Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <h3 className="text-xl font-bold text-text-primary mb-2">Safety & Emergency</h3>
            <p className="text-sm text-text-secondary">
              One-touch SOS broadcasting, instant security guard calling, live GPS coordinates sharing, and Women Safety alert sirens.
            </p>
          </div>

          {/* Interactive Live SOS Bar */}
          <div className="mt-6 bg-red-500/5 dark:bg-red-950/20 rounded-2xl border border-red-500/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="relative">
                <Shield className="w-7 h-7" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
              </div>
              <div>
                <span className="font-bold text-sm block">Society Watch Active & Online</span>
                <span className="text-[11px] text-text-secondary">Connected to Main Gate Guard & Police (112)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {sosActive ? (
                <div className="px-5 py-2 bg-red-600 text-white rounded-xl text-xs font-bold animate-pulse flex items-center gap-2">
                  <BellRing className="w-4 h-4" />
                  <span>SOS Alert Broadcasted!</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSosClick}
                  className="w-full sm:w-auto px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold shadow-md shadow-red-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Simulate SOS Ping</span>
                </button>
              )}

              <Link
                href="/emergency"
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-canvas border border-border-hairline text-text-primary hover:bg-surface-subtle"
              >
                Open SOS
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 5. Society Management (Span 1) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="col-span-1 bg-surface rounded-3xl border border-border-hairline p-7 sm:p-8 shadow-card hover:shadow-card-hover hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-500/10 text-indigo-500">
                <Building2 className="w-6 h-6" />
              </div>
              <Link
                href="/society"
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <h3 className="text-xl font-bold text-text-primary mb-2">Society Management</h3>
            <p className="text-sm text-text-secondary">
              Digital maintenance bill payments, visitor gate passes with QR, amenities booking, and complaint tickets.
            </p>
          </div>

          {/* Mini Society Status Pill */}
          <Link
            href="/society"
            className="mt-6 block bg-canvas/70 rounded-2xl border border-border-hairline p-3.5 hover:border-indigo-500/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-text-primary">Maintenance Dues</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                All Cleared ✓
              </span>
            </div>
            <p className="text-[11px] text-text-secondary mt-1">
              Next bill generated on 1st of upcoming month
            </p>
          </Link>
        </motion.div>

        {/* 6. AI Assistant (Span 1) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.36 }}
          className="col-span-1 bg-surface rounded-3xl border border-border-hairline p-7 sm:p-8 shadow-card hover:shadow-card-hover hover:border-brand-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-brand-500/10 text-brand-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <Link
                href="/ai-assistant"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform"
              >
                <span>Ask AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <h3 className="text-xl font-bold text-text-primary mb-2">AI Concierge</h3>
            <p className="text-sm text-text-secondary">
              Smart AI neighborhood assistant for discovering services, analyzing society bylaws, and finding answers 24/7.
            </p>
          </div>

          {/* Mini AI Prompt preview */}
          <Link
            href="/ai-assistant"
            className="mt-6 block bg-canvas/70 rounded-2xl border border-border-hairline p-3.5 hover:border-brand-500/50 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
              <Sparkles className="w-3.5 h-3.5 text-brand-500 shrink-0" />
              <span className="truncate italic">"Find top-rated plumbers nearby..."</span>
            </div>
            <div className="mt-2 text-[11px] text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1">
              <span>Try NearNest AI Assistant</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
