import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

function getDbData() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = { businesses: [], services: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { businesses: [], services: [] };
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

export async function GET() {
  const data = getDbData();
  return NextResponse.json({ success: true, services: data.services || [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, location, rate, experience, speciality, phone, avatar } = body;

    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: 'Name and Category are required' },
        { status: 400 }
      );
    }

    const data = getDbData();
    const newService = {
      id: `srv_custom_${Date.now()}`,
      name: name.trim(),
      category: category.trim(),
      location: location?.trim() || 'Ajeenkya Residency & Society',
      distance: '0.2 km',
      verified: true,
      rating: 5.0,
      reviews: 1,
      rate: rate?.trim() || '₹350/hr',
      experience: experience?.trim() || '3 years',
      availableToday: true,
      avatar:
        avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          name
        )}&backgroundColor=b6e3f4`,
      speciality:
        speciality?.trim() || `Professional ${category} services with guaranteed neighborhood satisfaction`,
      phone: phone?.trim() || '+91 9373571631',
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(data.services)) {
      data.services = [];
    }

    data.services.unshift(newService);
    saveDbData(data);

    return NextResponse.json({ success: true, service: newService });
  } catch (error: any) {
    console.error('POST /api/services error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save service provider' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const data = getDbData();
    data.services = (data.services || []).filter((s: any) => s.id !== id);
    saveDbData(data);

    return NextResponse.json({ success: true, message: 'Service provider removed' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
