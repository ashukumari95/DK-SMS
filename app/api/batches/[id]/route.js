import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Batch from '@/models/Batch';
import Student from '@/models/Student';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    await connectToDatabase();
    
    const updatedBatch = await Batch.findByIdAndUpdate(id, data, { new: true });
    if (!updatedBatch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }
    return NextResponse.json(updatedBatch);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();
    
    // Check if students are enrolled
    const studentCount = await Student.countDocuments({ batchId: id });
    if (studentCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete batch. ${studentCount} student(s) are currently enrolled in it.` }, 
        { status: 400 }
      );
    }

    const deletedBatch = await Batch.findByIdAndDelete(id);
    if (!deletedBatch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Batch deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
