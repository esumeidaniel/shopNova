import { env } from '../../config/env.js'
import { saveDb } from '../../shared/db.js'
import { moneyToNumber } from '../../shared/helpers.js'

const PAYSTACK_CURRENCY = 'NGN'

function findOwnedOrder(req, orderId) {
  return req.db.orders.find((order) => order.id === orderId && order.userId === req.user.id)
}

function expectedAmount(order) {
  return Math.round(moneyToNumber(order.total) * 100)
}

export function paymentMatchesOrder({ payment, reference, order, user }) {
  return payment.status === 'success'
    && payment.reference === reference
    && Number(payment.amount) === expectedAmount(order)
    && payment.currency === PAYSTACK_CURRENCY
    && String(payment.customer?.email || '').toLowerCase() === String(user.email).toLowerCase()
    && payment.metadata?.orderId === order.id
    && payment.metadata?.userId === user.id
}

async function paystackRequest(path, options = {}) {
  if (!env.paystackSecretKey) {
    const error = new Error('Paystack is not configured')
    error.status = 503
    throw error
  }

  const response = await fetch(`https://api.paystack.co${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${env.paystackSecretKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.status === false) {
    const error = new Error(data.message || 'Paystack request failed')
    error.status = response.status
    throw error
  }

  return data
}

export async function initializePaystack(req, res) {
  const order = findOwnedOrder(req, req.body.orderId)
  if (!order) return res.status(404).json({ message: 'Order not found' })
  if (order.paymentMethod !== 'Paystack Card' || order.paymentStatus === 'Paid') {
    return res.status(409).json({ message: 'This order cannot start a Paystack payment' })
  }

  const amount = expectedAmount(order)
  if (amount < 100) return res.status(400).json({ message: 'Order total is invalid' })

  const data = await paystackRequest('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email: req.user.email,
      amount,
      currency: PAYSTACK_CURRENCY,
      callback_url: req.body.callbackUrl,
      metadata: {
        userId: req.user.id,
        orderId: order.id,
      },
    }),
  })

  order.paymentReference = data.data.reference
  order.paymentInitializedAt = new Date().toISOString()
  await saveDb(req.db)
  return res.json({ payment: data.data })
}

export async function verifyPaystack(req, res) {
  const reference = req.params.reference || req.body.reference
  if (!reference) return res.status(400).json({ message: 'Payment reference is required' })
  const order = findOwnedOrder(req, req.body.orderId)
  if (!order) return res.status(404).json({ message: 'Order not found' })
  if (order.paymentStatus === 'Paid') {
    if (order.paymentReference === reference) return res.json({ paid: true, alreadyProcessed: true })
    return res.status(409).json({ message: 'Order is already paid with a different reference' })
  }
  if (!order.paymentReference || order.paymentReference !== reference) {
    return res.status(400).json({ message: 'Payment reference does not belong to this order' })
  }
  const reused = req.db.orders.some((item) => item.id !== order.id && item.paymentReference === reference)
  if (reused) return res.status(409).json({ message: 'Payment reference has already been used' })

  const data = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`)
  const payment = data.data || {}
  const paid = paymentMatchesOrder({ payment, reference, order, user: req.user })

  if (!paid) return res.status(400).json({ message: 'Paystack payment details do not match this order', paid: false })

  order.paymentStatus = 'Paid'
  order.paidAt = payment.paid_at || new Date().toISOString()
  order.status = order.status === 'Pending Payment' ? 'Processing' : order.status
  await saveDb(req.db)

  return res.json({ paid: true, payment })
}
