import express from 'express'
import { requireAdmin, requireLogin } from '../../shared/auth.js'
import {
  createCategory,
  createCoupon,
  deleteCategory,
  getDashboard,
  getOrder,
  getSettings,
  listCategories,
  listCoupons,
  listCustomers,
  listInventory,
  listOrders,
  updateCategory,
  updateCoupon,
  updateOrder,
  updateSettings,
} from './admin.controller.js'

const router = express.Router()

router.use(requireLogin, requireAdmin)

router.get('/dashboard', getDashboard)
router.get('/orders', listOrders)
router.get('/orders/:id', getOrder)
router.patch('/orders/:id', updateOrder)
router.get('/customers', listCustomers)
router.get('/categories', listCategories)
router.post('/categories', createCategory)
router.patch('/categories/:id', updateCategory)
router.delete('/categories/:id', deleteCategory)
router.get('/inventory', listInventory)
router.get('/coupons', listCoupons)
router.post('/coupons', createCoupon)
router.patch('/coupons/:id', updateCoupon)
router.get('/settings', getSettings)
router.put('/settings', updateSettings)

export default router
