import assert from 'node:assert/strict'
import test from 'node:test'
import { getOrder } from '../src/modules/orders/orders.controller.js'
import { paymentMatchesOrder } from '../src/modules/payments/payments.controller.js'
import { requireAdmin } from '../src/shared/auth.js'

function response() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this },
    json(body) { this.body = body; return this },
  }
}

test('Paystack verification binds every critical field to the exact order', () => {
  const user = { id: 'user-1', email: 'buyer@example.com' }
  const order = { id: 'SN-1', total: '₦12,500' }
  const payment = {
    status: 'success', reference: 'ref-1', amount: 1250000, currency: 'NGN',
    customer: { email: user.email }, metadata: { userId: user.id, orderId: order.id },
  }
  assert.equal(paymentMatchesOrder({ payment, reference: 'ref-1', order, user }), true)
  assert.equal(paymentMatchesOrder({ payment: { ...payment, amount: 1250001 }, reference: 'ref-1', order, user }), false)
  assert.equal(paymentMatchesOrder({ payment: { ...payment, metadata: { ...payment.metadata, orderId: 'SN-2' } }, reference: 'ref-1', order, user }), false)
  assert.equal(paymentMatchesOrder({ payment: { ...payment, customer: { email: 'other@example.com' } }, reference: 'ref-1', order, user }), false)
})

test('customer order lookup does not expose another customer order', () => {
  const req = { params: { id: 'SN-1' }, user: { id: 'user-2' }, db: { orders: [{ id: 'SN-1', userId: 'user-1' }] } }
  const res = response()
  getOrder(req, res)
  assert.equal(res.statusCode, 404)
})

test('admin middleware rejects customers and allows admins', () => {
  const denied = response()
  requireAdmin({ user: { role: 'customer' } }, denied, () => assert.fail('customer reached admin handler'))
  assert.equal(denied.statusCode, 403)
  let called = false
  requireAdmin({ user: { role: 'admin' } }, response(), () => { called = true })
  assert.equal(called, true)
})
