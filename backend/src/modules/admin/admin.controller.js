import { removePassword, saveDb } from '../../shared/db.js'
import { moneyToNumber, numberToMoney, slugify } from '../../shared/helpers.js'

export function getDashboard(req, res) {
  const totalSales = req.db.orders.reduce((total, order) => total + moneyToNumber(order.total), 0)

  res.json({
    stats: {
      totalSales: numberToMoney(totalSales),
      totalOrders: req.db.orders.length,
      pendingOrders: req.db.orders.filter((order) => ['Pending', 'Processing'].includes(order.status)).length,
      lowStockItems: req.db.products.filter((product) => product.stock <= 5).length,
    },
    recentOrders: req.db.orders.slice(0, 5),
    lowStock: req.db.products.filter((product) => product.stock <= 5),
  })
}

export function listOrders(req, res) {
  res.json({ orders: req.db.orders })
}

export function getOrder(req, res) {
  const order = req.db.orders.find((item) => item.id === req.params.id)
  if (!order) return res.status(404).json({ message: 'Order not found' })
  return res.json({ order })
}

export async function updateOrder(req, res) {
  const order = req.db.orders.find((item) => item.id === req.params.id)
  if (!order) return res.status(404).json({ message: 'Order not found' })

  order.status = req.body.status || order.status
  await saveDb(req.db)
  return res.json({ order })
}

export function listCustomers(req, res) {
  res.json({ customers: req.db.users.filter((user) => user.role === 'customer').map(removePassword) })
}

export function listCategories(req, res) {
  res.json({ categories: req.db.categories })
}

export async function createCategory(req, res) {
  if (!req.body.name) return res.status(400).json({ message: 'Category name is required' })

  const category = {
    id: slugify(req.body.name),
    name: req.body.name,
    featured: Boolean(req.body.featured),
  }

  req.db.categories.push(category)
  await saveDb(req.db)
  return res.status(201).json({ category })
}

export async function updateCategory(req, res) {
  const category = req.db.categories.find((item) => item.id === req.params.id)
  if (!category) return res.status(404).json({ message: 'Category not found' })

  Object.assign(category, req.body)
  await saveDb(req.db)
  return res.json({ category })
}

export async function deleteCategory(req, res) {
  req.db.categories = req.db.categories.filter((item) => item.id !== req.params.id)
  await saveDb(req.db)
  res.json({ message: 'Category deleted' })
}

export function listInventory(req, res) {
  res.json({
    inventory: req.db.products.map(({ id, name, stock, status }) => ({ id, name, stock, status })),
  })
}

export function listCoupons(req, res) {
  res.json({ coupons: req.db.coupons })
}

export async function createCoupon(req, res) {
  const coupon = {
    id: `coupon_${Date.now()}`,
    usage: 0,
    status: 'Active',
    ...req.body,
  }

  req.db.coupons.push(coupon)
  await saveDb(req.db)
  return res.status(201).json({ coupon })
}

export async function updateCoupon(req, res) {
  const coupon = req.db.coupons.find((item) => item.id === req.params.id)
  if (!coupon) return res.status(404).json({ message: 'Coupon not found' })

  Object.assign(coupon, req.body)
  await saveDb(req.db)
  return res.json({ coupon })
}

export function getSettings(req, res) {
  res.json({ settings: req.db.settings })
}

export async function updateSettings(req, res) {
  req.db.settings = { ...req.db.settings, ...req.body }
  await saveDb(req.db)
  res.json({ settings: req.db.settings })
}
