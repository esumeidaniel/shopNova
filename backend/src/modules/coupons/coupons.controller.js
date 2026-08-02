import { getDb } from '../../shared/db.js'
import { moneyToNumber } from '../../shared/helpers.js'
import { validateCoupon } from '../../shared/coupons.js'

export async function validateCouponCode(req, res) {
  const db = await getDb()
  const subtotal = Number(req.body.subtotal || moneyToNumber(req.body.formattedSubtotal || ''))
  const result = validateCoupon(db, req.body.code, subtotal)

  if (result.error) return res.status(400).json({ message: result.error })

  return res.json({
    coupon: {
      id: result.coupon.id,
      code: result.coupon.code,
      discount: result.coupon.discount,
    },
    discountValue: result.discountValue,
    formattedDiscount: result.formattedDiscount,
  })
}
