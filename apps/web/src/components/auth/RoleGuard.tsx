"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { UserRole } from '@/types';
import { ShieldAlert, Lock, ArrowRight, UserCheck, ShieldCheck, Home } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

export function RoleGuard({
  allowedRoles,
  children,
  fallbackTitle = "Access Restricted: Role Permissions Required",
  fallbackMessage = "This console is restricted to specific authorized roles in NearNest.",
}: RoleGuardProps) {
  const { user, switchRole } = useAuth();
  const currentRole = user?.role || 'RESIDENT';

  const isAuthorized = allowedRoles.includes(currentRole);

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-xl w-full p-8 text-center bg-surface border border-red-500/20 shadow-xl rounded-3xl space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-600 flex items-center justify-center mx-auto border border-red-500/20 shadow-sm animate-pulse">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-900 mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Role-Based Access Limit Active</span>
          </div>
          <h2 className="text-2xl font-black text-text-primary tracking-tight">{fallbackTitle}</h2>
          <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
            {fallbackMessage}
          </p>
        </div>

        {/* Current vs Required Role Card */}
        <div className="bg-canvas p-4 rounded-2xl border border-border-hairline text-left space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-border-hairline">
            <span className="text-text-secondary font-medium">Your Current Account:</span>
            <span className="font-bold text-text-primary flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{user?.name} ({currentRole})</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">Required Clearance:</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {allowedRoles.map((role) => (
                <span
                  key={role}
                  className="px-2 py-0.5 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold text-[11px] border border-brand-200 dark:border-brand-800"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/feed" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full justify-center text-xs rounded-xl">
              <Home className="w-4 h-4 mr-1.5" /> Back to Resident Home
            </Button>
          </Link>

          {/* Quick Switch for Admin Demonstration */}
          <Button
            onClick={() => switchRole('ADMIN')}
            className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl shadow-md flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Switch to Admin Mode</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
