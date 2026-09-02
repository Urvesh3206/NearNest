"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageSquare, Store, Calendar, Shield, Building2, Sparkles } from 'lucide-react';

const features = [
  {
    title: 'Community Feed',
    description: 'Share updates, ask questions, and connect with neighbors in real-time.',
    icon: MessageSquare,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    colSpan: 'md:col-span-2',
    preview: (
      <div className="mt-4 space-y-3 bg-canvas/50 p-4 rounded-xl border border-border-hairline">
        <div className="flex gap-3 items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-400 to-brand-600" />
          <div className="space-y-1">
            <div className="w-24 h-2 rounded bg-border-hairline" />
            <div className="w-16 h-2 rounded bg-border-hairline/50" />
          </div>
        </div>
        <div className="w-full h-2 rounded bg-border-hairline" />
        <div className="w-3/4 h-2 rounded bg-border-hairline" />
      </div>
    ),
  },
  {
    title: 'Local Businesses',
    description: 'Discover nearby shops, cafes, and local services right in your app.',
    icon: Store,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    colSpan: 'col-span-1',
  },
  {
    title: 'Book Services',
    description: 'Easily book appointments with verified local service providers.',
    icon: Calendar,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    colSpan: 'col-span-1',
  },
  {
    title: 'Safety & Emergency',
    description: 'Real-time neighborhood alerts and instant SOS functionality.',
    icon: Shield,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    colSpan: 'md:col-span-2',
    preview: (
      <div className="mt-4 flex items-center justify-between bg-red-500/5 p-4 rounded-xl border border-red-500/20">
        <div className="flex gap-3 items-center text-red-600">
          <Shield className="w-6 h-6" />
          <span className="font-semibold text-sm">Neighborhood Watch Active</span>
        </div>
        <button className="px-4 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg shadow-red-500/30">
          SOS
        </button>
      </div>
    ),
  },
  {
    title: 'Society Management',
    description: 'Maintenance tracking, visitor management, and complaints resolution.',
    icon: Building2,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    colSpan: 'col-span-1',
  },
  {
    title: 'AI Assistant',
    description: 'Smart recommendations for local events and connections.',
    icon: Sparkles,
    color: 'text-brand-500',
    bg: 'bg-brand-500/10',
    colSpan: 'col-span-1',
  },
];

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto" ref={ref}>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">
          Everything your neighborhood needs
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          A comprehensive suite of tools designed to bring communities closer, manage societies efficiently, and support local economies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
            className={`bg-surface rounded-3xl border border-border-hairline p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${feature.colSpan}`}
          >
            <div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${feature.bg}`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">{feature.title}</h3>
              <p className="text-text-secondary">{feature.description}</p>
            </div>
            {feature.preview && (
              <div className="mt-6 flex-grow flex flex-col justify-end">
                {feature.preview}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
