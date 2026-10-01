"use client";

import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { UserRole } from '@/types';
import { ShieldCheck, User, Store, Wrench, ChevronDown, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ROLES_INFO: { role: UserRole; title: string; subtitle: string; icon: any; color: string }[] = [
  {
    role: 'ADMIN',
    title: 'Super Admin (Urvesh Rane)',
    subtitle: 'Master access to all platform controls, society ERP & verification',
    icon: ShieldCheck,
    color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10',
  },
  {
    role: 'RESIDENT',
    title: 'Resident (Aarav Patel)',
    subtitle: 'Community feed, chat, society dues & visitor gate passes',
    icon: User,
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
  },
  {
    role: 'BUSINESS',
    title: 'Business Owner (Priya Sharma)',
    subtitle: 'Manage Green Mart shop, customer orders & promotional offers',
    icon: Store,
    color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
  },
  {
    role: 'SERVICE_PROVIDER',
    title: 'Service Pro (Rajesh Electrician)',
    subtitle: 'Service bookings, hourly rates & service job schedules',
    icon: Wrench,
    color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
  },
];

export function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const currentRole = user?.role || 'RESIDENT';
  const currentInfo = ROLES_INFO.find((r) => r.role === currentRole) || ROLES_INFO[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border-hairline hover:border-brand-500/50 shadow-sm transition-all text-xs font-semibold text-text-primary group"
        title="Switch User Role Persona"
      >
        <div className={`p-1 rounded-md ${currentInfo.color}`}>
          <currentInfo.icon className="w-3.5 h-3.5" />
        </div>
        <span className="truncate max-w-[120px] sm:max-w-[160px]">
          {currentRole === 'ADMIN' ? '👑 Super Admin' : currentRole === 'BUSINESS' ? '🏪 Business' : currentRole === 'SERVICE_PROVIDER' ? '🔧 Service Pro' : '🏡 Resident'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 p-3 bg-surface border border-border-hairline rounded-3xl shadow-2xl z-50 space-y-2"
            >
              <div className="px-3 py-2 border-b border-border-hairline flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                    <span>Role-Based Access Control</span>
                  </h4>
                  <p className="text-[10px] text-text-tertiary mt-0.5">
                    Switch between login specifications to test limits
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold">
                  Active
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                {ROLES_INFO.map((item) => {
                  const isSelected = item.role === currentRole;
                  return (
                    <button
                      key={item.role}
                      onClick={() => {
                        switchRole(item.role);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-2xl transition-all text-left ${
                        isSelected
                          ? 'bg-brand-50/80 dark:bg-brand-950/40 border border-brand-300 dark:border-brand-800'
                          : 'hover:bg-surface-subtle'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${item.color}`}>
                        <item.icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-text-primary'}`}>
                            {item.title}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-text-secondary leading-snug mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
