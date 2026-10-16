const fs = require('fs');
const path = require('path');
const { createClient } = require(path.join(__dirname, '..', 'node_modules', '@supabase', 'supabase-js'));

const supabaseUrl = 'https://dyoigmkwibtegzriokkh.supabase.co';
const supabaseKey = 'sb_publishable_ieWwtEbamoXi9fAXxOKjDw_CP-4KWiJ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const dbPath = path.join(__dirname, '..', 'src', 'data', 'db.json');
  if (!fs.existsSync(dbPath)) {
    console.log('db.json not found');
    return;
  }

  const raw = fs.readFileSync(dbPath, 'utf8');
  const data = JSON.parse(raw);

  // 1. Sync Services
  if (Array.isArray(data.services) && data.services.length > 0) {
    console.log(`Syncing ${data.services.length} services to Supabase...`);
    const formattedServices = data.services.map(s => ({
      id: String(s.id),
      name: s.name || '',
      category: s.category || '',
      location: s.location || '',
      distance: s.distance || '0.2 km',
      verified: Boolean(s.verified ?? true),
      status: s.status || 'APPROVED',
      rating: Number(s.rating || 5.0),
      reviews: Number(s.reviews || 0),
      rate: s.rate || '₹350/hr',
      experience: s.experience || '3 years',
      availabletoday: Boolean(s.availableToday ?? true),
      avatar: s.avatar || '',
      speciality: s.speciality || '',
      phone: s.phone || '',
      email: s.email || '',
      iscustom: Boolean(s.isCustom ?? true),
      submittedby: s.submittedBy || '',
      createdat: s.createdAt || new Date().toISOString()
    }));

    const { error: srvErr } = await supabase.from('services').upsert(formattedServices, { onConflict: 'id' });
    if (srvErr) {
      console.error('Error syncing services:', srvErr.message);
    } else {
      console.log('✅ 20 Services successfully synced to Supabase cloud database!');
    }
  }

  // 2. Sync Businesses
  if (Array.isArray(data.businesses) && data.businesses.length > 0) {
    console.log(`Syncing ${data.businesses.length} businesses to Supabase...`);
    const formattedBusinesses = data.businesses.map(b => ({
      id: String(b.id),
      name: b.name || '',
      category: b.category || '',
      address: b.address || '',
      phone: b.phone || '',
      tagline: b.tagline || '',
      pricerange: b.priceRange || '₹₹',
      coverphoto: b.coverPhoto || '',
      logo: b.logo || '',
      opennow: Boolean(b.openNow ?? true),
      rating: Number(b.rating || 5.0),
      reviews: Number(b.reviews || 0),
      distance: b.distance || '0.3 km',
      lat: Number(b.lat || 18.606),
      lng: Number(b.lng || 73.875),
      owner: b.owner || 'Urvesh Rane',
      status: b.status || 'APPROVED',
      verified: Boolean(b.verified ?? true),
      iscustom: Boolean(b.isCustom ?? true),
      createdat: b.createdAt || new Date().toISOString()
    }));

    const { error: bizErr } = await supabase.from('businesses').upsert(formattedBusinesses, { onConflict: 'id' });
    if (bizErr) {
      console.error('Error syncing businesses:', bizErr.message);
    } else {
      console.log('✅ Businesses successfully synced to Supabase cloud database!');
    }
  }

  console.log('Sync complete!');
}

main().catch(console.error);
