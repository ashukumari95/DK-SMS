import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Test from '@/models/Test';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    await connectToDatabase();
    
    const updatedTest = await Test.findByIdAndUpdate(id, data, { new: true });
    if (!updatedTest) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }
    return NextResponse.json(updatedTest);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();
    
    const deletedTest = await Test.findByIdAndDelete(id);
    if (!deletedTest) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Test and associated rankings deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
