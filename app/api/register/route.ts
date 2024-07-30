// src/app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connection from '@/app/lib/mysql';
import { RowDataPacket, OkPacket } from 'mysql2';

export async function POST(req: NextRequest) {
  try {
    const { email, password, username } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const [existingUser] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connection.execute<OkPacket>(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      [email, username, hashedPassword]
    );

    if (result.insertId) {
      return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    }

    return NextResponse.json({ message: 'User registration failed' }, { status: 500 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
