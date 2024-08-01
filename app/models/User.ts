// src/app/models/User.ts
import { RowDataPacket } from 'mysql2/promise';
import connection from '../lib/mysql';
import bcrypt from 'bcryptjs';

interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  last_ip?: string;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
  const users = rows as User[];
  return users.length ? users[0] : null;
}

export async function comparePassword(storedPassword: string, inputPassword: string): Promise<boolean> {
  return bcrypt.compare(inputPassword, storedPassword);
}

// Update user's IP address
export async function updateUserIp(userId: string, ip: string): Promise<void> {
  await connection.execute('UPDATE users SET last_ip = ? WHERE id = ?', [ip, userId]);
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [userId]);
  return rows[0] as User | null;
}

export async function updatePassword(userId: number, newPassword: string): Promise<void> {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await connection.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
}