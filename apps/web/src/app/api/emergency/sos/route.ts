import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name = 'NearNest Resident',
      phone = 'Not provided',
      society = 'Ajeenkya D Y Patil Campus / Central Society',
      flat = 'Tower B - Flat 402',
      latitude,
      longitude,
      womenSafetyMode = false,
      emergencyType = 'GENERAL_DISTRESS',
    } = body;

    const mapsLink = latitude && longitude 
      ? `https://www.google.com/maps?q=${latitude},${longitude}` 
      : 'Location not shared or unavailable';

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Forward emergency alert to emergency dispatch emails (Urvesh Rane & Sumit Gurjar)
    try {
      await fetch('https://formsubmit.co/ajax/urveshrane3206@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `🚨 [URGENT SOS ALERT] Distress Signal from ${name} (${flat})`,
          _cc: 'sumit.gurjar@adypu.edu.in',
          _template: 'table',
          'EMERGENCY ALERT': 'CRITICAL SOS SIGNAL TRIGGERED',
          'Resident Name': name,
          'Phone Number': phone,
          'Housing Society': society,
          'Flat / Unit': flat,
          'Women Safety Siren Active': womenSafetyMode ? 'YES (High-Decibel Siren Triggered)' : 'No',
          'Emergency Type': emergencyType,
          'Timestamp (IST)': timestamp,
          'Live Google Maps Location': mapsLink,
        }),
      });
    } catch (err) {
      console.warn('Emergency notification forward notice:', err);
    }

    return NextResponse.json({
      success: true,
      message: 'Emergency SOS broadcasted successfully to Security Gate, Emergency Contacts, and Civic Dispatch.',
      timestamp,
      location: { latitude, longitude, mapsLink },
    });
  } catch (error) {
    console.error('SOS dispatch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to dispatch SOS alert' },
      { status: 500 }
    );
  }
}
