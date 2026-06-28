import { saveDb } from '../../shared/db.js'

export function getWishlist(req, res) {
  res.json({ wishlist: req.user.wishlist || [] })
}

export async function addWishlistItem(req, res) {
  req.user.wishlist ||= []

  if (!req.body.productId) return res.status(400).json({ message: 'productId is required' })
  if (!req.user.wishlist.includes(req.body.productId)) req.user.wishlist.push(req.body.productId)

  await saveDb(req.db)
  return res.json({ wishlist: req.user.wishlist })
}

export async function removeWishlistItem(req, res) {
  req.user.wishlist = (req.user.wishlist || []).filter((id) => id !== req.params.productId)
  await saveDb(req.db)
  res.json({ wishlist: req.user.wishlist })
}
