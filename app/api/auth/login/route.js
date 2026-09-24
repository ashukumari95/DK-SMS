import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { setSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const { mobile, password, captcha, captchaId } = await request.json();

    if (!mobile || !password || !captcha || !captchaId) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    // Verify Captcha (we will store it in a simple in-memory Map for this MVP)
    // Normally you'd use a database, Redis, or signed JWT for captcha verification
    const globalCaptchaStore = global.captchaStore || new Map();
    const storedCaptcha = globalCaptchaStore.get(captchaId);
    
    if (!storedCaptcha) {
      return NextResponse.json({ message: 'Captcha expired. Please refresh.' }, { status: 400 });
    }
    
    if (storedCaptcha.toLowerCase() !== captcha.toLowerCase()) {
      return NextResponse.json({ message: 'Invalid captcha code.' }, { status: 400 });
    }
    
    // Clean up used captcha
    globalCaptchaStore.delete(captchaId);

    // DB Connection
    await connectDB();

    // Verify Admin credentials
    const admin = await Admin.findOne({ mobile });
    if (!admin) {
      return NextResponse.json({ message: 'Invalid mobile number or password.' }, { status: 401 });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid mobile number or password.' }, { status: 401 });
    }

    // Set HTTP-Only Cookie Session
    await setSession(admin);

    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
