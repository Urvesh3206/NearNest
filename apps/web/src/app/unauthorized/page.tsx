"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { RbacProfileSwitcher } from '@/components/auth/RbacProfileSwitcher';
import { useAuth } from '@/providers/AuthProvider';

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const attempted = searchParams.get('attempted') || '/dashboard';
  const required = searchParams.get('required') || 'ADMIN';
  const currentRole = user?.role || searchParams.get('current') || 'RESIDENT';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl space-y-6">
        {/* Access Denied Hero Card */}
        <div className="bg-slate-900/90 border border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Red Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 shrink-0">
              <ShieldAlert className="w-10 h-10 animate-bounce" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-mono font-bold uppercase tracking-wider">
                  403 Forbidden
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Next.js Middleware Route Guard
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
                Access Denied: Role Specification Limit
              </h1>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                Strict Role-Based Isolation is active on NearNest. Your current login profile does not have permission to access the requested control module.
              </p>
            </div>
          </div>

          {/* Diagnostic Details Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-slate-800">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
                Attempted Route
              </span>
              <span className="text-xs font-bold text-red-400 font-mono mt-0.5 block truncate">
                {attempted}
              </span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
                Your Active Persona
              </span>
              <span className="text-xs font-bold text-amber-400 mt-0.5 block">
                {currentRole}
              </span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
                Required Permission
              </span>
              <span className="text-xs font-bold text-emerald-400 mt-0.5 block">
                {required}
              </span>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all border border-slate-700"
            >
              <Home className="w-4 h-4 text-emerald-400" />
              <span>Return to My Authorized Dashboard</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 text-xs font-medium transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Embedded Dark Theme RBAC Switcher */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 px-1">
            ⚡ Quick-Switch to Authorized Specification:
          </div>
          <RbacProfileSwitcher redirectOnSelect={true} />
        </div>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-sm">Checking Permissions...</div>}>
      <UnauthorizedContent />
    </Suspense>
  );
}
