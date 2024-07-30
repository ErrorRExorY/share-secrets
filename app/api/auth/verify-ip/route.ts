// app/api/auth/verify-ip/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUserIp } from '@/app/models/User';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user');
  const ip = searchParams.get('ip');

  if (!userId || !ip) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: 'Invalid user' }, { status: 400 });
  }

  await updateUserIp(userId, ip);

  return NextResponse.json({ message: 'IP address verified successfully' });
}
