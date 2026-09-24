import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Student from '@/models/Student';

export async function GET(request) {
  try {
    await connectToDatabase();
    // In a real app, you would add pagination and filtering based on query params here
    const students = await Student.find({}).populate('batchId').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Auto-generate student ID (Basic implementation)
    const count = await Student.countDocuments();
    const year = new Date().getFullYear();
    const studentId = `DKM-${year}-${String(count + 1).padStart(3, '0')}`;
    
    body.studentId = studentId;

    const student = await Student.create(body);
    return NextResponse.json({ success: true, data: student }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
