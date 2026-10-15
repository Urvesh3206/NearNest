"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  DollarSign, 
  FileCheck, 
  AlertTriangle, 
  Bell, 
  CheckCircle2, 
  XCircle,
  Database,
  ArrowRight
} from 'lucide-react';
import { RbacProfileSwitcher } from '@/components/auth/RbacProfileSwitcher';
import { useAuth } from '@/providers/AuthProvider';
import { getLocalVerifications, updateVerificationStatus } from '@/lib/verificationStore';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const localList = getLocalVerifications();
      const res = await fetch('/api/admin/verifications');
      if (res.ok) {
        const data = await res.json();
        const incoming = data.requests || data.data;
        if (data.success && Array.isArray(incoming)) {
          const merged = [...incoming];
          for (const localItem of localList) {
            const exists = merged.some((m: any) => m.id === localItem.id || m.name?.toLowerCase() === localItem.name?.toLowerCase());
            if (!exists) {
              merged.unshift(localItem);
            }
          }
          setVerifications(merged);
          return;
        }
      }
      throw new Error('Fallback to local store');
    } catch {
      setVerifications(getLocalVerifications());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/admin/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          toast.success(`Request ${action === 'approve' ? 'Approved' : 'Rejected'}!`);
          loadData();
          return;
        }
      }
      throw new Error('Fallback update');
    } catch {
      updateVerificationStatus(id, action === 'approve' ? 'APPROVE' : 'REJECT');
      toast.success(`Request ${action === 'approve' ? 'Approved & Published' : 'Rejected'}!`);
      setVerifications(getLocalVerifications());
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Interactive RBAC Switcher Banner */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary">
            Interactive Test Hub
          </span>
          <span className="text-xs text-purple-600 dark:text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
            👑 Super Admin Zone (/dashboard/admin)
          </span>
        </div>
        <RbacProfileSwitcher />
      </div>

      {/* Admin Header */}
      <div className="bg-surface border border-border-hairline rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-mono font-bold">
              SUPER_ADMIN Specification
            </span>
            <span className="text-xs text-text-tertiary">Logged in as {user?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-2">
            Society Master ERP & Governance Console
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Master control room for society registrations, provider KYC audits, dues reconciliation, and multi-tenant security.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/dashboard/admin/approvals"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-md"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Service Pro Approvals</span>
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-subtle hover:bg-surface border border-border-hairline text-text-primary font-semibold text-xs transition-all"
          >
            <span>Full Admin ERP</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Registered Societies', val: '12 Complexes', icon: Building2, color: 'text-purple-500 bg-purple-500/10' },
          { label: 'Verified Residents', val: '1,240 Units', icon: Users, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Dues Collected', val: '₹48,500 (96%)', icon: DollarSign, color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Audit Compliance', val: '100% Clear', icon: FileCheck, color: 'text-blue-500 bg-blue-500/10' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-surface border border-border-hairline rounded-2xl p-5 shadow-card">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs text-text-tertiary font-medium">{kpi.label}</p>
              <h3 className="text-xl font-bold text-text-primary mt-0.5">{kpi.val}</h3>
            </div>
          );
        })}
      </div>

      {/* Verification Approvals Queue */}
      <div className="bg-surface border border-border-hairline rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-border-hairline">
          <div>
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-500" />
              <span>Pending Service Provider & Merchant Verification Queue</span>
            </h3>
            <p className="text-xs text-text-tertiary mt-0.5">
              Live requests awaiting Super Admin verification before going public.
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-1 rounded bg-surface-subtle border border-border-hairline text-text-secondary">
            {verifications.length} Entries
          </span>
        </div>

        {loading ? (
          <div className="py-10 text-center text-xs text-text-tertiary">Loading verifications...</div>
        ) : verifications.length === 0 ? (
          <div className="py-10 text-center text-xs text-text-tertiary">No pending verifications.</div>
        ) : (
          <div className="divide-y divide-border-hairline">
            {verifications.slice(0, 5).map((v) => (
              <div key={v.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary">{v.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-subtle border border-border-hairline text-text-secondary uppercase">
                      {v.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      v.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600' :
                      v.status === 'REJECTED' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {v.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    {v.category} • {v.phone} • {v.address}
                  </p>
                </div>

                {v.status === 'PENDING' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleAction(v.id, 'approve')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleAction(v.id, 'reject')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
