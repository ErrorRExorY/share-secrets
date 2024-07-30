// app/lib/email.ts
import nodemailer from 'nodemailer';

export async function sendIpVerificationEmail(email: string, ip: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verifyUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/verify-ip?user=${email}&ip=${ip}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'IP Address Verification',
    text: `Please verify your new IP address by clicking the following link: ${verifyUrl}`,
    html: `<p>Please verify your new IP address by clicking the following link: <a href="${verifyUrl}">${verifyUrl}</a></p>`,
  });
}
