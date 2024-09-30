// app/api/messages/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import crypto from 'crypto';
import validator from 'validator';
import nodemailer from 'nodemailer';

const VAULT_ADDR = process.env.VAULT_ADDR as string;
const VAULT_TOKEN = process.env.VAULT_TOKEN as string;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;
const IV_LENGTH = 16;
const EMAIL_HOST = process.env.EMAIL_HOST as string;
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT as string);
const EMAIL_USER = process.env.EMAIL_USER as string;
const EMAIL_PASS = process.env.EMAIL_PASS as string;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift() as string, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

async function sendEmail(email: string, subject: string, text: string) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // This should be used only for development purposes
    },
  });
  

  await transporter.sendMail({
    from: `"No Reply" <${EMAIL_USER}>`,
    to: email,
    subject: subject,
    text: text,
  });
}


export async function POST(request: NextRequest) {
  const { content, password, expiry, email } = await request.json();
  
  if (!content || !validator.isLength(content, { min: 1, max: 2500 })) {
    return NextResponse.json({ error: 'Ungültiger Inhalt' }, { status: 400 });
  }
  
  if (password && !validator.isLength(password, { min: 6, max: 100 })) {
    return NextResponse.json({ error: 'Ungültiges Passwort' }, { status: 400 });
  }

  if (expiry && !validator.isISO8601(expiry)) {
    return NextResponse.json({ error: 'Ungültiges Ablaufdatum' }, { status: 400 });
  }

  if (email && !validator.isEmail(email)) {
    return NextResponse.json({ error: 'Ungültige E-Mail-Adresse' }, { status: 400 });
  }

  const encryptedContent = encrypt(content);
  const encryptedPassword = password ? encrypt(password) : null;
  const messageId = uuidv4();
  const messagePath = `secret/data/messages/${messageId}`;
  const passwordPath = `secret/data/passwords/${messageId}`;
  
  const messageData = {
    data: {
      content: encryptedContent,
    },
  };

  const passwordData = {
    data: {
      password: encryptedPassword,
      expiry: expiry ? new Date(expiry).toISOString() : null,
      email: email || null, // E-Mail hinzufügen
    },
  };

  try {
    await axios.post(`${VAULT_ADDR}/v1/${messagePath}`, messageData, {
      headers: { 'X-Vault-Token': VAULT_TOKEN },
    });

    await axios.post(`${VAULT_ADDR}/v1/${passwordPath}`, passwordData, {
      headers: { 'X-Vault-Token': VAULT_TOKEN },
    });

    return NextResponse.json({ id: messageId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Fehler beim Speichern der Nachricht' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const messageId = searchParams.get('id');
  const password = searchParams.get('password');
  
  if (!messageId || !validator.isUUID(messageId)) {
    return NextResponse.json({ error: 'Ungültige ID' }, { status: 400 });
  }

  const messagePath = `secret/data/messages/${messageId}`;
  const passwordPath = `secret/data/passwords/${messageId}`;

  try {
    const messageResponse = await axios.get(`${VAULT_ADDR}/v1/${messagePath}`, {
      headers: { 'X-Vault-Token': VAULT_TOKEN },
    });

    const passwordResponse = await axios.get(`${VAULT_ADDR}/v1/${passwordPath}`, {
      headers: { 'X-Vault-Token': VAULT_TOKEN },
    });

    const { content } = messageResponse.data.data.data;
    const { password: storedPassword, expiry, email } = passwordResponse.data.data.data;

    if (expiry && new Date() > new Date(expiry)) {
      return NextResponse.json({ error: 'Nachricht abgelaufen' }, { status: 410 });
    }

    if (storedPassword) {
      if (!password || decrypt(storedPassword) !== password) {
        return NextResponse.json({ error: 'Falsches Passwort' }, { status: 403 });
      }
    } else {
      if (password) {
        return NextResponse.json({ error: 'Falsches Passwort' }, { status: 403 });
      }
    }

    const message = decrypt(content);

    await axios.delete(`${VAULT_ADDR}/v1/${messagePath}`, {
      headers: { 'X-Vault-Token': VAULT_TOKEN },
    });

    await axios.delete(`${VAULT_ADDR}/v1/${passwordPath}`, {
      headers: { 'X-Vault-Token': VAULT_TOKEN },
    });

    

    // E-Mail-Benachrichtigung senden, falls eine E-Mail angegeben ist
    if (email) {
      await sendEmail(email, 'Ihre Nachricht wurde angesehen und gelöscht', 'Ihre einmalige Nachricht wurde angesehen und gelöscht.');
    }

    return NextResponse.json({ content: message });
  } catch (error) {
    //console.error('Fehler beim Abrufen der Nachricht:', error);
    return NextResponse.json({ error: 'Nachricht nicht gefunden oder bereits angesehen' }, { status: 404 });
  }
}
