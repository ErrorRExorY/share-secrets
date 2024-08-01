// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/app/models/User';
import { sendPasswordResetEmail } from '@/app/lib/mail';
import { generateResetToken } from '@/app/lib/tokens';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const user = await findUserByEmail(email);

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 400 });
  }

  const token = generateResetToken(user.id);

  await sendPasswordResetEmail(email, token);

  return NextResponse.json({ message: 'Password reset email sent' });
}
