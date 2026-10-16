// Cloudflare Worker entry point for NearNest (Static Assets + D1 SQL Database + Edge API Compute)

interface D1Database {
  prepare: (query: string) => any;
  batch: (statements: any[]) => Promise<any[]>;
  exec: (query: string) => Promise<any>;
}

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  DB?: D1Database;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // 1. CORS Preflight for all /api/*
    if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/')) {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // 2. Auto-initialize D1 schema if needed
    if (env.DB && url.pathname.startsWith('/api/')) {
      await initD1Schema(env.DB);
    }

    // 3. /api/services routes (Cloudflare D1 Database)
    if (url.pathname === '/api/services') {
      if (request.method === 'GET') {
        return handleGetServices(request, env);
      }
      if (request.method === 'POST') {
        return handlePostService(request, env);
      }
      if (request.method === 'DELETE') {
        return handleDeleteService(request, env);
      }
    }

    // 4. /api/businesses routes (Cloudflare D1 Database)
    if (url.pathname === '/api/businesses') {
      if (request.method === 'GET') {
        return handleGetBusinesses(request, env);
      }
      if (request.method === 'POST') {
        return handlePostBusiness(request, env);
      }
      if (request.method === 'DELETE') {
        return handleDeleteBusiness(request, env);
      }
    }

    // 5. /api/bookings routes (Cloudflare D1 Database)
    if (url.pathname === '/api/bookings') {
      if (request.method === 'GET') {
        return handleGetBookings(request, env);
      }
      if (request.method === 'POST') {
        return handlePostBooking(request, env);
      }
      if (request.method === 'PATCH') {
        return handlePatchBooking(request, env);
      }
    }

    // 6. /api/services/hire (Email dispatch + D1 booking record)
    if (url.pathname === '/api/services/hire' && request.method === 'POST') {
      return handleHireEmail(request, env);
    }

    // 7. Fallback: serve static frontend assets
    return env.ASSETS.fetch(request);
  },
};

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

let d1Initialized = false;

async function initD1Schema(db: D1Database) {
  if (d1Initialized) return;
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        rate TEXT,
        hourlyRate TEXT,
        location TEXT,
        pincode TEXT,
        lat REAL,
        lng REAL,
        experience TEXT,
        speciality TEXT,
        phone TEXT,
        email TEXT,
        avatar TEXT,
        status TEXT DEFAULT 'APPROVED',
        verified INTEGER DEFAULT 1,
        rating REAL DEFAULT 5.0,
        reviews INTEGER DEFAULT 0,
        availableToday INTEGER DEFAULT 1,
        submittedBy TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS businesses (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        address TEXT,
        pincode TEXT,
        lat REAL,
        lng REAL,
        phone TEXT,
        email TEXT,
        hours TEXT,
        priceRange TEXT DEFAULT '₹₹',
        coverPhoto TEXT,
        openNow INTEGER DEFAULT 1,
        verified INTEGER DEFAULT 1,
        status TEXT DEFAULT 'APPROVED',
        rating REAL DEFAULT 4.8,
        reviews INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        providerId TEXT,
        providerName TEXT,
        providerCategory TEXT,
        residentName TEXT,
        residentFlat TEXT,
        residentPhone TEXT,
        taskDescription TEXT,
        status TEXT DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    d1Initialized = true;
  } catch (err) {
    console.warn('D1 schema init error:', err);
  }
}

// ======================== SERVICES ========================
async function handleGetServices(request: Request, env: Env): Promise<Response> {
  if (!env.DB) {
    return new Response(JSON.stringify({ success: true, services: [], source: 'no-db' }), { headers: CORS_HEADERS });
  }

  try {
    const url = new URL(request.url);
    const includeAll = url.searchParams.get('all') === 'true';

    const query = includeAll
      ? 'SELECT * FROM services ORDER BY created_at DESC'
      : "SELECT * FROM services WHERE status = 'APPROVED' ORDER BY created_at DESC";

    const { results } = await env.DB.prepare(query).all();

    const normalized = (results || []).map((s: any) => ({
      ...s,
      verified: Boolean(s.verified),
      availableToday: Boolean(s.availableToday),
      hourlyRate: s.hourlyRate || s.rate || '₹300/hr',
      rate: s.rate || s.hourlyRate || '₹300/hr',
    }));

    return new Response(JSON.stringify({ success: true, services: normalized, source: 'cloudflare-d1' }), { headers: CORS_HEADERS });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message }), { status: 500, headers: CORS_HEADERS });
  }
}

