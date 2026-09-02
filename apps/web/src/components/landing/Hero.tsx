"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MapPin, ShieldCheck, Users, Star, ArrowRight, Store, Wrench, Search, Navigation } from 'lucide-react';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const POPULAR_NEIGHBORHOODS = [
  'Greenfield Park',
  'Riverside Heights',
  'Downtown Central',
  'Maplewood West',
  'Sunnyvale'
];

const PREVIEW_DATA = [
  { type: 'business', name: 'The Artisan Bakery', category: 'Bakery', location: 'Greenfield Park', distance: '0.4 km', rating: 4.8, id: '1' },
  { type: 'business', name: 'FitLife Gym & Spa', category: 'Gym', location: 'Riverside Heights', distance: '0.8 km', rating: 4.5, id: '2' },
  { type: 'business', name: 'Dr. Smith Dental Clinic', category: 'Medical', location: 'Downtown Central', distance: '0.6 km', rating: 4.9, id: '3' },
  { type: 'business', name: 'Urban Glow Salon', category: 'Salon', location: 'Maplewood West', distance: '1.1 km', rating: 4.7, id: '4' },
  { type: 'service', name: 'Rajesh Kumar', category: 'Electrician', location: 'Greenfield Park', distance: '0.3 km', rating: 4.9, rate: '₹200/hr', id: '1' },
  { type: 'service', name: 'Sunita Devi', category: 'Maid', location: 'Riverside Heights', distance: '0.5 km', rating: 4.7, rate: '₹3000/mo', id: '2' },
  { type: 'service', name: 'Amit Patel', category: 'Plumber', location: 'Downtown Central', distance: '0.9 km', rating: 4.8, rate: '₹250/hr', id: '3' },
  { type: 'service', name: 'Elena Rostova', category: 'Math & Science Tutor', location: 'Maplewood West', distance: '1.2 km', rating: 5.0, rate: '₹500/hr', id: '4' },
];

