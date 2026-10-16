"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, ShieldCheck, Trash2, Navigation } from 'lucide-react';
import { HireProviderButton } from './HireProviderButton';

export interface ServiceProviderCardProps {
  provider: {
    id: string;
    name: string;
    category: string;
    location: string;
    lat?: number;
    lng?: number;
    distance?: string;
    distanceKm?: number;
    verified?: boolean;
    rating: number;
    reviews: number;
    rate?: string;
    hourlyRate?: string;
    experience?: string;
    availableToday?: boolean;
    avatar: string;
    speciality?: string;
    phone?: string;
    email?: string;
    isCustom?: boolean;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  };
  onDelete?: (id: string, name: string) => void;
  residentContext?: {
    name?: string;
    email?: string;
    phone?: string;
    society?: string;
    unit?: string;
    location?: string;
  };
}

export function ServiceProviderCard({
  provider,
  onDelete,
  residentContext,
}: ServiceProviderCardProps) {
  const displayRate = provider.rate || provider.hourlyRate || '₹300/hr';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-surface rounded-2xl p-5 border border-border-hairline shadow-card hover:shadow-card-hover transition-shadow flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={provider.avatar}
              alt={provider.name}
              className="w-12 h-12 rounded-full border border-border-hairline bg-surface-subtle object-cover"
            />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-base text-text-primary">{provider.name}</h3>
                {provider.verified && (
                  <span title="ID Verified Provider">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  </span>
                )}
                {provider.isCustom && (
                  provider.status === 'PENDING' ? (
                    <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded border border-amber-300">
                      ⏳ Pending Approval
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded">
                      ⭐ Verified Pro
                    </span>
                  )
                )}
              </div>
              <span className="text-xs text-brand-600 font-semibold">{provider.category}</span>
            </div>
          </div>
        </div>

        {provider.speciality && (
          <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">
            {provider.speciality}
          </p>
        )}

        <div className="space-y-2 py-3 border-y border-border-hairline text-xs">
          <div className="flex items-center justify-between">
            <span className="text-text-tertiary">Estimated Rate:</span>
            <span className="font-bold text-text-primary font-mono">{displayRate}</span>
          </div>
          {provider.experience && (
            <div className="flex items-center justify-between">
              <span className="text-text-tertiary">Experience:</span>
              <span className="text-text-secondary">{provider.experience}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-text-tertiary">Location:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-text-primary flex items-center gap-1">
                <MapPin className="w-3 h-3 text-brand-500 shrink-0" />
                <span className="truncate max-w-[120px]">{provider.location}</span>
              </span>
              <a
                href={
                  provider.lat && provider.lng
                    ? `https://www.google.com/maps/search/?api=1&query=${provider.lat},${provider.lng}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.location || 'Greenfield Park')}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:text-brand-700 hover:underline text-[10px] font-bold flex items-center gap-0.5"
                title="View on Google Maps"
              >
                <span>Maps ↗</span>
              </a>
            </div>
          </div>
          {provider.distance && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-tertiary">Proximity:</span>
              <span
                className={`inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 rounded-full text-[11px] ${
                  provider.distanceKm !== undefined && provider.distanceKm <= 1.0
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                    : provider.distanceKm !== undefined && provider.distanceKm <= 3.0
                    ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                    : "bg-surface-subtle text-text-secondary border border-border-hairline"
                }`}
              >
                <span>{provider.distance}</span>
                {provider.distanceKm !== undefined && provider.distanceKm <= 1.0 && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    • Immediate Vicinity
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 mt-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span>{provider.rating}</span>
          <span className="text-text-tertiary font-normal">({provider.reviews})</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct in-app booking modal button */}
          <HireProviderButton
            provider={{
              id: provider.id,
              name: provider.name,
              email: provider.email,
              category: provider.category,
              rate: displayRate,
              phone: provider.phone,
              location: provider.location,
              avatar: provider.avatar,
            }}
            residentContext={residentContext}
          />

          {provider.isCustom && onDelete && (
            <button
              onClick={() => onDelete(provider.id, provider.name)}
              className="p-2 bg-coral-50 hover:bg-coral-100 text-coral-600 rounded-xl transition-colors border border-coral-200"
              title="Remove from Database"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ServiceProviderCard;
