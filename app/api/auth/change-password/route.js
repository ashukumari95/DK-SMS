import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { getSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    await connectDB();

    // Fallback if adminId is corrupted in old sessions
    let adminIdStr = session.adminId;
    if (typeof adminIdStr === 'object') {
      return NextResponse.json({ message: 'Session expired. Please log out and log in again.' }, { status: 401 });
    }

    const admin = await Admin.findById(adminIdStr);

    if (!admin) {
      return NextResponse.json({ message: 'Admin not found.' }, { status: 404 });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return NextResponse.json({ message: 'Incorrect current password.' }, { status: 400 });
    }

    admin.password = newPassword;
    await admin.save();

    return NextResponse.json({ message: 'Password changed successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
