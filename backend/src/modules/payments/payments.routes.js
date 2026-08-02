import express from 'express'
import { requireLogin } from '../../shared/auth.js'
import { initializePaystack, verifyPaystack } from './payments.controller.js'

const router = express.Router()

router.use(requireLogin)
router.post('/paystack/initialize', initializePaystack)
router.post('/paystack/verify', verifyPaystack)
router.post('/paystack/verify/:reference', verifyPaystack)

export default router
