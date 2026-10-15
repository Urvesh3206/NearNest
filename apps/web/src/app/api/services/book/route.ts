import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

function getDbData() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = { businesses: [], services: [], bookings: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed.bookings)) {
      parsed.bookings = [];
    }
    return parsed;
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

export async function GET(req: Request) {
  try {
    const data = getDbData();
    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get('providerId');

    let bookings = data.bookings || [];
    if (providerId) {
      bookings = bookings.filter((b: any) => b.providerId === providerId);
    }

    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    console.error('GET /api/services/book error:', error);
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
      providerId,
      providerName,
      providerCategory,
      providerEmail,
      providerPhone,
      residentName,
      residentEmail,
      residentPhone,
      societyName,
      unitAddress,
      serviceRequired,
      date,
      time,
      rate,
    } = body;

    if (!providerName || !serviceRequired || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Missing required booking fields (service details, date, time, or provider)' },
        { status: 400 }
      );
    }

    const data = getDbData();

    const newBooking = {
      id: `book_${Date.now()}`,
      providerId: providerId || 'unknown',
      providerName: providerName.trim(),
      providerCategory: providerCategory || 'Home Services',
      providerEmail: providerEmail?.trim() || `${providerName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
      providerPhone: providerPhone?.trim() || '+91 9373571631',
      residentName: residentName?.trim() || 'Resident Member',
      residentEmail: residentEmail?.trim() || 'resident@nearnest.com',
      residentPhone: residentPhone?.trim() || '+91 98765 43210',
      societyName: societyName?.trim() || 'Greenfield Residency',
      unitAddress: unitAddress?.trim() || 'Flat 402, Tower B',
      serviceRequired: serviceRequired.trim(),
      date,
      time,
      rate: rate || 'Standard Visit Rate',
      status: 'CONFIRMED',
      notificationSent: true,
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(data.bookings)) {
      data.bookings = [];
    }

    data.bookings.unshift(newBooking);
    saveDbData(data);

    return NextResponse.json({
      success: true,
      booking: newBooking,
      message: `Work order logged successfully for ${newBooking.providerName}`,
    });
  } catch (error: any) {
    console.error('POST /api/services/book error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}
