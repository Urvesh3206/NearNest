"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  DollarSign, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowLeft,
  Sparkles,
  Building2,
  Lock
} from 'lucide-react';
import { registerServiceProviderAction } from '@/app/actions/serviceProviderActions';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Electrician',
  'Plumber',
  'AC Repair & Servicing',
  'Carpenter & Woodwork',
  'Painter',
  'Home Cleaning & Deep Sanitization',
  'Appliance Technician (RO/Washing Machine)',
  'Pest Control',
  'Gardener & Landscaper',
  'Security & CCTV Setup',
];

export default function JoinServiceProPage() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electrician',
    hourlyRate: '₹299/hr',
    pincode: '411047',
    location: 'Ajeenkya Residency & Society Vicinity',
    phone: '+91 ',
    email: '',
    experience: '4 years',
    speciality: '',
  });

  const [loading, setLoading] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [createdProvider, setCreatedProvider] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.pincode.trim()) {
      toast.error('Please enter your service pincode');
      return;
    }

    setLoading(true);
    try {
      const res = await registerServiceProviderAction({
        name: formData.name,
        category: formData.category,
        hourlyRate: formData.hourlyRate,
        pincode: formData.pincode,
        phone: formData.phone,
        email: formData.email,
        experience: formData.experience,
        speciality: formData.speciality,
      });

      if (res.success) {
        setCreatedProvider(res.provider);
        setSubmittedSuccess(true);
        toast.success('Registration request submitted for Super Admin review!');
      } else {
        toast.error(res.error || 'Failed to submit registration');
      }
    } catch {
      toast.error('Error submitting application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-text-primary py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-primary font-mono transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary px-2 py-0.5 rounded bg-surface border border-border-hairline">
            3-Step Moderation Flow
          </span>
        </div>

        {/* Conditional View: Form vs Success State */}
        {!submittedSuccess ? (
          <div className="bg-surface border border-border-hairline rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
            {/* Header */}
            <div className="pb-5 border-b border-border-hairline">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold mb-3">
                <Wrench className="w-3.5 h-3.5" />
                <span>Specialist Onboarding</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                Join NearNest as a Service Pro
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
                Offer your verified home services directly to gated communities and housing societies. All new profiles undergo admin review for resident safety.
              </p>
            </div>

            {/* Onboarding Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    Full Name / Agency Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-border-hairline bg-surface-subtle focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>

                {/* Service Category */}
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    Service Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-border-hairline bg-surface-subtle focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hourly Rate */}
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    Hourly / Visiting Rate *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹299/hr or ₹350/visit"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-border-hairline bg-surface-subtle focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>

                {/* Location / Pincode */}
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    Service Pincode / Area *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. 411047"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-border-hairline bg-surface-subtle focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-text-tertiary mt-1 block">
                    Used for location proximity matching with nearby residents.
                  </span>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    Mobile Phone (For Society Work Orders)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-border-hairline bg-surface-subtle focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    Years of Field Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5+ years"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-border-hairline bg-surface-subtle focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Speciality description */}
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  Speciality & Tools Carried (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Certified in 3-phase wiring, MCB replacements, and inverter servicing."
                  value={formData.speciality}
                  onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-border-hairline bg-surface-subtle focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Moderation Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 flex items-start gap-2.5 text-xs">
                <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Admin Moderation Policy:</strong> Your submission will receive a <code>PENDING</code> status. It will only be visible in the Resident Directory once reviewed and approved by the Super Admin.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Service Pro Application</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="bg-surface border border-border-hairline rounded-3xl p-8 sm:p-10 shadow-card text-center space-y-5 animate-scale-in">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <Clock className="w-9 h-9 animate-pulse" />
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30">
                Status: PENDING ADMIN REVIEW
              </span>
              <h2 className="text-2xl font-extrabold text-text-primary mt-3">
                Your profile is under review by the NearNest Admin.
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto mt-2 leading-relaxed">
                Thank you for applying, <strong>{createdProvider?.name}</strong>! To maintain top-tier trust and security for residential societies, our Super Admin (Urvesh Rane) verifies all registrations.
              </p>
            </div>

            {/* Application Summary Box */}
            <div className="bg-surface-subtle p-4 rounded-2xl border border-border-hairline max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Category:</span>
                <span className="font-bold text-text-primary">{createdProvider?.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Rate:</span>
                <span className="font-bold text-text-primary font-mono">{createdProvider?.hourlyRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Target Pincode:</span>
                <span className="font-bold text-text-primary font-mono">{createdProvider?.pincode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Visibility:</span>
                <span className="font-bold text-amber-600">Hidden from Residents until Approved</span>
              </div>
            </div>

            {/* Next Steps Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                href="/dashboard/admin/approvals"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-md"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Review in Admin Approvals Console</span>
              </Link>

              <button
                onClick={() => {
                  setSubmittedSuccess(false);
                  setFormData({
                    name: '',
                    category: 'Electrician',
                    hourlyRate: '₹299/hr',
                    pincode: '411047',
                    location: 'Ajeenkya Residency & Society Vicinity',
                    phone: '+91 ',
                    email: '',
                    experience: '4 years',
                    speciality: '',
                  });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface-subtle hover:bg-surface border border-border-hairline text-text-primary font-semibold text-xs transition-all"
              >
                <span>Submit Another Request</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
