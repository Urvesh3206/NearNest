import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

function getDbData() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = { businesses: [], services: [], bookings: [], serviceBookings: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed.serviceBookings)) {
      parsed.serviceBookings = [];
    }
    return parsed;
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { businesses: [], services: [], bookings: [], serviceBookings: [] };
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

export async function GET(req: Request) {
  try {
    const data = getDbData();
    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get('providerId');
    const residentId = searchParams.get('residentId');

    let bookings = data.serviceBookings || [];
    if (providerId) {
      bookings = bookings.filter((b: any) => b.providerId === providerId);
    }
    if (residentId) {
      bookings = bookings.filter((b: any) => b.residentId === residentId);
    }

    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    console.error('GET /api/bookings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve bookings' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      residentId,
      residentName,
      residentFlat,
      residentPhone,
      providerId,
      providerName,
      providerCategory,
      taskDescription,
      status,
      createdAt,
    } = body;

    if (!taskDescription || !taskDescription.trim()) {
      return NextResponse.json(
        { success: false, error: 'Task description is required' },
        { status: 400 }
      );
    }

    const data = getDbData();

    const newBooking = {
      id: id || `book_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      residentId: residentId || 'res_current',
      residentName: residentName || 'Resident Member',
      residentFlat: residentFlat || 'Tower B - Flat 402, Greenfield Park',
      residentPhone: residentPhone || '+91 98765 43210',
      providerId: providerId || '1',
      providerName: providerName || 'Service Provider',
      providerCategory: providerCategory || 'Specialist',
      taskDescription: taskDescription.trim(),
      status: status || 'PENDING',
      createdAt: createdAt || new Date().toISOString(),
    };

    if (!Array.isArray(data.serviceBookings)) {
      data.serviceBookings = [];
    }

    data.serviceBookings.unshift(newBooking);
    saveDbData(data);

    return NextResponse.json({
      success: true,
      booking: newBooking,
      message: 'Request sent to the provider',
    });
  } catch (error: any) {
    console.error('POST /api/bookings error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json(
        { success: false, error: 'bookingId and status are required' },
        { status: 400 }
      );
    }

    const data = getDbData();
    let updatedBooking = null;

    if (Array.isArray(data.serviceBookings)) {
      data.serviceBookings = data.serviceBookings.map((b: any) => {
        if (b.id === bookingId) {
          updatedBooking = { ...b, status };
          return updatedBooking;
        }
        return b;
      });
      saveDbData(data);
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: `Booking status updated to ${status}`,
    });
  } catch (error: any) {
    console.error('PATCH /api/bookings error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
