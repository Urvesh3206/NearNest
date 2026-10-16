"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wrench, 
  MapPin, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft, 
  Search, 
  Filter, 
  Phone, 
  Clock, 
  Sparkles,
  Sliders,
  DollarSign
} from 'lucide-react';
import { 
  getApprovedNearbyProvidersAction, 
  ServiceProviderRecord 
} from '@/app/actions/serviceProviderActions';
import { useAuth } from '@/providers/AuthProvider';
import { HireProviderButton } from '@/components/services/HireProviderButton';
import toast from 'react-hot-toast';

export default function ResidentServicesDirectoryPage() {
  const { user } = useAuth();
  const [providers, setProviders] = useState<ServiceProviderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRadius, setSelectedRadius] = useState<number>(5); // 5km default
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Resident location defaults from profile
  const residentPincode = user?.zip || '411047';
  const residentAddress = user?.society || 'Ajeenkya Residency, Pune';

  const fetchNearbyApproved = async (radius: number) => {
    setLoading(true);
    try {
      const results = await getApprovedNearbyProvidersAction({
        pincode: residentPincode,
        lat: 18.606,
        lng: 73.875,
        maxRadiusKm: radius,
      });
      setProviders(results);
    } catch {
      toast.error('Failed to load nearby services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyApproved(selectedRadius);
  }, [selectedRadius]);

  const categories = ['ALL', 'Electrician', 'AC Repair', 'Plumber', 'Carpenter', 'Cleaning'];

  const filteredProviders = providers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.speciality && p.speciality.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/resident"
              className="text-xs text-text-tertiary hover:text-text-primary flex items-center gap-1 font-mono transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Resident Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-1 flex items-center gap-2.5">
            <MapPin className="w-7 h-7 text-emerald-500" />
            <span>Nearby Verified Services Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Strictly moderated directory showing only <strong>Super Admin Approved</strong> specialists within your society's geographic vicinity.
          </p>
        </div>

        {/* Resident Location Pin Badge */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-2xl flex items-center gap-2 shrink-0">
          <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
          <div className="text-left text-xs">
            <span className="font-bold text-text-primary block truncate max-w-[180px]">
              {residentAddress}
            </span>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
              Pincode: {residentPincode}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Radius Controls Bar */}
      <div className="bg-surface border border-border-hairline rounded-2xl p-4 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search verified electricians, AC repair, plumbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-border-hairline bg-surface-subtle focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Proximity Radius Selector */}
        <div className="flex items-center gap-2 bg-surface-subtle p-1 rounded-xl border border-border-hairline shrink-0">
          <span className="text-[10px] uppercase font-mono text-text-tertiary pl-2 font-bold">
            Radius:
          </span>
          {[1, 3, 5, 10].map((km) => (
            <button
              key={km}
              onClick={() => setSelectedRadius(km)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedRadius === km
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {km} km
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-white font-bold shadow-sm'
                : 'bg-surface border border-border-hairline text-text-secondary hover:bg-surface-subtle'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="p-16 text-center bg-surface border border-border-hairline rounded-3xl">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-text-tertiary font-mono">
            Calculating proximity matching for approved providers within {selectedRadius} km...
          </p>
        </div>
      ) : filteredProviders.length === 0 ? (
        <div className="p-12 text-center bg-surface border border-border-hairline rounded-3xl shadow-card space-y-3">
          <Wrench className="w-10 h-10 text-text-tertiary mx-auto opacity-40" />
          <h3 className="text-base font-bold text-text-primary">No Approved Providers Within {selectedRadius} km</h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            Try expanding your search radius to 10 km, or check back soon as pending service providers are vetted and approved by the Super Admin.
          </p>
          <button
            onClick={() => setSelectedRadius(10)}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            Expand to 10 km
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-surface border border-border-hairline rounded-3xl p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Row: Avatar + Verification + Distance */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        provider.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                          provider.name
                        )}`
                      }
                      alt={provider.name}
                      className="w-12 h-12 rounded-2xl bg-surface-subtle border border-border-hairline object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-text-primary text-sm group-hover:text-emerald-600 transition-colors">
                          {provider.name}
                        </h4>
                        <span title="Admin Verified">
                          <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-text-tertiary block">
                        {provider.category}
                      </span>
                    </div>
                  </div>

                  {/* Distance Pill */}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-bold shrink-0">
                    <MapPin className="w-3 h-3" />
                    <span>{provider.distance || '0.4 km'}</span>
                  </div>
                </div>

                {/* Rating & Availability */}
                <div className="mt-4 flex items-center justify-between text-xs pb-3 border-b border-border-hairline">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{provider.rating ? provider.rating.toFixed(1) : '5.0'}</span>
                    <span className="text-text-tertiary font-normal">
                      ({provider.reviews || 12} reviews)
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-bold">
                    ● Available Today
                  </span>
                </div>

                {/* Speciality Description */}
                <p className="mt-3 text-xs text-text-secondary leading-relaxed line-clamp-2">
                  {provider.speciality ||
                    `Certified ${provider.category} specialist offering priority repair for society residents.`}
                </p>
              </div>

              {/* Bottom Actions & Rate */}
              <div className="mt-5 pt-3 border-t border-border-hairline flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-text-tertiary block font-mono">Standard Rate</span>
                  <span className="text-sm font-extrabold text-text-primary font-mono">
                    {provider.hourlyRate || provider.rate || '₹300/hr'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <HireProviderButton
                    provider={{
                      id: provider.id,
                      name: provider.name,
                      email: provider.email,
                      category: provider.category,
                      rate: provider.hourlyRate || provider.rate,
                      phone: provider.phone,
                      location: provider.location,
                    }}
                    residentContext={{
                      location: residentAddress,
                      society: residentAddress,
                    }}
                    buttonText="Hire Pro"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
