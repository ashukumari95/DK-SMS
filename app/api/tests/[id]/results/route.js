import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Test from '@/models/Test';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { results } = await request.json();
    
    await connectToDatabase();
    
    const test = await Test.findById(id);
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    test.results = results;
    
    // Call the mongoose schema method to rank students
    test.calculateAndApplyRanks();
    
    await test.save();
    return NextResponse.json(test);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
