import { NextResponse } from 'next/server';
import crypto from 'crypto';

const FB_PIXEL_ID = process.env.META_PIXEL_ID!;
const FB_ACCESS_TOKEN = process.env.META_CAPI_TOKEN!;

const hashEmail = (email: string) => {
  return crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = {
      event_name: body.eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: body.eventSourceUrl,
      user_data: {
        em: [hashEmail(body.email)], // hash with SHA256
      },
      custom_data: body.customData,
      action_source: 'website',
    };

    const res = await fetch(
      `https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}&test_event_code=TEST17615`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: [payload] }),
      }
    );

    const json = await res.json();

    return NextResponse.json({ success: true, metaResponse: json });
  } catch (error: any) {
    console.error('Meta CAPI error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}