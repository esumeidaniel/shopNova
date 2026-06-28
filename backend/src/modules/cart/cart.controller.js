import { saveDb } from '../../shared/db.js'

export function getCart(req, res) {
  res.json({ cart: req.user.cart || [] })
}

export async function saveCart(req, res) {
  req.user.cart = Array.isArray(req.body.cart) ? req.body.cart : []
  await saveDb(req.db)
  res.json({ cart: req.user.cart })
}

export async function clearCart(req, res) {
  req.user.cart = []
  await saveDb(req.db)
  res.json({ cart: req.user.cart })
}
