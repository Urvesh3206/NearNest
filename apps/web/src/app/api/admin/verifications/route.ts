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

export async function GET(req: Request) {
  try {
    const data = getDbData();
    const { searchParams } = new URL(req.url);
    const filterStatus = searchParams.get('status'); // 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'

    const businessRequests = (data.businesses || []).map((b: any) => ({
      ...b,
      requestType: 'business',
      title: b.name,
      subtitle: `${b.category} • ${b.address}`,
      status: b.status || 'APPROVED',
    }));

    const serviceRequests = (data.services || []).map((s: any) => ({
      ...s,
      requestType: 'service',
      title: s.name,
      subtitle: `${s.category} • ${s.rate} • ${s.location}`,
      status: s.status || 'APPROVED',
    }));

    let allRequests = [...businessRequests, ...serviceRequests];

    // Sort: PENDING requests first, then by date descending
    allRequests.sort((a, b) => {
      if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
      if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    if (filterStatus && filterStatus !== 'ALL') {
      allRequests = allRequests.filter((r) => r.status === filterStatus);
    }

    const counts = {
      total: allRequests.length,
      pending: allRequests.filter((r) => r.status === 'PENDING').length,
      approved: allRequests.filter((r) => r.status === 'APPROVED').length,
      rejected: allRequests.filter((r) => r.status === 'REJECTED').length,
    };

    return NextResponse.json({ success: true, requests: allRequests, counts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, id, action } = body; // action: 'APPROVE' | 'REJECT'

    if (!type || !id || !action) {
      return NextResponse.json(
        { success: false, error: 'Type, ID, and Action are required' },
        { status: 400 }
      );
    }

    const data = getDbData();
    const targetStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    const isVerified = action === 'APPROVE';
    let updatedItem: any = null;

    if (type === 'business') {
      data.businesses = (data.businesses || []).map((b: any) => {
        if (b.id === id) {
          updatedItem = {
            ...b,
            status: targetStatus,
            verified: isVerified,
            reviewedAt: new Date().toISOString(),
          };
          return updatedItem;
        }
        return b;
      });
    } else if (type === 'service') {
      data.services = (data.services || []).map((s: any) => {
        if (s.id === id) {
          updatedItem = {
            ...s,
            status: targetStatus,
            verified: isVerified,
            reviewedAt: new Date().toISOString(),
          };
          return updatedItem;
        }
        return s;
      });
    }

    if (!updatedItem) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }

    saveDbData(data);

    return NextResponse.json({
      success: true,
      message: `${type === 'service' ? 'Service Provider' : 'Business'} "${updatedItem.name}" has been ${action === 'APPROVE' ? 'approved & published' : 'rejected'}.`,
      item: updatedItem,
    });
  } catch (error: any) {
    console.error('POST /api/admin/verifications error:', error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ success: false, error: 'Type and ID required' }, { status: 400 });
    }

    const data = getDbData();
    if (type === 'business') {
      data.businesses = (data.businesses || []).filter((b: any) => b.id !== id);
    } else if (type === 'service') {
      data.services = (data.services || []).filter((s: any) => s.id !== id);
    }
    saveDbData(data);

    return NextResponse.json({ success: true, message: 'Request removed from database' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
