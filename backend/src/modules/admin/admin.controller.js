import { removePassword, saveDb } from '../../shared/db.js'
import { moneyToNumber, numberToMoney, slugify } from '../../shared/helpers.js'
import { orderStatuses, orderStatusTransitions } from '../../shared/validation.js'

export function getDashboard(req, res) {
  const totalSales = req.db.orders.reduce((total, order) => total + moneyToNumber(order.total), 0)
  const today = new Date()
  const salesChart = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))
    const key = date.toISOString().slice(0, 10)
    const dayOrders = req.db.orders.filter((order) => (order.createdAt || '').slice(0, 10) === key)

    return {
      date: key,
      sales: dayOrders.reduce((total, order) => total + moneyToNumber(order.total), 0),
      orders: dayOrders.length,
    }
  })

  res.json({
    stats: {
      totalSales: numberToMoney(totalSales),
      totalOrders: req.db.orders.length,
      totalProducts: req.db.products.length,
      totalCustomers: req.db.users.filter((user) => user.role === 'customer').length,
      pendingOrders: req.db.orders.filter((order) => ['Pending', 'Processing'].includes(order.status)).length,
      lowStockItems: req.db.products.filter((product) => product.stock <= 5).length,
    },
    recentOrders: req.db.orders.slice(0, 5),
    lowStock: req.db.products.filter((product) => product.stock <= 5),
    salesChart,
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

  if (req.body.status && !orderStatuses.includes(req.body.status)) {
    return res.status(400).json({ message: 'Invalid order status' })
  }

  if (req.body.status && req.body.status !== order.status && !orderStatusTransitions[order.status]?.includes(req.body.status)) {
    return res.status(409).json({ message: `Order cannot move from ${order.status} to ${req.body.status}` })
  }

  order.status = req.body.status || order.status
  await saveDb(req.db)
  return res.json({ order })
}

export function exportOrders(req, res) {
  const header = ['Order ID', 'Customer', 'Status', 'Total', 'Date', 'Payment Method']
  const rows = req.db.orders.map((order) => [
    order.id,
    order.customer,
    order.status,
    order.total,
    order.date,
    order.paymentMethod,
  ])
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell || '').replaceAll('"', '""')}"`).join(','))
    .join('\n')

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="shopnova-orders.csv"')
  return res.send(csv)
}

export function listCustomers(req, res) {
  res.json({ customers: req.db.users.filter((user) => user.role === 'customer').map(removePassword) })
}

export function listReviews(req, res) {
  res.json({ reviews: req.db.reviews || [] })
}

export async function updateReview(req, res) {
  const review = (req.db.reviews || []).find((item) => item.id === req.params.id)
  if (!review) return res.status(404).json({ message: 'Review not found' })
  if (!['Pending', 'Published', 'Hidden'].includes(req.body.status)) {
    return res.status(400).json({ message: 'Invalid review status' })
  }
  review.status = req.body.status
  await saveDb(req.db)
  return res.json({ review })
}

export function listCategories(req, res) {
  res.json({ categories: req.db.categories })
}

export async function createCategory(req, res) {
  if (!req.body.name) return res.status(400).json({ message: 'Category name is required' })

  const category = {
    id: req.body.slug?.trim() || slugify(req.body.name),
    name: req.body.name,
    slug: req.body.slug?.trim() || slugify(req.body.name),
    description: req.body.description || '',
    image: req.body.image || '',
    icon: req.body.icon || '',
    visible: req.body.visible !== false,
    order: Number(req.body.order || req.db.categories.length),
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
  const category = req.db.categories.find((item) => item.id === req.params.id)
  if (!category) return res.status(404).json({ message: 'Category not found' })
  if (req.db.products.some((product) => product.category === category.name)) {
    return res.status(409).json({ message: 'Move products out of this category before deleting it' })
  }
  req.db.categories = req.db.categories.filter((item) => item.id !== req.params.id)
  await saveDb(req.db)
  res.json({ message: 'Category deleted' })
}

export function listInventory(req, res) {
  res.json({
    inventory: req.db.products.map(({ id, name, stock, status }) => ({ id, name, stock, status })),
  })
}

export async function updateInventoryItem(req, res) {
  const product = req.db.products.find((item) => item.id === req.params.id)
  if (!product) return res.status(404).json({ message: 'Product not found' })

  const stock = Number(req.body.stock)
  if (!Number.isFinite(stock) || stock < 0) {
    return res.status(400).json({ message: 'Valid stock number is required' })
  }

  product.stock = stock
  product.status = stock <= 0 ? 'Out of Stock' : stock <= 5 ? 'Low Stock' : 'Active'
  await saveDb(req.db)
  return res.json({ product })
}

export function listCoupons(req, res) {
  res.json({ coupons: req.db.coupons })
}

export async function createCoupon(req, res) {
  if (!req.body.code) return res.status(400).json({ message: 'Coupon code is required' })

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

export async function deleteCoupon(req, res) {
  const couponExists = req.db.coupons.some((item) => item.id === req.params.id)
  if (!couponExists) return res.status(404).json({ message: 'Coupon not found' })

  req.db.coupons = req.db.coupons.filter((item) => item.id !== req.params.id)
  await saveDb(req.db)
  return res.json({ message: 'Coupon deleted' })
}

export function getSettings(req, res) {
  res.json({ settings: req.db.settings })
}

export async function updateSettings(req, res) {
  req.db.settings = { ...req.db.settings, ...req.body }
  await saveDb(req.db)
  res.json({ settings: req.db.settings })
}
