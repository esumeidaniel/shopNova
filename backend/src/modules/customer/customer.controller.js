import { removePassword, saveDb } from '../../shared/db.js'

export function getProfile(req, res) {
  res.json({ user: removePassword(req.user) })
}

export async function updateProfile(req, res) {
  Object.assign(req.user, {
    firstName: req.body.firstName ?? req.user.firstName,
    lastName: req.body.lastName ?? req.user.lastName,
    phone: req.body.phone ?? req.user.phone,
    dateOfBirth: req.body.dateOfBirth ?? req.user.dateOfBirth,
    gender: req.body.gender ?? req.user.gender,
    notifications: req.body.notifications ?? req.user.notifications,
  })

  await saveDb(req.db)
  res.json({ user: removePassword(req.user) })
}

export function listAddresses(req, res) {
  res.json({ addresses: req.user.addresses || [] })
}

export async function createAddress(req, res) {
  req.user.addresses ||= []

  const address = {
    id: `addr_${Date.now()}`,
    label: req.body.label || 'Address',
    fullName: req.body.fullName || '',
    phone: req.body.phone || '',
    address: req.body.address || '',
    city: req.body.city || '',
    state: req.body.state || '',
    deliveryInstructions: req.body.deliveryInstructions || '',
    isDefault: req.user.addresses.length === 0 || Boolean(req.body.isDefault),
  }

  if (address.isDefault) req.user.addresses.forEach((item) => { item.isDefault = false })
  req.user.addresses.push(address)
  await saveDb(req.db)
  res.status(201).json({ address })
}

export async function updateAddress(req, res) {
  const index = req.user.addresses.findIndex((item) => item.id === req.params.id)
  if (index === -1) return res.status(404).json({ message: 'Address not found' })
  if (req.body.isDefault) req.user.addresses.forEach((item) => { item.isDefault = false })

  req.user.addresses[index] = { ...req.user.addresses[index], ...req.body, id: req.params.id }
  await saveDb(req.db)
  return res.json({ address: req.user.addresses[index] })
}

export async function deleteAddress(req, res) {
  req.user.addresses = req.user.addresses.filter((item) => item.id !== req.params.id)
  await saveDb(req.db)
  res.json({ message: 'Address deleted' })
}

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
  req.user.wishlist = req.user.wishlist.filter((id) => id !== req.params.productId)
  await saveDb(req.db)
  res.json({ wishlist: req.user.wishlist })
}

export function getCart(req, res) {
  res.json({ cart: req.user.cart || [] })
}

export async function updateCart(req, res) {
  req.user.cart = Array.isArray(req.body.cart) ? req.body.cart : []
  await saveDb(req.db)
  res.json({ cart: req.user.cart })
}

export function listOrders(req, res) {
  res.json({ orders: req.db.orders.filter((order) => order.userId === req.user.id) })
}
