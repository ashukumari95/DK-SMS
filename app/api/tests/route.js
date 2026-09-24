import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Test from '@/models/Test';

export async function GET() {
  try {
    await connectToDatabase();
    const tests = await Test.find({}).sort({ date: -1 });
    return NextResponse.json(tests);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    await connectToDatabase();
    
    const newTest = await Test.create(data);
    return NextResponse.json(newTest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
