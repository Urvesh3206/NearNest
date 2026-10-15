"use server";

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

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

function getDbData() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = { businesses: [], services: [], bookings: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { businesses: [], services: [], bookings: [] };
  }
}

function saveDbData(data: any) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving db.json:', error);
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
}) {
  try {
    const data = getDbData();
    if (!Array.isArray(data.services)) {
      data.services = [];
    }

    // Default Pune coordinates if not supplied
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
      email: payload.email?.trim() || `${payload.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
      speciality:
        payload.speciality?.trim() ||
        `Verified ${payload.category} professional servicing local residential societies.`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        payload.name
      )}&backgroundColor=b6e3f4`,
      status: 'PENDING', // Default to PENDING for admin review
      verified: false,
      rating: 5.0,
      reviews: 0,
      availableToday: true,
      submittedBy: payload.name,
      createdAt: new Date().toISOString(),
    };

    data.services.unshift(newProvider);
    saveDbData(data);

    revalidatePath('/dashboard/admin/approvals');
    revalidatePath('/dashboard/resident/services');
    revalidatePath('/services');

    return { success: true, provider: newProvider };
  } catch (error: any) {
    console.error('registerServiceProviderAction error:', error);
    return { success: false, error: error?.message || 'Registration failed' };
  }
}

// 2. Super Admin Approval Action
export async function approveServiceProviderAction(id: string) {
  try {
    const data = getDbData();
    let updated = false;

    data.services = (data.services || []).map((s: ServiceProviderRecord) => {
      if (s.id === id) {
        updated = true;
        return {
          ...s,
          status: 'APPROVED',
          verified: true,
        };
      }
      return s;
    });

    if (updated) {
      saveDbData(data);
      revalidatePath('/dashboard/admin/approvals');
      revalidatePath('/dashboard/resident/services');
      revalidatePath('/dashboard/admin');
      revalidatePath('/services');
      return { success: true, message: 'Provider APPROVED successfully' };
    }

    return { success: false, error: 'Provider not found' };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

// 3. Super Admin Rejection Action
export async function rejectServiceProviderAction(id: string) {
  try {
    const data = getDbData();
    let updated = false;

    data.services = (data.services || []).map((s: ServiceProviderRecord) => {
      if (s.id === id) {
        updated = true;
        return {
          ...s,
          status: 'REJECTED',
          verified: false,
        };
      }
      return s;
    });

    if (updated) {
      saveDbData(data);
      revalidatePath('/dashboard/admin/approvals');
      revalidatePath('/dashboard/resident/services');
      revalidatePath('/dashboard/admin');
      revalidatePath('/services');
      return { success: true, message: 'Provider REJECTED' };
    }

    return { success: false, error: 'Provider not found' };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

// 4. Fetch Pending Providers for Admin Dashboard
export async function getPendingProvidersAction() {
  const data = getDbData();
  const allServices: ServiceProviderRecord[] = data.services || [];
  return allServices.filter((s) => s.status === 'PENDING');
}

// 5. Fetch Approved Providers Filtered by Resident Proximity (e.g. 5 km or pincode match)
export async function getApprovedNearbyProvidersAction(residentLoc: {
  pincode?: string;
  lat?: number;
  lng?: number;
  maxRadiusKm?: number;
}) {
  const data = getDbData();
  const allServices: ServiceProviderRecord[] = data.services || [];

  // 1. Strictly filter only APPROVED providers
  const approved = allServices.filter((s) => s.status === 'APPROVED');

  const residentPincode = residentLoc.pincode || '411047';
  const residentLat = residentLoc.lat || 18.606;
  const residentLng = residentLoc.lng || 73.875;
  const maxRadiusKm = residentLoc.maxRadiusKm || 5;

  // 2. Proximity Matching (Haversine distance or Pincode match)
  const nearby = approved
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
        // Fallback approximate distance
        distanceKm = 2.4;
      }

      return {
        ...provider,
        distanceKm,
        distance: `${distanceKm} km`,
      };
    })
    .filter((provider) => {
      // Must be within max radius (e.g. 5km) or exact pincode match
      const isWithinRadius = provider.distanceKm <= maxRadiusKm;
      const isSamePincode = provider.pincode && provider.pincode === residentPincode;
      return isWithinRadius || isSamePincode;
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return nearby;
}
