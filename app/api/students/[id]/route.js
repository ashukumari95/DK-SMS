import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Student from '@/models/Student';
import Attendance from '@/models/Attendance';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    await connectToDatabase();
    
    const updatedStudent = await Student.findByIdAndUpdate(id, data, { new: true });
    if (!updatedStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json(updatedStudent);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();
    
    // We should delete related Attendance records or Fee reports (or just leave them orphaned/cascading).
    // For simplicity, we just delete the student. In a production app, we would delete related records.
    await Attendance.deleteMany({ 'records.studentId': id });

    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Student and related records deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
