// app/api/internal/get-ip/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Extrahieren der IP-Adresse aus den Headern
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.ip || 'IP not available';

  return NextResponse.json({ ip });
}
