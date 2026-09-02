"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Coffee, Utensils, Scissors, HeartPulse, Dumbbell, Pill, Croissant, Shirt, Dog, BookOpen, ArrowRight } from 'lucide-react';

const categories = [
  { name: 'Restaurant', count: 124, icon: Utensils, bg: 'bg-orange-500/10', color: 'text-orange-500' },
  { name: 'Cafe', count: 86, icon: Coffee, bg: 'bg-amber-500/10', color: 'text-amber-500' },
  { name: 'Salon', count: 45, icon: Scissors, bg: 'bg-pink-500/10', color: 'text-pink-500' },
  { name: 'Medical', count: 32, icon: HeartPulse, bg: 'bg-red-500/10', color: 'text-red-500' },
  { name: 'Gym', count: 28, icon: Dumbbell, bg: 'bg-zinc-500/10', color: 'text-zinc-500' },
  { name: 'Pharmacy', count: 41, icon: Pill, bg: 'bg-emerald-500/10', color: 'text-emerald-500' },
  { name: 'Bakery', count: 19, icon: Croissant, bg: 'bg-yellow-500/10', color: 'text-yellow-500' },
  { name: 'Laundry', count: 15, icon: Shirt, bg: 'bg-blue-500/10', color: 'text-blue-500' },
  { name: 'Pet Shop', count: 22, icon: Dog, bg: 'bg-purple-500/10', color: 'text-purple-500' },
  { name: 'Tuition', count: 56, icon: BookOpen, bg: 'bg-indigo-500/10', color: 'text-indigo-500' },
];

export function BusinessShowcase() {
  return (
    <section id="businesses" className="py-24 bg-surface-glass border-y border-border-hairline overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Discover local gems near you</h2>
            <p className="text-text-secondary">Support local businesses and find essential services within walking distance.</p>
          </div>
          <Link href="/businesses" className="group flex items-center gap-2 text-brand-500 font-semibold hover:text-brand-600 transition-colors">
            View all 500+ businesses 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="w-full" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
        <div className="flex gap-4 px-4 sm:px-10 pb-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="snap-start flex-none w-[160px] bg-canvas rounded-2xl p-5 border border-border-hairline shadow-sm hover:shadow-card-hover transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${cat.bg}`}>
                <cat.icon className={`w-7 h-7 ${cat.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">{cat.name}</h3>
                <p className="text-xs text-text-tertiary mt-1">{cat.count} listings</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
