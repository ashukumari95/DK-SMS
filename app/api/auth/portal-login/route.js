import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Student from '@/models/Student';
import { setStudentSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const { studentId, phone } = await request.json();

    if (!studentId || !phone) {
      return NextResponse.json(
        { error: 'Student ID and Phone Number are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const student = await Student.findOne({ 
      studentId, 
      phone,
      isActive: true
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Invalid Student ID or Phone Number, or account inactive.' },
        { status: 401 }
      );
    }

    await setStudentSession(student);

    return NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Portal login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
