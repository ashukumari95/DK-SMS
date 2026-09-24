import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Batch from '@/models/Batch';

export async function GET() {
  try {
    await connectToDatabase();
    const batches = await Batch.find({});
    return NextResponse.json({ success: true, data: batches });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const batch = await Batch.create(body);
    return NextResponse.json({ success: true, data: batch }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