export function Hero() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const animationVariants = prefersReducedMotion ? {} : fadeUpVariants;

  const [locationQuery, setLocationQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filteredPreview = PREVIEW_DATA.filter((item) => {
    if (!locationQuery.trim()) return true;
    const q = locationQuery.toLowerCase();
    return (
      item.location.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = locationQuery.trim();
    if (query) {
      router.push(`/businesses?location=${encodeURIComponent(query)}&search=${encodeURIComponent(query)}`);
    } else {
      router.push('/businesses');
    }
  };

  const handleSelectLocation = (loc: string) => {
    setLocationQuery(loc);
    router.push(`/businesses?location=${encodeURIComponent(loc)}`);
  };

  const handleUseCurrentLocation = () => {
    setLocationQuery('Greenfield Park (Current)');
    router.push('/businesses?location=Greenfield+Park');
  };

  return (
    <section className="relative min-h-[90dvh] flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl mx-auto text-center flex flex-col items-center relative z-10"
      >
        <motion.div variants={animationVariants} className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 text-sm font-medium">
            <span>✨</span> Now connecting 10,000+ neighborhoods
          </div>
        </motion.div>

        <motion.h1
          variants={animationVariants}
          className="text-[clamp(2.5rem,6vw+1rem,5rem)] font-extrabold tracking-tight leading-[1.1] mb-6 text-text-primary"
        >
          Your neighborhood, <br className="hidden sm:block" />
          <span className="gradient-text">connected & thriving.</span>
        </motion.h1>

        <motion.p
          variants={animationVariants}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Search any neighborhood or street to instantly discover nearby local businesses, top-rated service providers, and community updates.
        </motion.p>

        {/* Location Search Box & Live Dropdown */}
        <motion.div variants={animationVariants} className="w-full max-w-2xl mx-auto relative mb-6">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full bg-surface p-2 rounded-full shadow-modal border border-border-hairline flex items-center gap-2 transition-all focus-within:border-brand-500 focus-within:shadow-glow-brand"
          >
            <div className="flex-1 flex items-center gap-3 px-4">
              <MapPin className="w-5 h-5 text-brand-500 shrink-0" />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Enter your location, neighborhood, or street..."
                className="w-full bg-transparent border-none outline-none text-text-primary placeholder:text-text-tertiary text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                title="Use Current Location"
                className="text-xs text-brand-600 hover:text-brand-700 bg-brand-50 dark:bg-brand-950/40 px-3 py-1 rounded-full flex items-center gap-1 shrink-0 font-medium transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Current GPS</span>
              </button>
            </div>
            <Button
              type="submit"
              className="bg-brand-500 hover:bg-brand-600 text-white rounded-full px-7 h-12 text-sm sm:text-base font-semibold shadow-sm shrink-0"
            >
              Explore
            </Button>
          </form>

          {/* Live Nearby Search Dropdown */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-3 p-4 bg-surface rounded-2xl shadow-modal border border-border-hairline z-50 text-left"
              >
                <div className="flex items-center justify-between pb-3 border-b border-border-hairline mb-3">
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {locationQuery ? `Nearby Results in "${locationQuery}"` : 'Nearby In Your Area'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsFocused(false)}
                    className="text-xs text-text-tertiary hover:text-text-primary"
                  >
                    Close ✕
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {filteredPreview.length === 0 ? (
                    <div className="p-4 text-center text-sm text-text-secondary">
                      No exact match found. Click <span className="font-semibold text-brand-500">Explore</span> to search all city listings!
                    </div>
                  ) : (
                    filteredPreview.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.type === 'business' ? `/businesses/${item.id}` : `/services`}
                        onClick={() => setIsFocused(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-subtle transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.type === 'business' ? 'bg-orange-500/10 text-orange-600' : 'text-blue-600 bg-blue-500/10'}`}>
                            {item.type === 'business' ? <Store className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-text-primary group-hover:text-brand-500 flex items-center gap-2">
                              {item.name}
                              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-surface-subtle text-text-secondary">
                                {item.category}
                              </span>
                            </div>
                            <div className="text-xs text-text-secondary flex items-center gap-1.5 mt-0.5">
                              <MapPin className="w-3 h-3 text-text-tertiary" />
                              <span>{item.location}</span>
                              <span>•</span>
                              <span className="text-brand-600 font-medium">{item.distance} away</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{item.rating}</span>
                          </div>
                          <span className="text-[11px] text-brand-600 font-medium group-hover:underline">
                            {item.type === 'business' ? 'View Profile →' : 'Book Service →'}
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-border-hairline flex items-center justify-between">
                  <span className="text-xs text-text-tertiary">Found {filteredPreview.length} nearby local listings</span>
                  <button
                    type="button"
                    onClick={() => handleSearchSubmit()}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    View Full Directory <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick Neighborhood Filter Pills */}
        <motion.div variants={animationVariants} className="flex flex-wrap items-center justify-center gap-2 mb-16">
          <span className="text-xs font-medium text-text-tertiary mr-1">Popular Neighborhoods:</span>
          {POPULAR_NEIGHBORHOODS.map((hood) => (
            <button
              key={hood}
              onClick={() => handleSelectLocation(hood)}
              className="text-xs px-3.5 py-1.5 rounded-full bg-surface hover:bg-surface-subtle border border-border-hairline text-text-secondary hover:text-brand-600 hover:border-brand-500/40 transition-all font-medium flex items-center gap-1 shadow-sm"
            >
              <MapPin className="w-3 h-3 text-brand-500" />
              {hood}
            </button>
          ))}
        </motion.div>

        {/* Social Proof Cards */}
        <motion.div
          variants={animationVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto"
        >
          {[
            { icon: ShieldCheck, title: '100% ID Verified Neighbors', desc: 'Real residents & certified pros only', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { icon: Users, title: '50K+ Connected Residents', desc: 'Active community in your local block', color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { icon: Star, title: '4.9★ Local Provider Rating', desc: 'Verified peer ratings & reviews', color: 'text-amber-500', bg: 'bg-amber-500/10' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.5 }}
              className="glass-card p-6 flex flex-col items-center justify-center text-center gap-2 bg-white/50 dark:bg-surface/50 border border-border-hairline"
            >
              <div className={`p-3 rounded-2xl ${item.bg} mb-1`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <p className="font-semibold text-text-primary text-base">{item.title}</p>
              <p className="text-xs text-text-secondary">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
