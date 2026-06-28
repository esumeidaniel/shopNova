import express from 'express'
import { requireLogin } from '../../shared/auth.js'
import { clearCart, getCart, saveCart } from './cart.controller.js'

const router = express.Router()

router.use(requireLogin)

router.get('/', getCart)
router.put('/', saveCart)
router.delete('/', clearCart)

export default router
