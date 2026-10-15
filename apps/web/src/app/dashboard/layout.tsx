"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  ShieldCheck, 
  User, 
  Store, 
  Wrench, 
  LogOut, 
  Layers, 
  ArrowLeft,
  SlidersHorizontal,
  Home
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { RbacProfileSwitcher } from '@/components/auth/RbacProfileSwitcher';

export default function DashboardRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const currentRole = user?.role || 'ADMIN';
  const [showRbacModal, setShowRbacModal] = useState(false);

  const roleMeta = {
    ADMIN: {
      label: 'Super Admin',
      icon: ShieldCheck,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
      activeBorder: 'border-purple-500',
    },
    RESIDENT: {
      label: 'Resident',
      icon: User,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      activeBorder: 'border-emerald-500',
    },
    BUSINESS: {
      label: 'Business Owner',
      icon: Store,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      activeBorder: 'border-amber-500',
    },
    SERVICE_PROVIDER: {
      label: 'Service Pro',
      icon: Wrench,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
      activeBorder: 'border-blue-500',
    },
  }[currentRole];

  const RoleIcon = roleMeta.icon;

  const navTabs = [
    { name: '👑 Admin ERP', href: '/dashboard/admin', role: 'ADMIN' },
    { name: '🛡️ Approvals Queue', href: '/dashboard/admin/approvals', role: 'ADMIN' },
    { name: '🏡 Resident Hub', href: '/dashboard/resident', role: 'RESIDENT' },
    { name: '📍 Nearby Services', href: '/dashboard/resident/services', role: 'RESIDENT' },
    { name: '🏪 Business Console', href: '/dashboard/business', role: 'BUSINESS' },
    { name: '🔧 Service Pro Hub', href: '/dashboard/service', role: 'SERVICE_PROVIDER' },
    { name: '📝 Join as Pro', href: '/join-pro', role: 'SERVICE_PROVIDER' },
  ];

  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-brand-500 p-2 rounded-xl text-white shadow-sm group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight gradient-text">
                  NearNest
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-wider text-text-tertiary ml-2 px-1.5 py-0.5 rounded bg-surface-subtle border border-border-hairline">
                  RBAC Matrix
                </span>
              </div>
            </Link>

            <Link
              href="/feed"
              className="hidden md:flex items-center gap-1.5 text-xs text-text-secondary hover:text-brand-600 font-medium transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Community Feed</span>
            </Link>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* RBAC Switcher Toggle Button */}
            <button
              onClick={() => setShowRbacModal(!showRbacModal)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 text-white hover:bg-slate-900 border border-slate-800 text-xs font-semibold shadow-sm transition-all"
              title="Open Role-Based Access Control Switcher"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">RBAC Switcher</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            {/* Current Active Persona Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${roleMeta.color}`}>
              <RoleIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{user?.name}</span>
              <span className="font-mono text-[10px] uppercase opacity-80">({currentRole})</span>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 rounded-xl hover:bg-red-500/10 text-text-tertiary hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-nav role tabs */}
        <div className="border-t border-border-hairline/60 bg-surface-subtle/40 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 py-2">
            <span className="text-[10px] uppercase font-mono font-bold text-text-tertiary mr-2 shrink-0">
              Isolated Routes:
            </span>
            {navTabs.map((tab) => {
              const isCurrentRoute = pathname.startsWith(tab.href);
              const isUserRole = tab.role === currentRole;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all flex items-center gap-1.5 ${
                    isCurrentRoute
                      ? 'bg-surface text-brand-600 dark:text-brand-400 border border-brand-500/40 shadow-sm font-bold'
                      : isUserRole
                      ? 'bg-surface/80 text-text-primary hover:bg-surface border border-border-hairline'
                      : 'text-text-tertiary hover:text-text-secondary hover:bg-surface/50'
                  }`}
                >
                  <span>{tab.name}</span>
                  {isUserRole && (
                    <span className="text-[9px] px-1 rounded bg-brand-500/20 text-brand-600 dark:text-brand-300 font-mono">
                      Yours
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Floating RBAC Switcher Modal if toggled */}
        {showRbacModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-3xl">
              <button
                onClick={() => setShowRbacModal(false)}
                className="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-slate-900 border border-slate-700 text-white hover:bg-slate-800"
              >
                ✕
              </button>
              <RbacProfileSwitcher
                redirectOnSelect={true}
                onSelectRole={() => setShowRbacModal(false)}
              />
            </div>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}
