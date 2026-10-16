"use client";

import React, { useState } from 'react';
import { Check, CalendarPlus } from 'lucide-react';
import { HireBookingModal } from './HireBookingModal';

export interface HireProviderButtonProps {
  provider: {
    id: string;
    name: string;
    email?: string;
    category?: string;
    rate?: string;
    hourlyRate?: string;
    phone?: string;
    location?: string;
    avatar?: string;
  };
  residentContext?: {
    name?: string;
    email?: string;
    phone?: string;
    society?: string;
    unit?: string;
    location?: string;
  };
  className?: string;
  buttonText?: string;
  showIcon?: boolean;
}

export function HireProviderButton({
  provider,
  residentContext,
  className = '',
  buttonText = 'Hire Provider',
  showIcon = true,
}: HireProviderButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRequested) return;
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsRequested(true);
  };

  if (isRequested) {
    return (
      <button
        disabled
        className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-not-allowed transition-all ${className}`}
      >
        <Check className="w-3.5 h-3.5 text-emerald-500" />
        <span>Requested</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpenModal}
        className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-75 disabled:cursor-not-allowed shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer ${className}`}
      >
        {showIcon && <CalendarPlus className="w-3.5 h-3.5 opacity-90" />}
        <span>{buttonText}</span>
      </button>

      {/* Direct In-App Booking Modal */}
      <HireBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        provider={provider}
        residentContext={residentContext}
        onSuccess={handleSuccess}
      />
    </>
  );
}

export default HireProviderButton;
