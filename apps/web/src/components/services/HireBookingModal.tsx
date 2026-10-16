"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, ShieldCheck, UserCheck, MapPin, Mail, ExternalLink, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/providers/AuthProvider';
import { useSocket } from '@/providers/SocketProvider';
import { createServiceBookingAction, ServiceBookingRecord } from '@/actions/bookingActions';
import { sendHireNotification } from '@/actions/hire-provider';
import { EmailConfigModal } from './EmailConfigModal';

export interface HireBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: {
    id: string;
    name: string;
    category?: string;
    rate?: string;
    hourlyRate?: string;
    avatar?: string;
    phone?: string;
    email?: string;
    location?: string;
  };
  residentContext?: {
    name?: string;
    email?: string;
    phone?: string;
    society?: string;
    unit?: string;
  };
  onSuccess?: (booking: ServiceBookingRecord) => void;
}

export function HireBookingModal({
  isOpen,
  onClose,
  provider,
  residentContext,
  onSuccess,
}: HireBookingModalProps) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [taskDescription, setTaskDescription] = useState('');

  const defaultProvEmail =
    provider.email ||
    `${provider.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`;
  const [providerEmail, setProviderEmail] = useState(defaultProvEmail);

  const [residentEmail, setResidentEmail] = useState(
    residentContext?.email || user?.email || 'sumit.gurjar@adypu.edu.in'
  );

  const residentName = residentContext?.name || user?.name || 'Aarav Patel';
  const defaultAddress =
    residentContext?.unit && residentContext?.society
      ? `${residentContext.unit}, ${residentContext.society}`
      : (user as any)?.society || 'Flat 301, Ajeenkya Residency';
  const [residentAddress, setResidentAddress] = useState(defaultAddress);

  React.useEffect(() => {
    if (isOpen) {
      const email = provider.email || `${provider.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`;
      setProviderEmail(email);
      if (residentContext?.email || user?.email) {
        setResidentEmail(residentContext?.email || user?.email || 'sumit.gurjar@adypu.edu.in');
      }
      if (residentContext?.unit && residentContext?.society) {
        setResidentAddress(`${residentContext.unit}, ${residentContext.society}`);
      }
    }
  }, [isOpen, provider, residentContext, user]);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const residentPhone = residentContext?.phone || (user as any)?.phone || '+91 98765 43210';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskDescription.trim()) {
      setError('Please provide a brief description of what you need help with.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // 1. Save in-app booking to PostgreSQL / Prisma database
      const response = await createServiceBookingAction({
        providerId: provider.id,
        providerName: provider.name,
        providerCategory: provider.category,
        taskDescription: taskDescription.trim(),
        residentId: user?.uid || 'res_current',
        residentName,
        residentFlat: residentAddress,
        residentPhone,
      });

      if (response.success && response.booking) {
        // 2. Trigger Real-Time Socket.io event for the provider dashboard
        if (socket && socket.connected) {
          socket.emit('new-booking-request', {
            providerId: provider.id,
            bookingDetails: response.booking,
          });
        }

        // 3. Dispatch Automated Confirmation Emails to BOTH Resident and Provider
        const targetProviderEmail = providerEmail.trim() || defaultProvEmail;

        const emailResult = await sendHireNotification(targetProviderEmail, {
          name: residentName,
          email: residentEmail.trim() || 'resident@nearnest.com',
          phone: residentPhone,
          society: residentContext?.society || 'Ajeenkya Residency',
          unit: residentAddress,
          location: residentAddress,
          address: residentAddress,
          providerName: provider.name,
          serviceCategory: provider.category || 'Specialist Services',
          serviceRequired: taskDescription.trim(),
          notes: taskDescription.trim(),
        });

        // 4. Direct Success Toast (No redirect, No external links - automated background delivery)
        const toastMsg = emailResult?.message || `Order sent to ${provider.name}! Work order email dispatched.`;
        toast.success(toastMsg, {
          icon: '📬',
          duration: 6000,
        });

        if (onSuccess) {
          onSuccess(response.booking);
        }
        setTaskDescription('');
        onClose();
      } else {
        toast.error(response.error || 'Failed to send request. Please try again.');
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred while sending the request.');
      console.error('Booking submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-surface border border-border-hairline rounded-3xl shadow-modal overflow-hidden z-10 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border-hairline bg-surface-subtle/50 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  {provider.avatar ? (
                    <img
                      src={provider.avatar}
                      alt={provider.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-border-hairline bg-surface"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-lg border border-brand-500/20">
                      {provider.name[0]}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full">
                    <ShieldCheck className="w-2.5 h-2.5" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-text-primary">{provider.name}</h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 border border-brand-500/20">
                      {provider.category || 'Specialist'}
                    </span>
                  </div>
                  <p className="text-xs text-text-tertiary flex items-center gap-1.5 mt-0.5">
                    <span>Rate: <strong className="text-text-primary">{provider.rate || provider.hourlyRate || '₹299/visit'}</strong></span>
                    {provider.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-brand-500" />
                          {provider.location}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Resident Context Card */}
              <div className="p-3.5 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/50 dark:border-brand-800/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300">
                  <UserCheck className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                  <div>
                    <span className="font-semibold block">{residentName}</span>
                    <span className="text-[11px] text-text-tertiary">{residentAddress}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  Direct In-App Booking
                </span>
              </div>

              {/* Real Email Delivery Setup Banner */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold block text-[11px]">Real Email Delivery Setup</span>
                    <span className="text-[10px] text-text-tertiary">To receive emails directly in Gmail / real inboxes</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(true)}
                  className="px-3 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-[11px] font-bold transition-all shadow-sm shrink-0 flex items-center justify-center gap-1"
                >
                  <Settings className="w-3 h-3" />
                  <span>Configure Gmail SMTP</span>
                </button>
              </div>

              {/* Email Addresses Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Resident Email Field */}
                <div className="space-y-1">
                  <label
                    htmlFor="residentEmail"
                    className="block text-xs font-bold text-text-primary flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-brand-500" />
                    <span>Resident Email</span>
                  </label>
                  <input
                    id="residentEmail"
                    type="email"
                    required
                    value={residentEmail}
                    onChange={(e) => setResidentEmail(e.target.value)}
                    placeholder="sumit.gurjar@adypu.edu.in"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-subtle border border-border-hairline text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-mono"
                  />
                  <span className="text-[10px] text-text-tertiary block">Receives booking receipt</span>
                </div>

                {/* Service Provider Email Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="providerEmail"
                      className="block text-xs font-bold text-text-primary flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Provider's Email</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setProviderEmail('urveshrane3206@gmail.com')}
                      className="text-[10px] text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:underline font-medium"
                    >
                      Use my Gmail (Test)
                    </button>
                  </div>
                  <input
                    id="providerEmail"
                    type="email"
                    required
                    value={providerEmail}
                    onChange={(e) => setProviderEmail(e.target.value)}
                    placeholder="provider@gmail.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-subtle border border-border-hairline text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-mono"
                  />
                  <span className="text-[10px] text-text-tertiary block">Receives job dispatch alert</span>
                </div>
              </div>

              {/* Resident Address & Flat */}
              <div className="space-y-1">
                <label
                  htmlFor="residentAddress"
                  className="block text-xs font-bold text-text-primary flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-brand-500" />
                  <span>Resident Flat / Society Address (Job Location)</span>
                </label>
                <input
                  id="residentAddress"
                  type="text"
                  required
                  value={residentAddress}
                  onChange={(e) => setResidentAddress(e.target.value)}
                  placeholder="e.g. Flat 301, Ajeenkya Residency, DY Patil Road"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-subtle border border-border-hairline text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>

              {/* Task Description Textarea */}
              <div className="space-y-1.5">
                <label
                  htmlFor="taskDescription"
                  className="block text-xs font-bold text-text-primary tracking-wide"
                >
                  What do you need help with? <span className="text-coral-500">*</span>
                </label>
                <textarea
                  id="taskDescription"
                  name="taskDescription"
                  rows={3}
                  value={taskDescription}
                  onChange={(e) => {
                    setTaskDescription(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g., I need someone to check the wiring in my house"
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-subtle border border-border-hairline text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                  autoFocus
                />
                {error && <p className="text-xs text-coral-500 font-medium">{error}</p>}
                <p className="text-[11px] text-text-tertiary">
                  Both in-app notification & confirmation email will be delivered upon sending.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !taskDescription.trim()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-500/20 transition-all duration-150 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      <EmailConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        defaultEmail={providerEmail}
      />
    </AnimatePresence>
  );
}

export default HireBookingModal;
