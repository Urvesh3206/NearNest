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
  return NextResponse.json({ success: true, businesses: data.businesses || [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, address, phone, tagline, priceRange, coverPhoto, lat, lng } = body;

    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: 'Name and Category are required' },
        { status: 400 }
      );
    }

    const data = getDbData();
    const newBusiness = {
      id: `biz_custom_${Date.now()}`,
      name: name.trim(),
      category: category.trim(),
      lat: typeof lat === 'number' ? lat : 18.606,
      lng: typeof lng === 'number' ? lng : 73.875,
      distanceKm: 0.3,
      distance: '0.3 km',
      address: address?.trim() || 'Neighborhood Commercial Area',
      rating: 5.0,
      reviews: 1,
      phone: phone?.trim() || '+91 9373571631',
      openNow: true,
      coverPhoto:
        coverPhoto ||
        'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800&auto=format&fit=crop',
      logo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        name
      )}&backgroundColor=059669`,
      tagline: tagline?.trim() || `Verified ${category} offering top-tier neighborhood services`,
      owner: body.owner || 'Urvesh Rane',
      isCustom: true,
      priceRange: priceRange || '₹₹',
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(data.businesses)) {
      data.businesses = [];
    }

    data.businesses.unshift(newBusiness);
    saveDbData(data);

    return NextResponse.json({ success: true, business: newBusiness });
  } catch (error: any) {
    console.error('POST /api/businesses error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save business' },
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
    data.businesses = (data.businesses || []).filter((b: any) => b.id !== id);
    saveDbData(data);

    return NextResponse.json({ success: true, message: 'Business removed' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
