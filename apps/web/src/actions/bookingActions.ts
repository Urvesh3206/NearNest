"use client";

export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'DECLINED';

export interface ServiceBookingRecord {
  id: string;
  residentId: string;
  residentName: string;
  residentFlat: string;
  residentPhone?: string;
  providerId: string;
  providerName: string;
  providerCategory?: string;
  taskDescription: string;
  status: BookingStatus;
  createdAt: string;
}

export const INITIAL_BOOKINGS: ServiceBookingRecord[] = [
  {
    id: "book_sample_1",
    residentId: "res_aarav",
    residentName: "Aarav Patel",
    residentFlat: "Tower B - Flat 402, Greenfield Park",
    residentPhone: "+91 98220 11445",
    providerId: "1",
    providerName: "Rajesh Kumar",
    providerCategory: "Electrician",
    taskDescription: "Check the master bedroom wiring & sparking near switchboard. Need urgent MCB inspection.",
    status: "PENDING",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "book_sample_2",
    residentId: "res_priya",
    residentName: "Priya Sharma",
    residentFlat: "Wing A - Flat 104, Greenfield Park",
    residentPhone: "+91 97654 32100",
    providerId: "1",
    providerName: "Rajesh Kumar",
    providerCategory: "Electrician",
    taskDescription: "Install new smart inverter circuit and ceiling fan wiring in dining area.",
    status: "ACCEPTED",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

const STORAGE_KEY = 'nearnest_service_bookings';

export function getStoredBookings(): ServiceBookingRecord[] {
  if (typeof window === 'undefined') return INITIAL_BOOKINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BOOKINGS;
  } catch {
    return INITIAL_BOOKINGS;
  }
}

export function saveStoredBookings(list: ServiceBookingRecord[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Storage error saving bookings:', e);
    }
  }
}

/**
 * Server Action to create a new direct in-app ServiceBooking record
 * and broadcast real-time notification to the Service Provider via Socket.io.
 */
export async function createServiceBookingAction(payload: {
  providerId: string;
  providerName: string;
  providerCategory?: string;
  taskDescription: string;
  residentId?: string;
  residentName?: string;
  residentFlat?: string;
  residentPhone?: string;
}): Promise<{ success: boolean; booking?: ServiceBookingRecord; error?: string; message: string }> {
  try {
    if (!payload.taskDescription || !payload.taskDescription.trim()) {
      return {
        success: false,
        error: 'Please describe the task you need help with.',
        message: 'Task description is required',
      };
    }

    const newBooking: ServiceBookingRecord = {
      id: `book_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      residentId: payload.residentId || 'res_current',
      residentName: payload.residentName || 'Resident Member',
      residentFlat: payload.residentFlat || 'Tower B - Flat 402, Greenfield Park',
      residentPhone: payload.residentPhone || '+91 98765 43210',
      providerId: payload.providerId,
      providerName: payload.providerName,
      providerCategory: payload.providerCategory || 'Specialist',
      taskDescription: payload.taskDescription.trim(),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    // 1. Persist to API / Database
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking),
      });
    } catch (e) {
      // In static export or offline mode, continue to local store
    }

    // 2. Persist in local storage
    const current = getStoredBookings();
    const updated = [newBooking, ...current];
    saveStoredBookings(updated);

    // 3. Trigger Real-Time Notification Logic
    if (typeof window !== 'undefined') {
      // A) Dispatch window event for cross-component in-app synchronization
      window.dispatchEvent(
        new CustomEvent('nearnest:new-booking-request', {
          detail: { providerId: payload.providerId, booking: newBooking },
        })
      );

      // B) Trigger Socket.io client emit if connected
      const globalSocket = (window as any).__nearnest_socket;
      if (globalSocket && globalSocket.connected) {
        globalSocket.emit('new-booking-request', {
          providerId: payload.providerId,
          bookingDetails: newBooking,
        });
      }
    }

    return {
      success: true,
      booking: newBooking,
      message: 'Request sent to the provider',
    };
  } catch (err: any) {
    console.error('Error creating service booking:', err);
    return {
      success: false,
      error: err?.message || 'Failed to submit booking',
      message: 'Could not send request. Please try again.',
    };
  }
}

/**
 * Server Action to update booking status (Accept / Decline / Complete)
 */
export async function updateBookingStatusAction(
  bookingId: string,
  newStatus: BookingStatus
): Promise<{ success: boolean; message: string; booking?: ServiceBookingRecord }> {
  try {
    const current = getStoredBookings();
    let updatedRecord: ServiceBookingRecord | undefined;

    const modified = current.map((b) => {
      if (b.id === bookingId) {
        updatedRecord = { ...b, status: newStatus };
        return updatedRecord;
      }
      return b;
    });

    saveStoredBookings(modified);

    // Sync to API route
    try {
      await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });
    } catch (e) {}

    // Broadcast status change
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('nearnest:booking-status-updated', {
          detail: { bookingId, status: newStatus, booking: updatedRecord },
        })
      );

      const globalSocket = (window as any).__nearnest_socket;
      if (globalSocket && globalSocket.connected) {
        globalSocket.emit('booking-status-updated', {
          bookingId,
          status: newStatus,
        });
      }
    }

    return {
      success: true,
      message: `Booking has been ${newStatus.toLowerCase()}!`,
      booking: updatedRecord,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to update status',
    };
  }
}
