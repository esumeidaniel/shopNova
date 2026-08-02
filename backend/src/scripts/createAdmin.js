import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import { getDb, saveDb } from '../shared/db.js'
import { isEmail, isStrongPassword } from '../shared/validation.js'

const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase()
const password = String(process.env.ADMIN_PASSWORD || '')

if (!isEmail(email) || !isStrongPassword(password) || password.length < 12) {
  throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters')
}

const db = await getDb()
const existing = db.users.find((user) => user.email.toLowerCase() === email)

if (existing) {
  existing.role = 'admin'
  existing.password = await bcrypt.hash(password, 12)
  existing.emailVerified = true
} else {
  db.users.push({
    id: `user_${crypto.randomUUID()}`,
    email,
    password: await bcrypt.hash(password, 12),
    role: 'admin',
    firstName: 'Store',
    lastName: 'Admin',
    phone: '',
    emailVerified: true,
    addresses: [],
    wishlist: [],
    cart: [],
    notifications: {},
    createdAt: new Date().toISOString(),
  })
}

await saveDb(db)
console.log(`Admin account ready: ${email}`)
process.exit(0)
