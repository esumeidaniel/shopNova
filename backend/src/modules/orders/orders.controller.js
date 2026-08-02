import { saveDb } from '../../shared/db.js'
import { createOrderFromCart } from '../../shared/orders.js'
import { env } from '../../config/env.js'

export function listOrders(req, res) {
  res.json({ orders: req.db.orders.filter((order) => order.userId === req.user.id) })
}

export function getOrder(req, res) {
  const order = req.db.orders.find((item) => item.id === req.params.id && item.userId === req.user.id)
  if (!order) return res.status(404).json({ message: 'Order not found' })
  return res.json({ order })
}

export function downloadInvoice(req, res) {
  const order = req.db.orders.find((item) => item.id === req.params.id && item.userId === req.user.id)
  if (!order) return res.status(404).json({ message: 'Order not found' })

  const rows = (order.items || []).map((item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity || 1}</td>
      <td>${item.price}</td>
    </tr>
  `).join('')

  const html = `<!doctype html>
    <html>
      <head><meta charset="utf-8"><title>SHOPNOVA Invoice ${order.id}</title></head>
      <body style="font-family: Arial, sans-serif; color: #071c46;">
        <h1>SHOPNOVA Invoice</h1>
        <p><strong>Order:</strong> ${order.id}</p>
        <p><strong>Customer:</strong> ${order.customer}</p>
        <p><strong>Date:</strong> ${order.date}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%;">
          <thead><tr><th align="left">Item</th><th align="left">Qty</th><th align="left">Price</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <h2>Total: ${order.total}</h2>
        <p>Payment: ${order.paymentMethod}</p>
      </body>
    </html>`

  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Disposition', `attachment; filename="shopnova-invoice-${order.id}.html"`)
  return res.send(html)
}

export async function createOrder(req, res) {
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
