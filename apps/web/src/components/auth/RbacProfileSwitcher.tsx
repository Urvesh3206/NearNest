"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Shield, User, Store, Wrench, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { UserRole } from '@/types';

export interface RoleCardConfig {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  badge: string;
}

export const RBAC_ROLES: RoleCardConfig[] = [
  {
    role: 'ADMIN',
    title: 'Super Admin (Urvesh Rane)',
    description: 'Master access to all platform controls, society ERP & verification.',
    icon: Shield,
    route: '/dashboard/admin',
    badge: 'Platform Master',
  },
  {
    role: 'RESIDENT',
    title: 'Resident (Aarav Patel)',
    description: 'Community feed, chat, society dues & visitor gate passes',
    icon: User,
    route: '/dashboard/resident',
    badge: 'Society Resident',
  },
  {
    role: 'BUSINESS',
    title: 'Business Owner (Priya Sharma)',
    description: 'Manage Green Mart shop, customer orders & promotional offers',
    icon: Store,
    route: '/dashboard/business',
    badge: 'Merchant Console',
  },
  {
    role: 'SERVICE_PROVIDER',
    title: 'Service Pro (Rajesh Electrician)',
    description: 'Service bookings, hourly rates & service job schedules',
    icon: Wrench,
    route: '/dashboard/service',
    badge: 'Verified Specialist',
  },
];

interface RbacProfileSwitcherProps {
  className?: string;
  redirectOnSelect?: boolean;
  onSelectRole?: (role: UserRole) => void;
}

export function RbacProfileSwitcher({
  className = '',
  redirectOnSelect = true,
  onSelectRole,
}: RbacProfileSwitcherProps) {
  const router = useRouter();
  const { user, switchRole } = useAuth();
  const currentRole = user?.role || 'ADMIN';

  const handleSelectRole = (config: RoleCardConfig) => {
    // 1. Update Auth state and localStorage
    switchRole(config.role);

    // 2. Explicitly sync cookie for Next.js middleware edge verification
    if (typeof document !== 'undefined') {
      document.cookie = `user_role=${config.role}; path=/; max-age=31536000; SameSite=Lax`;
    }

    // 3. Optional callback
    if (onSelectRole) {
      onSelectRole(config.role);
    }

    // 4. Redirect to role's dashboard
    if (redirectOnSelect) {
      router.push(config.route);
    }
  };

  return (
    <div
      className={`bg-slate-950 text-slate-100 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl transition-all ${className}`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Role-Based Access Control
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Switch between login specifications to test limits
          </p>
        </div>

        {/* Small "Active" Status Badge in top right */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active</span>
        </div>
      </div>

      {/* Role Cards List */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {RBAC_ROLES.map((card) => {
          const isActive = card.role === currentRole;
          const Icon = card.icon;

          return (
            <button
              key={card.role}
              type="button"
              onClick={() => handleSelectRole(card)}
              className={`w-full group relative flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900 hover:shadow-md'
              }`}
            >
              {/* Icon Container */}
              <div
                className={`p-3 rounded-xl shrink-0 transition-colors ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Title & Description */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2">
                  <h4
                    className={`text-sm font-bold truncate ${
                      isActive ? 'text-emerald-400' : 'text-slate-200 group-hover:text-white'
                    }`}
                  >
                    {card.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {card.description}
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    {card.route}
                  </span>
                </div>
              </div>

              {/* Active State Checkmark */}
              {isActive && (
                <div className="absolute top-4 right-4 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 fill-emerald-500/20 text-emerald-400" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RbacProfileSwitcher;
