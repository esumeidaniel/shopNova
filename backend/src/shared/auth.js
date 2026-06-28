import jwt from 'jsonwebtoken'
import { getDb } from './db.js'

const jwtSecret = process.env.JWT_SECRET || 'shopnova-local-secret'

export function createToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '7d' })
}

export async function requireLogin(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

  if (!token) {
    return res.status(401).json({ message: 'Please log in first' })
  }

  try {
    const payload = jwt.verify(token, jwtSecret)
    const db = await getDb()
    const user = db.users.find((item) => item.id === payload.id)

    if (!user) {
      return res.status(401).json({ message: 'Invalid login session' })
    }

    req.db = db
    req.user = user
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid login session' })
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }

  return next()
}
