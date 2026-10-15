"use client";

export interface VerificationRequest {
  id: string;
  name: string;
  category: string;
  type: 'business' | 'service';
  requestType: 'business' | 'service';
  title: string;
  subtitle: string;
  phone: string;
  email: string;
  address?: string;
  location?: string;
  rate?: string;
  hourlyRate?: string;
  experience?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  verified: boolean;
  avatar?: string;
  submittedBy?: string;
  createdAt: string;
}

export const INITIAL_VERIFICATIONS: VerificationRequest[] = [
  {
    id: "srv_pending_aarav",
    name: "Aarav Sharma",
    category: "Electrician",
    type: "service",
    requestType: "service",
    title: "Aarav Sharma",
    subtitle: "Electrician • ₹280/hr • Greenfield Park, Tower B",
    phone: "+91 98220 11223",
    email: "aarav.sharma.electrician@gmail.com",
    address: "Greenfield Park, Tower B, Pune",
    location: "Greenfield Park, Tower B",
    rate: "₹280/hr",
    hourlyRate: "₹280/hr",
    experience: "3 years",
    status: "PENDING",
    verified: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav%20Sharma&backgroundColor=c0aede",
    submittedBy: "Aarav Sharma (Resident Friend)",
    createdAt: "2026-10-15T05:30:00.000Z",
  },
  {
    id: "srv_pending_siddharth",
    name: "Siddharth Mehta",
    category: "Plumbing & Sanitation",
    type: "service",
    requestType: "service",
    title: "Siddharth Mehta",
    subtitle: "Plumbing • ₹250/hr • Ajeenkya Sector 2",
    phone: "+91 98765 22110",
    email: "siddharth.plumber@gmail.com",
    address: "Flat 102, Wing C, Ajeenkya Residency",
    location: "Ajeenkya Sector 2",
    rate: "₹250/hr",
    hourlyRate: "₹250/hr",
    experience: "5 years",
    status: "PENDING",
    verified: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siddharth%20Mehta&backgroundColor=ffd5dc",
    submittedBy: "Siddharth Mehta (New Applicant)",
    createdAt: "2026-10-15T08:15:00.000Z",
  },
  {
    id: "biz_user_1",
    name: "Urvesh Enterprises & Mart",
    category: "Grocery & Daily Essentials",
    type: "business",
    requestType: "business",
    title: "Urvesh Enterprises & Mart",
    subtitle: "Grocery & Daily Essentials • Shop 101, Ajeenkya Commercial Complex",
    phone: "+91 9373571631",
    email: "urveshrane3206@gmail.com",
    address: "Shop 101, Ajeenkya Commercial Complex, Pune",
    location: "Ajeenkya Commercial Complex",
    status: "APPROVED",
    verified: true,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Urvesh%20Mart&backgroundColor=059669",
    submittedBy: "Urvesh Rane",
    createdAt: "2026-10-15T00:00:00.000Z",
  },
  {
    id: "srv_umesh_ac",
    name: "Umesh",
    category: "AC Repair",
    type: "service",
    requestType: "service",
    title: "Umesh",
    subtitle: "AC Repair • ₹350/hr • Ajeenkya Residency",
    phone: "+91 98234 56789",
    email: "umesh.acrepair@gmail.com",
    address: "Ajeenkya Residency & Society, Pune",
    location: "Ajeenkya Residency & Society",
    rate: "₹350/hr",
    hourlyRate: "₹350/hr",
    experience: "4 years",
    status: "APPROVED",
    verified: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Umesh&backgroundColor=b6e3f4",
    submittedBy: "Umesh",
    createdAt: "2026-10-15T00:00:00.000Z",
  },
];

const STORAGE_KEY = 'nearnest_verifications_db';

export function getLocalVerifications(): VerificationRequest[] {
  if (typeof window === 'undefined') return INITIAL_VERIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VERIFICATIONS));
      return INITIAL_VERIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_VERIFICATIONS;
  } catch {
    return INITIAL_VERIFICATIONS;
  }
}

export function saveLocalVerifications(list: VerificationRequest[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }
}

export function addPendingVerification(req: Partial<VerificationRequest>): VerificationRequest {
  const current = getLocalVerifications();
  const newReq: VerificationRequest = {
    id: req.id || `req_${Date.now()}`,
    name: req.name || 'New Applicant',
    category: req.category || 'General Service',
    type: req.type || 'service',
    requestType: req.requestType || 'service',
    title: req.name || 'New Applicant',
    subtitle: `${req.category || 'Service'} • ${req.rate || '₹300/hr'} • ${req.location || 'Pune'}`,
    phone: req.phone || '+91 98000 00000',
    email: req.email || 'applicant@gmail.com',
    address: req.address || req.location || 'Pune',
    location: req.location || 'Pune',
    rate: req.rate || req.hourlyRate || '₹300/hr',
    hourlyRate: req.hourlyRate || req.rate || '₹300/hr',
    experience: req.experience || '3 years',
    status: 'PENDING',
    verified: false,
    avatar: req.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(req.name || 'New')}`,
    submittedBy: req.submittedBy || 'Friend / Resident',
    createdAt: new Date().toISOString(),
  };

  const updated = [newReq, ...current];
  saveLocalVerifications(updated);
  return newReq;
}

export function updateVerificationStatus(id: string, action: 'APPROVE' | 'REJECT'): boolean {
  const current = getLocalVerifications();
  let found = false;

  const modified = current.map((item) => {
    if (item.id === id) {
      found = true;
      const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      return {
        ...item,
        status: newStatus as 'APPROVED' | 'REJECTED',
        verified: action === 'APPROVE',
      };
    }
    return item;
  });

  if (found) {
    saveLocalVerifications(modified);
  }
  return found;
}
