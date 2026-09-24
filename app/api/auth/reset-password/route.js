import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(request) {
  try {
    const { mobile, otp, newPassword } = await request.json();

    if (!mobile || !otp || !newPassword) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    await connectDB();
    const admin = await Admin.findOne({ mobile });

    if (!admin) {
      return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
    }

    if (admin.resetOtp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP.' }, { status: 400 });
    }

    if (admin.resetOtpExpires < new Date()) {
      return NextResponse.json({ message: 'OTP has expired.' }, { status: 400 });
    }

    // Update password
    admin.password = newPassword;
    admin.resetOtp = undefined;
    admin.resetOtpExpires = undefined;
    
    await admin.save();

    return NextResponse.json({ message: 'Password reset successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
