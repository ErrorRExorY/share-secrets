import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
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
