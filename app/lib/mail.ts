// app/lib/mail.ts
import nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/reset-password/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
  };

  await transporter.sendMail(mailOptions);
}
