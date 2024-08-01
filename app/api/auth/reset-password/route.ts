// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updatePassword } from '@/app/models/User';
import { verifyResetToken } from '@/app/lib/tokens';

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  const userId = verifyResetToken(token);

  if (!userId) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
  }

  await updatePassword(userId, password);

  return NextResponse.json({ message: 'Password has been reset' });
}
