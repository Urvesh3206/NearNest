"use client";

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, MapPin, Building, Globe } from 'lucide-react';

const communities = [
  { name: 'Greenfield Park', city: 'San Francisco', members: '1,200', posts: '3.4K', gradient: 'from-emerald-500 to-teal-400' },
  { name: 'Riverside Heights', city: 'Austin', members: '850', posts: '1.2K', gradient: 'from-blue-500 to-indigo-400' },
  { name: 'Maplewood West', city: 'Seattle', members: '2,100', posts: '5.8K', gradient: 'from-purple-500 to-pink-400' },
];

function StatCounter({ value, label, inView }: { value: string, label: string, inView: boolean }) {
  // Simple fade in for stats to avoid complex counter logic in short snippet
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center"
    >
      <span className="text-4xl font-black text-text-primary mb-2">{value}</span>
      <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">{label}</span>
    </motion.div>
  );
}

export function Communities() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" ref={ref}>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">
          Thriving communities across the country
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          From bustling city apartments to quiet suburban streets, NeighbourHub connects them all.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {communities.map((comm, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
            className="rounded-3xl overflow-hidden bg-surface border border-border-hairline shadow-card group cursor-pointer"
          >
            <div className={`h-32 bg-gradient-to-r ${comm.gradient} p-6 flex flex-col justify-end relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1">
                <Users className="w-3 h-3" /> {comm.members}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-text-primary mb-1 group-hover:text-brand-500 transition-colors">{comm.name}</h3>
              <p className="text-text-secondary flex items-center gap-1.5 text-sm mb-4">
                <MapPin className="w-4 h-4" /> {comm.city}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-border-hairline">
                <span className="text-sm font-medium text-text-tertiary">{comm.posts} active posts</span>
                <span className="text-brand-500 text-sm font-semibold group-hover:translate-x-1 transition-transform">Join →</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-border-hairline">
        <StatCounter value="10,000+" label="Neighborhoods" inView={isInView} />
        <StatCounter value="500K+" label="Residents" inView={isInView} />
        <StatCounter value="15K+" label="Businesses" inView={isInView} />
        <StatCounter value="50+" label="Cities" inView={isInView} />
      </div>
    </section>
  );
}
