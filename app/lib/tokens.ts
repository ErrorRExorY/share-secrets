// app/lib/tokens.ts
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your-secret-key';

export function generateResetToken(userId: number) {
  return jwt.sign({ userId }, secret, { expiresIn: '1h' });
}

export function verifyResetToken(token: string) {
  try {
    const decoded = jwt.verify(token, secret);
    return (decoded as any).userId;
  } catch (err) {
    return null;
  }
}
