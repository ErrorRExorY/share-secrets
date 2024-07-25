import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// In-memory store for rate limiting
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 1; // max 5 requests per window per IP

function getClientIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for') || request.ip || 'unknown';
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const now = Date.now();

  // Initialize rate limit data if not present
  if (!rateLimitStore.has(clientIp)) {
    rateLimitStore.set(clientIp, { count: 0, startTime: now });
  }

  const rateLimitData = rateLimitStore.get(clientIp);

  // Reset count if window has passed
  if (now - rateLimitData.startTime > RATE_LIMIT_WINDOW) {
    rateLimitData.count = 0;
    rateLimitData.startTime = now;
  }

  // Increment request count
  rateLimitData.count += 1;

  // Check if rate limit exceeded
  if (rateLimitData.count > RATE_LIMIT_MAX_REQUESTS) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' },
      { status: 429 }
    );
  }

  try {
    const { name, email, message } = await request.json();

    // Validierung der eingehenden Daten
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Alle Felder sind erforderlich.' }, { status: 400 });
    }

    // E-Mail-Transporter konfigurieren
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // oder ein anderer E-Mail-Service
      auth: {
        user: process.env.EMAIL_USER, // Ihre E-Mail
        pass: process.env.EMAIL_PASS, // Ihr E-Mail-Passwort
      },
    });

    // E-Mail-Inhalt konfigurieren
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_RECEIVER, // Empfänger-E-Mail
      subject: `Neue Kontaktanfrage von ${name}`,
      text: message,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>E-Mail:</strong> ${email}</p><p><strong>Nachricht:</strong><br>${message}</p>`,
    };

    // E-Mail senden
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: 'Nachricht erfolgreich gesendet!' });
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
    return NextResponse.json({ error: 'Fehler beim Senden der Nachricht.' }, { status: 500 });
  }
}
