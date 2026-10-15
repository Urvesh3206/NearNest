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
    let list: VerificationRequest[] = [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      list = [...INITIAL_VERIFICATIONS];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } else {
      const parsed = JSON.parse(raw);
      list = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_VERIFICATIONS];
    }

    // Synchronize custom services submitted via /services (key: nearnest_custom_services)
    try {
      const customSrvRaw = localStorage.getItem('nearnest_custom_services');
      if (customSrvRaw) {
        const customSrvs = JSON.parse(customSrvRaw);
        if (Array.isArray(customSrvs)) {
          for (const srv of customSrvs) {
            const existingIdx = list.findIndex(r => r.id === srv.id || r.name.toLowerCase() === srv.name?.toLowerCase());
            if (existingIdx === -1) {
              list.unshift({
                id: srv.id || `srv_${Date.now()}`,
                name: srv.name,
                category: srv.category || 'Specialist Service',
                type: 'service',
                requestType: 'service',
                title: srv.name,
                subtitle: `${srv.category || 'Service'} • ${srv.rate || '₹350/hr'} • ${srv.location || 'Greenfield Park'}`,
                phone: srv.phone || '+91 98765 43210',
                email: srv.email || 'provider@gmail.com',
                address: srv.location || 'Society Vicinity',
                location: srv.location || 'Society Vicinity',
                rate: srv.rate || '₹350/hr',
                hourlyRate: srv.rate || '₹350/hr',
                experience: srv.experience || '3 years',
                status: srv.status || 'PENDING',
                verified: Boolean(srv.verified),
                avatar: srv.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(srv.name)}`,
                submittedBy: srv.submittedBy || `${srv.name} (Service Form Registration)`,
                createdAt: srv.createdAt || new Date().toISOString(),
              });
            } else {
              // If list is PENDING but custom service has been updated, sync it
              if (list[existingIdx].status === 'PENDING' && srv.status && srv.status !== 'PENDING') {
                list[existingIdx].status = srv.status;
                list[existingIdx].verified = srv.status === 'APPROVED';
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error syncing nearnest_custom_services into verifications:', e);
    }

    // Synchronize from nearnest_services_registry (key: nearnest_services_registry)
    try {
      const regRaw = localStorage.getItem('nearnest_services_registry');
      if (regRaw) {
        const regList = JSON.parse(regRaw);
        if (Array.isArray(regList)) {
          for (const srv of regList) {
            const existingIdx = list.findIndex(r => r.id === srv.id || r.name.toLowerCase() === srv.name?.toLowerCase());
            if (existingIdx === -1) {
              list.unshift({
                id: srv.id || `srv_${Date.now()}`,
                name: srv.name,
                category: srv.category || 'Specialist Service',
                type: 'service',
                requestType: 'service',
                title: srv.name,
                subtitle: `${srv.category || 'Service'} • ${srv.hourlyRate || srv.rate || '₹350/hr'} • ${srv.location || 'Greenfield Park'}`,
                phone: srv.phone || '+91 98765 43210',
                email: srv.email || 'provider@gmail.com',
                address: srv.location || 'Society Vicinity',
                location: srv.location || 'Society Vicinity',
                rate: srv.hourlyRate || srv.rate || '₹350/hr',
                hourlyRate: srv.hourlyRate || srv.rate || '₹350/hr',
                experience: srv.experience || '3 years',
                status: srv.status || 'PENDING',
                verified: Boolean(srv.verified),
                avatar: srv.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(srv.name)}`,
                submittedBy: srv.submittedBy || `${srv.name} (Service Pro Portal)`,
                createdAt: srv.createdAt || new Date().toISOString(),
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error syncing nearnest_services_registry into verifications:', e);
    }

    return list;
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
    status: req.status || 'PENDING',
    verified: req.status === 'APPROVED' ? true : false,
    avatar: req.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(req.name || 'New')}`,
    submittedBy: req.submittedBy || 'Friend / Resident',
    createdAt: new Date().toISOString(),
  };

  // Ensure not duplicated
  const filtered = current.filter(r => r.id !== newReq.id && r.name.toLowerCase() !== newReq.name.toLowerCase());
  const updated = [newReq, ...filtered];
  saveLocalVerifications(updated);

  // Also push to nearnest_services_registry
  if (typeof window !== 'undefined') {
    try {
      const regRaw = localStorage.getItem('nearnest_services_registry');
      let regList = regRaw ? JSON.parse(regRaw) : [];
      if (!Array.isArray(regList)) regList = [];
      const existsInReg = regList.some((p: any) => p.id === newReq.id || p.name.toLowerCase() === newReq.name.toLowerCase());
      if (!existsInReg) {
        regList.unshift({
          id: newReq.id,
          name: newReq.name,
          category: newReq.category,
          hourlyRate: newReq.rate,
          rate: newReq.rate,
          location: newReq.location,
          pincode: '411047',
          lat: 18.606,
          lng: 73.875,
          distance: '0.2 km',
          distanceKm: 0.2,
          verified: newReq.verified,
          rating: 5.0,
          reviews: 0,
          experience: newReq.experience,
          availableToday: true,
          avatar: newReq.avatar,
          phone: newReq.phone,
          email: newReq.email,
          status: newReq.status,
          submittedBy: newReq.submittedBy,
          createdAt: newReq.createdAt,
        });
        localStorage.setItem('nearnest_services_registry', JSON.stringify(regList));
      }
    } catch (e) {
      console.warn('Sync error in addPendingVerification to services_registry:', e);
    }
  }

  return newReq;
}

export function updateVerificationStatus(id: string, action: 'APPROVE' | 'REJECT'): boolean {
  const current = getLocalVerifications();
  let found = false;

  const modified = current.map((item) => {
    if (item.id === id || item.name.toLowerCase() === id.toLowerCase()) {
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

  // Also sync the approval status directly into nearnest_custom_services so /services updates!
  if (typeof window !== 'undefined') {
    try {
      const customSrvRaw = localStorage.getItem('nearnest_custom_services');
      if (customSrvRaw) {
        const customSrvs = JSON.parse(customSrvRaw);
        if (Array.isArray(customSrvs)) {
          const updatedCustom = customSrvs.map((s: any) => {
            if (s.id === id || s.name.toLowerCase() === id.toLowerCase()) {
              return {
                ...s,
                status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
                verified: action === 'APPROVE',
              };
            }
            return s;
          });
          localStorage.setItem('nearnest_custom_services', JSON.stringify(updatedCustom));
        }
      }
    } catch (e) {
      console.warn('Sync error in custom services:', e);
    }

    // Also sync into nearnest_services_registry
    try {
      const regRaw = localStorage.getItem('nearnest_services_registry');
      if (regRaw) {
        const regList = JSON.parse(regRaw);
        if (Array.isArray(regList)) {
          const updatedReg = regList.map((p: any) => {
            if (p.id === id || p.name.toLowerCase() === id.toLowerCase()) {
              return {
                ...p,
                status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
                verified: action === 'APPROVE',
              };
            }
            return p;
          });
          localStorage.setItem('nearnest_services_registry', JSON.stringify(updatedReg));
        }
      }
    } catch (e) {
      console.warn('Sync error in services registry:', e);
    }
  }

  return found;
}
