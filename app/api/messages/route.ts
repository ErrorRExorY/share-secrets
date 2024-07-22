import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import crypto from 'crypto';

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
  const { content, password, expiry } = await request.json();
  const encryptedContent = encrypt(content);
  const encryptedPassword = password ? encrypt(password) : null;

  const messageId = uuidv4();
  const secretPath = `secret/data/messages/${messageId}`;
  const secretData = {
    data: {
      content: encryptedContent,
      password: encryptedPassword,
      expiry: expiry ? new Date(expiry).toISOString() : null,
    },
  };

  try {
    await axios.post(`${VAULT_ADDR}/v1/${secretPath}`, secretData, {
      headers: { 'X-Vault-Token': VAULT_TOKEN },
    });
    return NextResponse.json({ id: messageId });
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Speichern der Nachricht' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const messageId = searchParams.get('id');
  const password = searchParams.get('password');
  if (!messageId) {
    return NextResponse.json({ error: 'ID ist erforderlich' }, { status: 400 });
  }

  const secretPath = `secret/data/messages/${messageId}`;

  try {
    const response = await axios.get(`${VAULT_ADDR}/v1/${secretPath}`, {
      headers: { 'X-Vault-Token': VAULT_TOKEN },
    });

    const { content, password: storedPassword, expiry } = response.data.data.data;

    if (expiry && new Date() > new Date(expiry)) {
      return NextResponse.json({ error: 'Nachricht abgelaufen' }, { status: 410 });
    }

    if (storedPassword && (!password || decrypt(storedPassword) !== password)) {
      return NextResponse.json({ error: 'Falsches Passwort' }, { status: 403 });
    }

    const message = decrypt(content);

    await axios.delete(`${VAULT_ADDR}/v1/${secretPath}`, {
      headers: { 'X-Vault-Token': VAULT_TOKEN },
    });

    return NextResponse.json({ content: message });
  } catch (error) {
    return NextResponse.json({ error: 'Nachricht nicht gefunden oder bereits angesehen' }, { status: 404 });
  }
}
