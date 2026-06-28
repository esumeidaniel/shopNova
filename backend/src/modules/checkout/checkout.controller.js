import { saveDb } from '../../shared/db.js'
import { moneyToNumber, numberToMoney } from '../../shared/helpers.js'

export async function placeOrder(req, res) {
  if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
    return res.status(400).json({ message: 'Checkout requires at least one item' })
  }

  const subtotal = req.body.items.reduce((total, item) => total + moneyToNumber(item.price) * Number(item.quantity || 1), 0)
  const discount = Math.min(45000, Math.round(subtotal * 0.03))
  const deliveryFee = subtotal > 0 ? 2500 : 0
  const total = subtotal - discount + deliveryFee

  const order = {
    id: `SN${Date.now().toString().slice(-6)}`,
    userId: req.user.id,
    customer: `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email,
    items: req.body.items,
    status: 'Processing',
    subtotal: numberToMoney(subtotal),
    discount: numberToMoney(discount),
    deliveryFee: numberToMoney(deliveryFee),
    total: numberToMoney(total),
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    deliveryAddress: req.body.deliveryAddress || '',
    paymentMethod: req.body.paymentMethod || 'Paystack Card',
  }

  req.db.orders.unshift(order)
  req.user.cart = []
  await saveDb(req.db)
  return res.status(201).json({ order })
}
