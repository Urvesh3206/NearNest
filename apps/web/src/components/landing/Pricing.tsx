"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui';

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6 tracking-tight">
          Simple, transparent pricing
        </h2>
        
        {/* Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm font-medium ${!isAnnual ? 'text-text-primary' : 'text-text-tertiary'}`}>Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 rounded-full bg-surface border border-border-hairline relative flex items-center p-1 cursor-pointer transition-colors"
          >
            <motion.div 
              layout
              className="w-6 h-6 rounded-full bg-brand-500 shadow-sm"
              animate={{ x: isAnnual ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={`text-sm font-medium flex items-center gap-2 ${isAnnual ? 'text-text-primary' : 'text-text-tertiary'}`}>
            Annual
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs px-2 py-0.5 rounded-full font-bold">
              Save 25%
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
        {/* Tier 1 */}
        <div className="rounded-3xl bg-surface p-8 border border-border-hairline shadow-card h-full flex flex-col">
          <h3 className="text-xl font-bold text-text-primary mb-2">Resident</h3>
          <p className="text-text-secondary text-sm mb-6">Perfect for individuals wanting to connect with neighbors.</p>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-text-primary">Free</span>
            <span className="text-text-secondary"> forever</span>
          </div>
          <Button variant="outline" className="w-full mb-8 py-6 rounded-xl font-semibold border-border-hairline">Get Started Free</Button>
          <div className="space-y-4 flex-1">
            {['Join community feed', 'Direct messaging', 'Local marketplace', 'Emergency alerts', 'Verified profile', 'Event discovery'].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-brand-500 shrink-0" />
                <span className="text-sm text-text-secondary">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2 */}
        <div className="rounded-3xl bg-surface p-8 border-2 border-brand-500 shadow-card-hover h-[105%] flex flex-col relative z-10 scale-[1.02]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Most Popular
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">Society Pro</h3>
          <p className="text-text-secondary text-sm mb-6">For society committees and property managers.</p>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-text-primary">₹{isAnnual ? '1,499' : '1,999'}</span>
            <span className="text-text-secondary">/mo</span>
          </div>
          <Button className="w-full mb-8 py-6 rounded-xl font-semibold bg-brand-500 hover:bg-brand-600 text-white">Start Free Trial</Button>
          <div className="space-y-4 flex-1">
            {['Everything in Resident', 'Visitor management', 'Maintenance tracking', 'Polls & Announcements', 'Staff management', 'Payment collection', 'Document vault', 'Dedicated support'].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-brand-500 shrink-0" />
                <span className="text-sm text-text-secondary font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 3 */}
        <div className="rounded-3xl bg-surface p-8 border border-border-hairline shadow-card h-full flex flex-col">
          <h3 className="text-xl font-bold text-text-primary mb-2">Business</h3>
          <p className="text-text-secondary text-sm mb-6">For local businesses looking to reach neighbors.</p>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-text-primary">₹{isAnnual ? '3,499' : '4,299'}</span>
            <span className="text-text-secondary">/mo</span>
          </div>

          <Button variant="outline" className="w-full mb-8 py-6 rounded-xl font-semibold border-border-hairline">Claim Profile</Button>
          <div className="space-y-4 flex-1">
            {['Verified business badge', 'Promoted local posts', 'Service bookings', 'Customer reviews', 'Analytics dashboard', 'Targeted offers', 'Priority support'].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-brand-500 shrink-0" />
                <span className="text-sm text-text-secondary">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