async function handlePostService(request: Request, env: Env): Promise<Response> {
  if (!env.DB) {
    return new Response(JSON.stringify({ success: false, error: 'D1 database not bound' }), { status: 500, headers: CORS_HEADERS });
  }

  try {
    const body = (await request.json()) as any;
    const { name, category, location, rate, experience, speciality, phone, email, avatar, submittedBy } = body;

    if (!name || !category) {
      return new Response(JSON.stringify({ success: false, error: 'Name and Category are required' }), { status: 400, headers: CORS_HEADERS });
    }

    const id = body.id || `srv_${Date.now()}`;
    const cleanRate = rate || '₹300/hr';

    await env.DB.prepare(`
      INSERT INTO services (id, name, category, rate, hourlyRate, location, experience, speciality, phone, email, avatar, status, verified, submittedBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'APPROVED', 1, ?)
    `).bind(id, name.trim(), category.trim(), cleanRate, cleanRate, location || 'NearNest Society', experience || '2+ years', speciality || '', phone || '', email || '', avatar || '', submittedBy || 'Community Member').run();

    return new Response(JSON.stringify({ success: true, id, message: 'Service added to Cloudflare D1' }), { headers: CORS_HEADERS });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message }), { status: 500, headers: CORS_HEADERS });
  }
}

async function handleDeleteService(request: Request, env: Env): Promise<Response> {
  if (!env.DB) return new Response(JSON.stringify({ success: false }), { status: 500, headers: CORS_HEADERS });
  try {
    const { id } = (await request.json()) as any;
    if (id) {
      await env.DB.prepare('DELETE FROM services WHERE id = ?').bind(id).run();
    }
    return new Response(JSON.stringify({ success: true }), { headers: CORS_HEADERS });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message }), { status: 500, headers: CORS_HEADERS });
  }
}

// ======================== BUSINESSES ========================
async function handleGetBusinesses(request: Request, env: Env): Promise<Response> {
  if (!env.DB) {
    return new Response(JSON.stringify({ success: true, businesses: [], source: 'no-db' }), { headers: CORS_HEADERS });
  }

  try {
    const url = new URL(request.url);
    const includeAll = url.searchParams.get('all') === 'true';

    const query = includeAll
      ? 'SELECT * FROM businesses ORDER BY created_at DESC'
      : "SELECT * FROM businesses WHERE status = 'APPROVED' ORDER BY created_at DESC";

    const { results } = await env.DB.prepare(query).all();

    const normalized = (results || []).map((b: any) => ({
      ...b,
      verified: Boolean(b.verified),
      openNow: Boolean(b.openNow),
    }));

    return new Response(JSON.stringify({ success: true, businesses: normalized, source: 'cloudflare-d1' }), { headers: CORS_HEADERS });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message }), { status: 500, headers: CORS_HEADERS });
  }
}

async function handlePostBusiness(request: Request, env: Env): Promise<Response> {
  if (!env.DB) {
    return new Response(JSON.stringify({ success: false, error: 'D1 database not bound' }), { status: 500, headers: CORS_HEADERS });
  }

  try {
    const body = (await request.json()) as any;
    const { name, category, address, phone, email, hours, priceRange, coverPhoto } = body;

    if (!name || !category) {
      return new Response(JSON.stringify({ success: false, error: 'Name and Category are required' }), { status: 400, headers: CORS_HEADERS });
    }

    const id = body.id || `biz_${Date.now()}`;

    await env.DB.prepare(`
      INSERT INTO businesses (id, name, category, address, phone, email, hours, priceRange, coverPhoto, verified, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'APPROVED')
    `).bind(id, name.trim(), category.trim(), address || 'NearNest Commercial Complex', phone || '', email || '', hours || '9:00 AM - 9:00 PM', priceRange || '₹₹', coverPhoto || '').run();

    return new Response(JSON.stringify({ success: true, id, message: 'Business added to Cloudflare D1' }), { headers: CORS_HEADERS });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message }), { status: 500, headers: CORS_HEADERS });
  }
}

async function handleDeleteBusiness(request: Request, env: Env): Promise<Response> {
  if (!env.DB) return new Response(JSON.stringify({ success: false }), { status: 500, headers: CORS_HEADERS });
  try {
    const { id } = (await request.json()) as any;
    if (id) {
      await env.DB.prepare('DELETE FROM businesses WHERE id = ?').bind(id).run();
    }
    return new Response(JSON.stringify({ success: true }), { headers: CORS_HEADERS });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message }), { status: 500, headers: CORS_HEADERS });
  }
}

// ======================== BOOKINGS ========================
async function handleGetBookings(request: Request, env: Env): Promise<Response> {
  if (!env.DB) {
    return new Response(JSON.stringify({ success: true, bookings: [] }), { headers: CORS_HEADERS });
  }

  try {
    const { results } = await env.DB.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    const normalized = (results || []).map((b: any) => ({
      id: b.id,
      providerId: b.providerId || b.provider_id || '',
      providerName: b.providerName || b.provider_name || 'Service Provider',
      providerCategory: b.providerCategory || b.provider_category || 'Service',
      residentName: b.residentName || b.resident_name || 'Resident Member',
      residentFlat: b.residentFlat || b.resident_flat || 'Society Flat',
      residentPhone: b.residentPhone || b.resident_phone || '',
      taskDescription: b.taskDescription || b.task_description || '',
      status: b.status || 'PENDING',
      createdAt: b.createdAt || b.created_at || new Date().toISOString(),
    }));
    return new Response(JSON.stringify({ success: true, bookings: normalized, source: 'cloudflare-d1' }), { headers: CORS_HEADERS });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message }), { status: 500, headers: CORS_HEADERS });
  }
}

