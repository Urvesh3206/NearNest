"use client";

export interface ServiceProviderRecord {
  id: string;
  name: string;
  category: string;
  hourlyRate: string;
  rate?: string;
  pincode: string;
  location: string;
  lat?: number;
  lng?: number;
  distance?: string;
  distanceKm?: number;
  experience?: string;
  phone?: string;
  email?: string;
  speciality?: string;
  avatar?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  verified: boolean;
  rating: number;
  reviews: number;
  availableToday: boolean;
  submittedBy?: string;
  createdAt: string;
}

const DEFAULT_SEEDS: ServiceProviderRecord[] = [
  {
    id: "srv_user_1",
    name: "Urvesh Rane",
    category: "Tech & Smart Home Support",
    hourlyRate: "₹500/hr",
    rate: "₹500/hr",
    location: "Ajeenkya Residency",
    pincode: "411047",
    lat: 18.606,
    lng: 73.875,
    distance: "0.1 km",
    distanceKm: 0.1,
    verified: true,
    rating: 5.0,
    reviews: 24,
    experience: "5 years",
    availableToday: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    speciality: "Smart home automation, Wi-Fi mesh setup, CCTV security & computer hardware diagnostics",
    phone: "+91 9373571631",
    email: "urveshrane3206@gmail.com",
    status: "APPROVED",
    submittedBy: "Urvesh Rane (Admin)",
    createdAt: "2026-10-15T00:00:00.000Z",
  },
  {
    id: "srv_pending_demo",
    name: "Aarav Sharma",
    category: "Electrician",
    hourlyRate: "₹280/hr",
    rate: "₹280/hr",
    location: "Greenfield Park, Tower B",
    pincode: "411047",
    lat: 18.610,
    lng: 73.879,
    distance: "0.4 km",
    distanceKm: 0.4,
    verified: false,
    rating: 5.0,
    reviews: 0,
    experience: "3 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav%20Sharma&backgroundColor=c0aede",
    speciality: "Certified residential electrical wiring, switchboard upgrades & inverter battery installation",
    phone: "+91 98220 11223",
    email: "aarav.sharma.electrician@gmail.com",
    status: "PENDING",
    submittedBy: "Aarav Sharma",
    createdAt: "2026-10-15T05:30:00.000Z",
  },
  {
    id: "srv_umesh_ac",
    name: "Umesh",
    category: "AC Repair",
    hourlyRate: "₹350/hr",
    rate: "₹350/hr",
    location: "Ajeenkya Residency & Society",
    pincode: "411047",
    lat: 18.608,
    lng: 73.877,
    distance: "0.3 km",
    distanceKm: 0.3,
    verified: true,
    rating: 5.0,
    reviews: 18,
    experience: "4 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Umesh&backgroundColor=b6e3f4",
    speciality: "AC master cleaning, gas charging, cooling coil repair & installation",
    phone: "+91 98234 56789",
    email: "umesh.acrepair@gmail.com",
    status: "APPROVED",
    submittedBy: "Umesh",
    createdAt: "2026-10-15T00:00:00.000Z",
  },
  {
    id: "srv_rajesh_elec",
    name: "Rajesh Kumar",
    category: "Electrician",
    hourlyRate: "₹299/hr",
    rate: "₹299/hr",
    location: "Sector 14 Service Hub",
    pincode: "411047",
    lat: 18.605,
    lng: 73.872,
    distance: "0.5 km",
    distanceKm: 0.5,
    verified: true,
    rating: 4.9,
    reviews: 142,
    experience: "8+ years",
    availableToday: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    speciality: "Licensed Master Electrician. Emergency wiring, MCB replacements & inverter installations.",
    phone: "+91 98989 12121",
    email: "rajesh.electrician@nearnest.com",
    status: "APPROVED",
    submittedBy: "Rajesh Electrician",
    createdAt: "2026-10-15T00:00:00.000Z",
  },
];

const STORAGE_KEY = 'nearnest_services_registry';

function getStoredProviders(): ServiceProviderRecord[] {
  if (typeof window === 'undefined') return DEFAULT_SEEDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEEDS));
      return DEFAULT_SEEDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_SEEDS;
  } catch {
    return DEFAULT_SEEDS;
  }
}

function saveStoredProviders(list: ServiceProviderRecord[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }
}

