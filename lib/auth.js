import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(key);
}

export async function decrypt(input) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function setSession(admin) {
  // Create the session
  const expires = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours
  const sessionData = {
    adminId: admin._id.toString(),
    mobile: admin.mobile,
    name: admin.name,
    role: admin.role,
    profilePicture: admin.profilePicture || ''
  };
  
  const session = await encrypt(sessionData);

  // Save the session in a cookie
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function setStudentSession(student) {
  const expires = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours
  const sessionData = {
    studentId: student._id.toString(),
    studentDisplayId: student.studentId,
    phone: student.phone,
    name: student.name,
    role: 'Student',
  };
  
  const session = await encrypt(sessionData);

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', {
    expires: new Date(0),
    path: '/',
  });
}
