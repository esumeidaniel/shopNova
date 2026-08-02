import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import { env } from '../../config/env.js'
import { createToken } from '../../shared/auth.js'
import { getDb, removePassword, saveDb } from '../../shared/db.js'
import { sendEmail } from '../../shared/email.js'
import { isStrongPassword, validateLogin, validateRegister } from '../../shared/validation.js'

function makeCode() {
  return crypto.randomInt(100000, 999999).toString()
}

function expiresInMinutes(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString()
}

function codeIsValid(record, code) {
  return Boolean(record?.code && record.code === code && new Date(record.expiresAt).getTime() > Date.now())
}

async function sendAccountEmail(options) {
  try {
    const result = await sendEmail(options)
    if (!result.sent) {
      return { ok: false, message: 'Email service is not configured on the backend' }
    }

    return { ok: true }
  } catch {
    return { ok: false, message: 'Email could not be sent. Check SMTP settings and try again.' }
  }
}

export async function register(req, res) {
  const db = await getDb()
  const email = req.body.email?.trim().toLowerCase()
  const validationError = validateRegister(req.body)

  if (validationError) {
    return res.status(400).json({ message: validationError })
  }

  if (db.users.some((user) => user.email === email)) {
    return res.status(400).json({ message: 'Email already exists' })
  }

  const user = {
    id: `user_${Date.now()}`,
    email,
    password: await bcrypt.hash(req.body.password, 10),
    role: 'customer',
    firstName: req.body.firstName || '',
    lastName: req.body.lastName || '',
    phone: req.body.phone || '',
    emailVerified: false,
    emailVerification: {
      code: makeCode(),
      expiresAt: expiresInMinutes(15),
    },
    addresses: [],
    wishlist: [],
    cart: [],
    notifications: {
      orderUpdates: true,
      promotions: true,
      newArrivals: true,
      whatsapp: true,
      newsletters: true,
    },
  }

  db.users.push(user)
  await saveDb(db)
  const emailResult = await sendAccountEmail({
    to: user.email,
    subject: 'Verify your SHOPNOVA account',
    text: `Your SHOPNOVA verification code is ${user.emailVerification.code}. It expires in 15 minutes.`,
  })

  if (!emailResult.ok && env.requireEmailVerification) {
    return res.status(503).json({ message: emailResult.message })
  }

  return res.status(201).json({
    user: removePassword(user),
    token: createToken(user),
    message: emailResult.ok
      ? 'Account created. Verification code sent.'
      : 'Account created. Email service is not configured.',
  })
}

export async function login(req, res) {
  const db = await getDb()
  const email = req.body.email?.trim().toLowerCase()
  const validationError = validateLogin(req.body)

  if (validationError) {
    return res.status(400).json({ message: validationError })
  }

  const user = db.users.find((item) => item.email === email)
  const hasHashedPassword = user?.password?.startsWith('$2')
  const passwordIsValid = hasHashedPassword
    ? await bcrypt.compare(req.body.password || '', user.password)
    : user?.password === req.body.password

  if (!user || !passwordIsValid) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  if (!hasHashedPassword) {
    user.password = await bcrypt.hash(req.body.password, 10)
    await saveDb(db)
  }

  return res.json({ user: removePassword(user), token: createToken(user) })
}

export function me(req, res) {
  res.json({ user: removePassword(req.user) })
}

export async function forgotPassword(req, res) {
  const db = await getDb()
  const email = req.body.email?.trim().toLowerCase()
  const user = db.users.find((item) => item.email === email)

  if (user) {
    user.resetPassword = {
      code: makeCode(),
      expiresAt: expiresInMinutes(15),
    }
    await saveDb(db)
    const emailResult = await sendAccountEmail({
      to: user.email,
      subject: 'Reset your SHOPNOVA password',
      text: `Your SHOPNOVA password reset code is ${user.resetPassword.code}. It expires in 15 minutes.`,
    })

    if (!emailResult.ok) {
      return res.status(503).json({ message: emailResult.message })
    }
  }

  return res.json({ message: 'If the email exists, a reset code has been sent.' })
}

export async function resetPassword(req, res) {
  const db = await getDb()
  const email = req.body.email?.trim().toLowerCase()
  const user = db.users.find((item) => item.email === email)

  if (!user || !codeIsValid(user.resetPassword, req.body.code)) {
    return res.status(400).json({ message: 'Invalid or expired reset code' })
  }

  if (!isStrongPassword(req.body.password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' })
  }

  user.password = await bcrypt.hash(req.body.password, 10)
  delete user.resetPassword
  await saveDb(db)
  return res.json({ message: 'Password reset successful' })
}

export async function verifyEmail(req, res) {
  const db = await getDb()
  const email = req.body.email?.trim().toLowerCase()
  const user = db.users.find((item) => item.email === email)

  if (!user || !codeIsValid(user.emailVerification, req.body.code)) {
    return res.status(400).json({ message: 'Invalid or expired verification code' })
  }

  user.emailVerified = true
  delete user.emailVerification
  await saveDb(db)
  return res.json({ user: removePassword(user), message: 'Email verified' })
}

export async function sendVerification(req, res) {
  const db = await getDb()
  const email = req.body.email?.trim().toLowerCase()
  const user = db.users.find((item) => item.email === email)

  if (!user) return res.status(404).json({ message: 'User not found' })
  if (user.emailVerified) return res.json({ message: 'Email is already verified' })

  user.emailVerification = {
    code: makeCode(),
    expiresAt: expiresInMinutes(15),
  }
  await saveDb(db)
  const emailResult = await sendAccountEmail({
    to: user.email,
    subject: 'Verify your SHOPNOVA account',
    text: `Your SHOPNOVA verification code is ${user.emailVerification.code}. It expires in 15 minutes.`,
  })

  if (!emailResult.ok) {
    return res.status(503).json({ message: emailResult.message })
  }

  return res.json({ message: 'Verification code sent' })
}
