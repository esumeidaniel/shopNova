import crypto from 'node:crypto'
import { validateCoupon } from './coupons.js'
import { moneyToNumber, numberToMoney } from './helpers.js'
import { validateAddress } from './validation.js'

function orderId() {
  return `SN-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
}

function getDeliveryAddress(user, body) {
  if (body.deliveryAddress && typeof body.deliveryAddress === 'object') return body.deliveryAddress
  if (body.addressId) return (user.addresses || []).find((address) => address.id === body.addressId)
  return null
}

function normalizeItems(db, items = []) {
  return items.map((item) => {
    const product = db.products.find((entry) => entry.id === item.id || entry.id === item.productId)
    if (!product) {
      throw new Error(`${item.name || 'Product'} is no longer available`)
    }

    const quantity = Number(item.quantity || 1)
    if (quantity < 1) throw new Error('Quantity must be at least 1')
    if (Number(product.stock || 0) < quantity) {
      throw new Error(`${product.name} only has ${product.stock || 0} in stock`)
    }

    return {
      product,
      item: {
        productId: product.id,
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        options: item.options || {},
        quantity,
      },
    }
  })
}

export function createOrderFromCart({ db, user, body }) {
  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new Error('Order requires at least one item')
  }

  const address = getDeliveryAddress(user, body)
  const addressError = validateAddress(address || {})
  if (addressError) throw new Error(addressError)

  const normalizedItems = normalizeItems(db, body.items)
  const subtotal = normalizedItems.reduce((total, { item }) => total + moneyToNumber(item.price) * item.quantity, 0)
  const couponResult = body.couponCode ? validateCoupon(db, body.couponCode, subtotal) : null
  if (couponResult?.error) throw new Error(couponResult.error)
  const discount = couponResult ? couponResult.discountValue : 0
  const deliveryFee = body.deliveryMethod === 'Same-day ₦5,000' ? 5000 : body.deliveryMethod === 'Express ₦2,500' ? 2500 : 0
  const total = subtotal - discount + deliveryFee
  const paymentMethod = body.paymentMethod || 'Pay on Delivery'
  const status = paymentMethod === 'Pay on Delivery' ? 'Processing' : 'Pending Payment'

  normalizedItems.forEach(({ product, item }) => {
    product.stock = Math.max(0, Number(product.stock || 0) - item.quantity)
    product.status = product.stock <= 0 ? 'Out of Stock' : product.stock <= 5 ? 'Low Stock' : 'Active'
  })

  return {
    id: orderId(),
    userId: user.id,
    customer: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
    items: normalizedItems.map(({ item }) => item),
    status,
    paymentStatus: paymentMethod === 'Pay on Delivery' ? 'Pay on Delivery' : 'Pending',
    paymentReference: '',
    couponCode: body.couponCode || '',
    subtotal: numberToMoney(subtotal),
    discount: numberToMoney(discount),
    deliveryFee: numberToMoney(deliveryFee),
    total: numberToMoney(total),
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    createdAt: new Date().toISOString(),
    deliveryAddress: address,
    deliveryMethod: body.deliveryMethod || 'Standard free',
    paymentMethod,
  }
}