// Haversine formula to compute distance in km
function calculateHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// 1. Service Provider Registration (Submits as PENDING)
export async function registerServiceProviderAction(payload: {
  name: string;
  category: string;
  hourlyRate: string;
  pincode: string;
  phone?: string;
  email?: string;
  experience?: string;
  speciality?: string;
  lat?: number;
  lng?: number;
}): Promise<{ success: boolean; provider?: ServiceProviderRecord; error?: string }> {
  const current = getStoredProviders();
  const defaultLat = payload.lat || 18.606 + (Math.random() - 0.5) * 0.04;
  const defaultLng = payload.lng || 73.875 + (Math.random() - 0.5) * 0.04;

  const newProvider: ServiceProviderRecord = {
    id: `srv_${Date.now()}`,
    name: payload.name.trim(),
    category: payload.category.trim(),
    hourlyRate: payload.hourlyRate.trim().startsWith('₹')
      ? payload.hourlyRate.trim()
      : `₹${payload.hourlyRate.trim()}/hr`,
    rate: payload.hourlyRate.trim().startsWith('₹')
      ? payload.hourlyRate.trim()
      : `₹${payload.hourlyRate.trim()}/hr`,
    pincode: payload.pincode.trim(),
    location: `Zone ${payload.pincode.trim()}, Society Vicinity`,
    lat: defaultLat,
    lng: defaultLng,
    experience: payload.experience?.trim() || '3+ years',
    phone: payload.phone?.trim() || '+91 98220 00000',
    email:
      payload.email?.trim() ||
      `${payload.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
    speciality:
      payload.speciality?.trim() ||
      `Verified ${payload.category} professional servicing local residential societies.`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      payload.name
    )}&backgroundColor=b6e3f4`,
    status: 'PENDING',
    verified: false,
    rating: 5.0,
    reviews: 0,
    availableToday: true,
    submittedBy: payload.name,
    createdAt: new Date().toISOString(),
  };

  const updated = [newProvider, ...current];
  saveStoredProviders(updated);
  return { success: true, provider: newProvider };
}

// 2. Super Admin Approval Action
export async function approveServiceProviderAction(id: string) {
  const current = getStoredProviders();
  let updated = false;

  const modified = current.map((p) => {
    if (p.id === id) {
      updated = true;
      return {
        ...p,
        status: 'APPROVED' as const,
        verified: true,
      };
    }
    return p;
  });

  if (updated) {
    saveStoredProviders(modified);
    return { success: true, message: 'Provider APPROVED successfully' };
  }
  return { success: false, error: 'Provider not found' };
}

// 3. Super Admin Rejection Action
export async function rejectServiceProviderAction(id: string) {
  const current = getStoredProviders();
  let updated = false;

  const modified = current.map((p) => {
    if (p.id === id) {
      updated = true;
      return {
        ...p,
        status: 'REJECTED' as const,
        verified: false,
      };
    }
    return p;
  });

  if (updated) {
    saveStoredProviders(modified);
    return { success: true, message: 'Provider REJECTED' };
  }
  return { success: false, error: 'Provider not found' };
}

// 4. Fetch Pending Providers for Admin Dashboard
export async function getPendingProvidersAction() {
  const current = getStoredProviders();
  return current.filter((s) => s.status === 'PENDING');
}

// 5. Fetch Approved Providers Filtered by Resident Proximity (e.g. 5 km or pincode match)
export async function getApprovedNearbyProvidersAction(residentLoc: {
  pincode?: string;
  lat?: number;
  lng?: number;
  maxRadiusKm?: number;
}) {
  const current = getStoredProviders();
  const approved = current.filter((s) => s.status === 'APPROVED');

  const residentPincode = residentLoc.pincode || '411047';
  const residentLat = residentLoc.lat || 18.606;
  const residentLng = residentLoc.lng || 73.875;
  const maxRadiusKm = residentLoc.maxRadiusKm || 5;

  return approved
    .map((provider) => {
      let distanceKm = 1.2;
      if (provider.lat && provider.lng) {
        distanceKm = calculateHaversineKm(
          residentLat,
          residentLng,
          provider.lat,
          provider.lng
        );
      } else if (provider.pincode && provider.pincode === residentPincode) {
        distanceKm = 0.8;
      } else {
        distanceKm = 2.4;
      }

      return {
        ...provider,
        distanceKm,
        distance: `${distanceKm} km`,
      };
    })
    .filter((provider) => {
      const isWithinRadius = provider.distanceKm <= maxRadiusKm;
      const isSamePincode = provider.pincode && provider.pincode === residentPincode;
      return isWithinRadius || isSamePincode;
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
