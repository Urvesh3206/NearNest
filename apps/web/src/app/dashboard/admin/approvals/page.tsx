"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  DollarSign, 
  Wrench, 
  Phone, 
  Mail, 
  ArrowLeft,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { 
  getPendingProvidersAction, 
  approveServiceProviderAction, 
  rejectServiceProviderAction,
  ServiceProviderRecord
} from '@/app/actions/serviceProviderActions';
import toast from 'react-hot-toast';

export default function AdminApprovalsPage() {
  const [pendingProviders, setPendingProviders] = useState<ServiceProviderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const records = await getPendingProvidersAction();
      setPendingProviders(records);
    } catch (e) {
      toast.error('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: string, name: string) => {
    setProcessingId(id);
    try {
      const result = await approveServiceProviderAction(id);
      if (result.success) {
        toast.success(`Approved ${name}! Profile is now live in Resident Directory.`, {
          icon: '✅',
          duration: 4000,
        });
        setPendingProviders((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error(result.error || 'Failed to approve');
      }
    } catch {
      toast.error('Error during approval');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string, name: string) => {
    setProcessingId(id);
    try {
      const result = await rejectServiceProviderAction(id);
      if (result.success) {
        toast.error(`Rejected ${name}. Access declined.`, {
          icon: '❌',
          duration: 4000,
        });
        setPendingProviders((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error(result.error || 'Failed to reject');
      }
    } catch {
      toast.error('Error during rejection');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/admin"
              className="text-xs text-text-tertiary hover:text-text-primary flex items-center gap-1 font-mono transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-1 flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-purple-600" />
            <span>Service Provider Approvals</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Review incoming specialist registration requests before they become searchable to residents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-subtle border border-border-hairline text-xs font-semibold hover:bg-surface transition-all text-text-secondary"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs font-mono font-bold">
            {pendingProviders.length} Pending
          </span>
        </div>
      </div>

      {/* Main Content List / Table */}
      {loading ? (
        <div className="p-16 text-center bg-surface border border-border-hairline rounded-3xl">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-text-tertiary font-mono">Fetching pending provider queue...</p>
        </div>
      ) : pendingProviders.length === 0 ? (
        <div className="p-12 sm:p-16 text-center bg-surface border border-border-hairline rounded-3xl shadow-card space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">All Caught Up!</h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            No service providers are currently awaiting verification. New onboarding requests will appear here in real time.
          </p>
          <div className="pt-2">
            <Link
              href="/join-pro"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-md"
            >
              <Wrench className="w-4 h-4" />
              <span>Simulate New "Join as Pro" Request</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-border-hairline rounded-3xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle/80 border-b border-border-hairline text-text-tertiary uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Service Provider</th>
                  <th className="py-3.5 px-4">Category & Rate</th>
                  <th className="py-3.5 px-4">Location / Pincode</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline">
                {pendingProviders.map((provider) => {
                  const isProcessing = processingId === provider.id;

                  return (
                    <tr key={provider.id} className="hover:bg-surface-subtle/40 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={provider.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(provider.name)}`}
                            alt={provider.name}
                            className="w-10 h-10 rounded-xl bg-surface-subtle border border-border-hairline object-cover shrink-0"
                          />
                          <div>
                            <span className="font-bold text-text-primary text-sm block">
                              {provider.name}
                            </span>
                            <div className="flex items-center gap-2 text-text-tertiary text-[11px] mt-0.5">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-emerald-500" />
                                {provider.phone || '+91 98220 11223'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Hourly Rate */}
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px] border border-blue-500/20">
                          {provider.category}
                        </span>
                        <div className="text-text-primary font-bold mt-1 font-mono text-xs">
                          {provider.hourlyRate || provider.rate || '₹300/hr'}
                        </div>
                      </td>

                      {/* Location & Pincode */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                          <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          <span>{provider.location || 'Pune'}</span>
                        </div>
                        <span className="text-[10px] font-mono text-text-tertiary block mt-0.5">
                          Pincode: <strong className="text-text-primary">{provider.pincode || '411047'}</strong>
                        </span>
                      </td>

                      {/* Submission Date */}
                      <td className="py-4 px-4 text-text-tertiary text-[11px] font-mono">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {provider.createdAt ? new Date(provider.createdAt).toLocaleDateString() : 'Just now'}
                          </span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 font-bold mt-1 inline-block">
                          PENDING
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(provider.id, provider.name)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm disabled:opacity-50"
                            title="Approve Service Provider"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(provider.id, provider.name)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all shadow-sm disabled:opacity-50"
                            title="Reject Service Provider"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
