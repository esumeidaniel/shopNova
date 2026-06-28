import express from 'express'
import { requireLogin } from '../../shared/auth.js'
import { createOrder, getOrder, listOrders } from './orders.controller.js'

const router = express.Router()

router.use(requireLogin)

router.get('/', listOrders)
router.post('/', createOrder)
router.get('/:id', getOrder)

export default router
