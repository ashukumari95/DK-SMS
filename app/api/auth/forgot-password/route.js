import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(request) {
  try {
    const { mobile } = await request.json();

    if (!mobile) {
      return NextResponse.json({ message: 'Mobile number is required.' }, { status: 400 });
    }

    await connectDB();
    const admin = await Admin.findOne({ mobile });

    if (!admin) {
      // Return 200 anyway to prevent user enumeration
      return NextResponse.json({ message: 'If the number is registered, an OTP has been sent.' }, { status: 200 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to DB (valid for 10 minutes)
    admin.resetOtp = otp;
    admin.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await admin.save();

    // In a real app, integrate Twilio/Fast2SMS here
    console.log(`\n\n=== MOCK SMS ===\nTo: ${mobile}\nYour D.K.Mishra admin reset OTP is: ${otp}\n================\n\n`);

    return NextResponse.json({ message: 'If the number is registered, an OTP has been sent.' }, { status: 200 });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
