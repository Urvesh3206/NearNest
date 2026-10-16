"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Key, CheckCircle2, AlertCircle, Loader2, X, ExternalLink, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export interface EmailConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  onSuccess?: () => void;
}

export function EmailConfigModal({
  isOpen,
  onClose,
  defaultEmail = 'rupeshrane3206@gmail.com',
  onSuccess,
}: EmailConfigModalProps) {
  const [emailUser, setEmailUser] = useState(defaultEmail);
  const [emailPass, setEmailPass] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/email')
        .then((res) => res.json())
        .then((data) => {
          if (data.isConfigured && data.emailUser) {
            setIsConfigured(true);
            setEmailUser(data.emailUser);
            setStatusMessage(`Active SMTP: Delivering real emails from ${data.emailUser}`);
          } else {
            setIsConfigured(false);
            setStatusMessage('Currently in Test Sandbox Mode (Ethereal). Add your Gmail App Password below to deliver real emails.');
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailUser.trim()) {
      setErrorMessage('Please enter your Gmail address.');
      return;
    }
    if (!emailPass.trim()) {
      setErrorMessage('Please enter your 16-character Google App Password.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailUser: emailUser.trim(),
          emailPass: emailPass.trim(),
          testRecipient: emailUser.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsConfigured(true);
        setStatusMessage(data.message || 'Connected successfully!');
        toast.success(`Connected! Real test email sent to ${emailUser}`, {
          icon: '🎉',
          duration: 6000,
        });
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMessage(data.error || 'Connection failed.');
        if (data.tip) {
          toast.error(data.tip, { duration: 8000 });
        }
      }
    } catch (err: any) {
      setErrorMessage('Failed to connect to the email server. Please check your credentials.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-full max-w-md bg-surface border border-border-hairline rounded-3xl shadow-modal overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-border-hairline bg-surface-subtle/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center border border-brand-500/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-text-primary">Real Email Setup</h3>
                  <p className="text-xs text-text-secondary">Send real emails to Gmail & provider inboxes</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Indicator */}
            <div className="px-5 pt-4">
              <div
                className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${
                  isConfigured
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-200'
                }`}
              >
                {isConfigured ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold block">
                    {isConfigured ? 'Real Email Active' : 'Sandbox Test Mode Active'}
                  </span>
                  <p className="text-[11px] opacity-90 mt-0.5">{statusMessage}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-text-primary">
                  Your Sender Gmail Address
                </label>
                <input
                  type="email"
                  required
                  value={emailUser}
                  onChange={(e) => setEmailUser(e.target.value)}
                  placeholder="rupeshrane3206@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-subtle border border-border-hairline text-xs text-text-primary font-mono outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-text-primary">
                    16-Character Google App Password
                  </label>
                  <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-brand-600 hover:underline flex items-center gap-0.5 font-medium"
                  >
                    <span>Get Password</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="password"
                    required
                    value={emailPass}
                    onChange={(e) => setEmailPass(e.target.value)}
                    placeholder="abcd efgh ijkl mnop"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-surface-subtle border border-border-hairline text-xs text-text-primary font-mono tracking-wider outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
                <p className="text-[11px] text-text-tertiary">
                  Do not use your regular Gmail password. Google requires an <strong>App Password</strong> generated at{' '}
                  <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 underline"
                  >
                    myaccount.google.com/apppasswords
                  </a>
                  .
                </p>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-coral-500/10 border border-coral-500/20 text-coral-600 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-50 shadow-md shadow-brand-500/20 transition-all"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying & Sending...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Connect & Send Test Email</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
