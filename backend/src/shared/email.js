import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

export function emailIsConfigured() {
  return Boolean(env.smtpHost && env.smtpUser && env.smtpPass)
}

export async function sendEmail({ to, subject, text }) {
  if (!emailIsConfigured()) return { sent: false }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  })

  await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    text,
  })

  return { sent: true }
}
