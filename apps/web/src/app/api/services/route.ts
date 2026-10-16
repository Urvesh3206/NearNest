import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const includeAll = searchParams.get('all') === 'true';

  // 1. Try Supabase cloud database first (syncs across all devices worldwide)
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('services').select('*').order('createdat', { ascending: false });
      if (!includeAll) {
        query = query.eq('status', 'APPROVED');
      }
      const { data: supaServices, error } = await query;
      if (!error && Array.isArray(supaServices) && supaServices.length > 0) {
        const normalized = supaServices.map((s: any) => ({
          ...s,
          availableToday: s.availableToday ?? s.availabletoday ?? true,
          isCustom: s.isCustom ?? s.iscustom ?? true,
          submittedBy: s.submittedBy ?? s.submittedby ?? 'Community Member',
          createdAt: s.createdAt ?? s.createdat ?? new Date().toISOString(),
        }));
        return NextResponse.json({ success: true, services: normalized, source: 'supabase' });
      }
    } catch (supaErr) {
      console.warn('Supabase fetch failed, falling back to local file:', supaErr);
    }
  }

  // 2. Fallback to local db.json
  const data = getDbData();
  let services = data.services || [];
  if (!includeAll) {
    services = services.filter((s: any) => s.status === 'APPROVED');
  }
  return NextResponse.json({ success: true, services, source: 'local' });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, location, rate, experience, speciality, phone, email, avatar, isAdmin, submittedBy } = body;

    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: 'Name and Category are required' },
        { status: 400 }
      );
    }

    const data = getDbData();
    const initialStatus = 'APPROVED';
    const isVerified = true;

    const newService = {
      id: `srv_custom_${Date.now()}`,
      name: name.trim(),
      category: category.trim(),
      location: location?.trim() || 'Ajeenkya Residency & Society',
      distance: '0.2 km',
      verified: isVerified,
      status: initialStatus,
      rating: 5.0,
      reviews: 0,
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
      email: email?.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
      isCustom: true,
      submittedBy: submittedBy || name || 'Community Member',
      createdAt: new Date().toISOString(),
    };

    // 1. Sync to Supabase cloud database if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const dbRecord = {
          ...newService,
          availabletoday: newService.availableToday,
          iscustom: newService.isCustom,
          submittedby: newService.submittedBy,
          createdat: newService.createdAt,
        };
        const { error: insertError } = await supabase.from('services').insert([dbRecord]);
        if (insertError) {
          console.warn('Supabase insert warning:', insertError.message);
        } else {
          console.log('[Supabase Cloud Sync]: Service provider stored successfully in Supabase!');
        }
      } catch (supaInsertErr) {
        console.warn('Supabase save error:', supaInsertErr);
      }
    }

    // 2. Also save to local db.json
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

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('services').delete().eq('id', id);
      } catch (supaDelErr) {
        console.warn('Supabase delete error:', supaDelErr);
      }
    }

    const data = getDbData();
    data.services = (data.services || []).filter((s: any) => s.id !== id);
    saveDbData(data);

    return NextResponse.json({ success: true, message: 'Service provider removed' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
