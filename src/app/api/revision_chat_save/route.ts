import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getApps, initializeApp, cert } from 'firebase-admin/app';

const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
if (!serviceAccountBase64) throw new Error('Missing service account env var');

const serviceAccount = JSON.parse(
  Buffer.from(serviceAccountBase64, 'base64').toString('utf-8')
);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      chatId,
      qaPairs,
      output,
    } = body;

    if (!userId || !qaPairs || qaPairs.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const data: any = {
      chat: qaPairs,
      output,
      updatedAt: Timestamp.now(),
    };

    if (!chatId) {
      return NextResponse.json({ error: 'Missing chatId for update' }, { status: 400 });
    } else {
      await db.collection('revision_chats').doc(chatId).update(data);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error('[save-chat] Error saving chat:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