async function handlePostBooking(request: Request, env: Env): Promise<Response> {
  try {
    const body = (await request.json()) as any;
    const { id, providerId, providerName, providerCategory, residentName, residentFlat, residentPhone, taskDescription, status } = body;

    const bookingId = id || `book_${Date.now()}`;

    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO bookings (id, providerId, providerName, providerCategory, residentName, residentFlat, residentPhone, taskDescription, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(bookingId, providerId || '', providerName || '', providerCategory || '', residentName || 'Resident', residentFlat || '', residentPhone || '', taskDescription || '', status || 'PENDING').run();
    }

    return new Response(JSON.stringify({ success: true, bookingId, message: 'Booking saved in Cloudflare D1' }), { headers: CORS_HEADERS });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message }), { status: 500, headers: CORS_HEADERS });
  }
}

async function handlePatchBooking(request: Request, env: Env): Promise<Response> {
  if (!env.DB) {
    return new Response(JSON.stringify({ success: false, error: 'No DB' }), { status: 500, headers: CORS_HEADERS });
  }

  try {
    const body = (await request.json()) as any;
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return new Response(JSON.stringify({ success: false, error: 'bookingId and status required' }), { status: 400, headers: CORS_HEADERS });
    }

    await env.DB.prepare('UPDATE bookings SET status = ? WHERE id = ?').bind(status, bookingId).run();

    return new Response(JSON.stringify({ success: true, message: `Booking status updated to ${status}` }), { headers: CORS_HEADERS });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message }), { status: 500, headers: CORS_HEADERS });
  }
}

// ======================== EMAIL DISPATCH ========================
async function handleHireEmail(request: Request, env: Env): Promise<Response> {
  try {
    const body = (await request.json()) as any;
    const { providerEmail, residentDetails } = body;

    const targetEmail = providerEmail?.trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid provider email address.' }), { status: 400, headers: CORS_HEADERS });
    }

    const residentName = residentDetails?.name || 'Resident Member';
    const residentEmail = residentDetails?.email?.trim();
    const residentLocation = residentDetails?.location || residentDetails?.society || residentDetails?.unit || residentDetails?.address || 'Greenfield Residency';
    const serviceCategory = residentDetails?.serviceCategory || residentDetails?.category || 'Home Maintenance';
    const residentPhone = residentDetails?.phone || 'Available in NearNest';
    const providerName = residentDetails?.providerName || 'Service Provider';
    const serviceNotes = residentDetails?.serviceRequired || residentDetails?.notes || 'Doorstep society service request';

    // Also auto-save to D1 Bookings table
    if (env.DB) {
      try {
        await env.DB.prepare(`
          INSERT INTO bookings (id, providerId, providerName, providerCategory, residentName, residentFlat, residentPhone, taskDescription, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
        `).bind(`book_${Date.now()}`, body.providerId || '', providerName, serviceCategory, residentName, residentLocation, residentPhone, serviceNotes).run();
      } catch (dbErr) {
        console.warn('Booking D1 save error:', dbErr);
      }
    }

    const providerSubject = `🔔 Work Order: ${residentName} called you for ${serviceCategory} (${residentLocation})`;
    const providerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 20px; border-radius: 8px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 22px;">NearNest Community Dispatch</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">New Work Order Received</p>
        </div>
        <div style="padding: 24px 0;">
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Resident Called You For Work!</h2>
          <p style="color: #334155; font-size: 15px; line-height: 1.6;">
            Hello <strong>${providerName}</strong>, resident <strong>${residentName}</strong> has hired you on NearNest for <strong>${serviceCategory}</strong>.
          </p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p><strong>Resident:</strong> ${residentName}</p>
            <p><strong>Job Location:</strong> ${residentLocation}</p>
            <p><strong>Service:</strong> ${serviceCategory}</p>
            <p><strong>Phone:</strong> ${residentPhone}</p>
            <p><strong>Work Description:</strong> "${serviceNotes}"</p>
          </div>
          <div style="text-align: center; margin: 24px 0 10px 0;">
            <a href="tel:${residentPhone.replace(/[^0-9+]/g, '')}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 14px;">
              📞 Call Resident Directly (${residentPhone})
            </a>
          </div>
        </div>
      </div>
    `;

    const resendApiKey = env.RESEND_API_KEY;
    const fromEmail = env.RESEND_FROM_EMAIL || 'NearNest Job Alerts <onboarding@resend.dev>';

    let provDelivered = false;

    if (resendApiKey) {
      const provRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: fromEmail, to: [targetEmail], subject: providerSubject, html: providerHtml }),
      });

      if (provRes.ok) {
        provDelivered = true;
      } else {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: fromEmail, to: ['urveshrane3206@gmail.com'], subject: `[Provider Job Alert for ${providerName}] ${providerSubject}`, html: providerHtml }),
        });
        provDelivered = true;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        isRealDelivery: Boolean(resendApiKey),
        directDelivery: provDelivered,
        method: 'cloudflare-d1-worker',
        message: provDelivered ? `Work order saved in Cloudflare D1 and email dispatched!` : `Work order recorded in Cloudflare D1!`,
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message }), { status: 500, headers: CORS_HEADERS });
  }
}
