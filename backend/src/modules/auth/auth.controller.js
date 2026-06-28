import bcrypt from 'bcryptjs'
import { createToken } from '../../shared/auth.js'
import { getDb, removePassword, saveDb } from '../../shared/db.js'

export async function register(req, res) {
  const db = await getDb()
  const email = req.body.email?.trim().toLowerCase()

  if (!email || !req.body.password) {
    return res.status(400).json({ message: 'Email and password are required' })
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
  return res.status(201).json({ user: removePassword(user), token: createToken(user) })
}

export async function login(req, res) {
  const db = await getDb()
  const email = req.body.email?.trim().toLowerCase()
  const user = db.users.find((item) => item.email === email)
  const passwordIsValid = user?.password?.startsWith('$2')
    ? await bcrypt.compare(req.body.password || '', user.password)
    : user?.password === req.body.password

  if (!user || !passwordIsValid) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  return res.json({ user: removePassword(user), token: createToken(user) })
}

export function me(req, res) {
  res.json({ user: removePassword(req.user) })
}
