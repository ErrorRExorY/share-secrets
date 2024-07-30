// app/api/user/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import crypto from 'crypto';
import validator from 'validator';
import { getSession } from 'next-auth/react';
import { authOptions } from '@/app/lib/auth';
import { getServerSession } from 'next-auth/next';

const VAULT_ADDR = process.env.VAULT_ADDR as string;
const VAULT_TOKEN = process.env.VAULT_TOKEN as string;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;
const IV_LENGTH = 16;

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

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { content, password, expiry } = await request.json();

  if (!content || !validator.isLength(content, { min: 1, max: 2500 })) {
    return NextResponse.json({ error: 'Ungültiger Inhalt' }, { status: 400 });
  }

  if (password && !validator.isLength(password, { min: 6, max: 100 })) {
    return NextResponse.json({ error: 'Ungültiges Passwort' }, { status: 400 });
  }

  if (expiry && !validator.isISO8601(expiry)) {
    return NextResponse.json({ error: 'Ungültiges Ablaufdatum' }, { status: 400 });
  }

  const encryptedContent = encrypt(content);
  const encryptedPassword = password ? encrypt(password) : null;

  const messageId = uuidv4();
  const messagePath = `secret/data/messages/${userId}/${messageId}`;
  const passwordPath = `secret/data/passwords/${userId}/${messageId}`;

  const messageData = {
    data: {
      content: encryptedContent,
    },
  };

  const passwordData = {
    data: {
      password: encryptedPassword,
      expiry: expiry ? new Date(expiry).toISOString() : null,
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
    return NextResponse.json({ error: 'Fehler beim Speichern der Nachricht' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const messagesPath = `secret/data/messages/${userId}`;
    const messagesResponse = await axios.get(`${VAULT_ADDR}/v1/${messagesPath}`, {
      headers: { 'X-Vault-Token': VAULT_TOKEN },
    });

    const messagesData = messagesResponse.data.data;
    const messages = messagesData ? Object.keys(messagesData).map((key) => ({
      id: key,
      ...messagesData[key],
    })) : [];

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json([]);
  }
}