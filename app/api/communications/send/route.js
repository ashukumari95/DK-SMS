import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import CommunicationLog from '@/models/CommunicationLog';
import { getSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const { studentId, recipientPhone, message, purpose, type = 'SMS' } = await request.json();

    if (!studentId || !recipientPhone || !message || !purpose) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // =========================================================================
    // TODO: Integrate actual SMS gateway here (e.g. Twilio, MSG91, Fast2SMS)
    // Example:
    // const response = await twilioClient.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: recipientPhone
    // });
    // =========================================================================

    // MOCK SENDING - Log to console
    console.log(`[MOCK SMS] To: ${recipientPhone} | Purpose: ${purpose} | Message: ${message}`);

    // Save to database
    const log = await CommunicationLog.create({
      type,
      recipientPhone,
      studentId,
      message,
      purpose,
      status: 'Sent', // Assumed success for mock
      metadata: { mock: true }
    });

    return NextResponse.json({ success: true, log }, { status: 200 });

  } catch (error) {
    console.error('Error sending communication:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
