import express from 'express'
import { validateCouponCode } from './coupons.controller.js'

const router = express.Router()

router.post('/validate', validateCouponCode)

export default router
