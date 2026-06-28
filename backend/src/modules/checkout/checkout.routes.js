import express from 'express'
import { requireLogin } from '../../shared/auth.js'
import { placeOrder } from './checkout.controller.js'

const router = express.Router()

router.post('/', requireLogin, placeOrder)

export default router
