import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Student from '@/models/Student';

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { studentId, amount, month } = body;

    const student = await Student.findOne({ studentId });
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    // Add installment
    student.fees.installments.push({
      amount: Number(amount),
      paidDate: new Date(),
      status: 'Paid',
      month: month
    });

    // Update totals
    student.fees.amountPaid += Number(amount);
    student.fees.amountDue = student.fees.totalFee - student.fees.amountPaid;

    await student.save();

    return NextResponse.json({ success: true, data: student }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
