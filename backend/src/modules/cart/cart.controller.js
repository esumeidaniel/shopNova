import { saveDb } from '../../shared/db.js'

export function getCart(req, res) {
  res.json({ cart: req.user.cart || [] })
}

export async function saveCart(req, res) {
  const nextCart = Array.isArray(req.body.cart) ? req.body.cart : []

  for (const item of nextCart) {
    const product = req.db.products.find((entry) => entry.id === item.id || entry.id === item.productId)
    if (!product) return res.status(400).json({ message: `${item.name || 'Product'} is no longer available` })
    if (Number(item.quantity || 1) > Number(product.stock || 0)) {
      return res.status(400).json({ message: `${product.name} only has ${product.stock || 0} in stock` })
    }
  }

  req.user.cart = nextCart
  await saveDb(req.db)
  res.json({ cart: req.user.cart })
}

export async function clearCart(req, res) {
  req.user.cart = []
  await saveDb(req.db)
  res.json({ cart: req.user.cart })
}
