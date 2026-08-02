import express from 'express'
import rateLimit from 'express-rate-limit'
import { requireLogin } from '../../shared/auth.js'
import { forgotPassword, login, me, register, resetPassword, sendVerification, verifyEmail } from './auth.controller.js'

const router = express.Router()
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many auth attempts. Please try again later.' },
})

router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.post('/forgot-password', authLimiter, forgotPassword)
router.post('/reset-password', authLimiter, resetPassword)
router.post('/send-verification', authLimiter, sendVerification)
router.post('/verify-email', authLimiter, verifyEmail)
router.get('/me', requireLogin, me)

export default router
