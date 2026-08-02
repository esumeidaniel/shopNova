import { saveDb } from '../../shared/db.js'
import { createOrderFromCart } from '../../shared/orders.js'
import { env } from '../../config/env.js'

export async function placeOrder(req, res) {
  try {
    if (env.requireEmailVerification && req.user.emailVerified === false) {
      return res.status(403).json({ message: 'Please verify your email before checkout' })
    }

    const order = createOrderFromCart({ db: req.db, user: req.user, body: req.body })
    req.db.orders.unshift(order)
    req.user.cart = []
    await saveDb(req.db)
    return res.status(201).json({ order })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}
