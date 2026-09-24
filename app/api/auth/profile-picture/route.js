import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ message: 'No image uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file to public/uploads
    // Create uploads dir if it doesn't exist
    const filename = `profile-${session.adminId}-${Date.now()}.${file.type.split('/')[1] || 'jpg'}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // In a real app we'd want to use fs.mkdir to ensure the directory exists, 
    // but NextJS public/uploads is usually there. Or we can just use /tmp or a cloud bucket.
    // For local dev, we will assume public/uploads exists or we just write there.
    const path = join(uploadDir, filename);

    try {
      await writeFile(path, buffer);
    } catch (e) {
      // If directory doesn't exist, try creating it
      const fs = require('fs');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        await writeFile(path, buffer);
      } else {
        throw e;
      }
    }
    
    const url = `/uploads/${filename}`;

    await connectToDatabase();
    await Admin.findByIdAndUpdate(session.adminId, { profilePicture: url });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
