import { moneyToNumber, numberToMoney } from './helpers.js'

export function calculateCouponDiscount(coupon, subtotal) {
  const rawDiscount = String(coupon.discount || '').trim()

  if (rawDiscount.endsWith('%')) {
    const percent = Number(rawDiscount.replace('%', ''))
    return Math.max(0, Math.round((subtotal * percent) / 100))
  }

  return Math.max(0, moneyToNumber(rawDiscount))
}

export function validateCoupon(db, code, subtotal = 0) {
  const coupon = (db.coupons || []).find((item) => item.code?.toLowerCase() === String(code || '').trim().toLowerCase())
  if (!coupon) return { error: 'Coupon not found' }
  if (coupon.status !== 'Active') return { error: 'Coupon is not active' }
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) return { error: 'Coupon has expired' }
  if (coupon.usageLimit && Number(coupon.usage || 0) >= Number(coupon.usageLimit)) return { error: 'Coupon usage limit reached' }

  const discountValue = Math.min(calculateCouponDiscount(coupon, subtotal), subtotal)
  return {
    coupon,
    discountValue,
    formattedDiscount: numberToMoney(discountValue),
  }
}
