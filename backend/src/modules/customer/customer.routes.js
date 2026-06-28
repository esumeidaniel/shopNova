import express from 'express'
import { requireLogin } from '../../shared/auth.js'
import {
  addWishlistItem,
  createAddress,
  deleteAddress,
  getCart,
  getProfile,
  getWishlist,
  listAddresses,
  listOrders,
  removeWishlistItem,
  updateAddress,
  updateCart,
  updateProfile,
} from './customer.controller.js'

const router = express.Router()

router.use(requireLogin)

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.get('/addresses', listAddresses)
router.post('/addresses', createAddress)
router.patch('/addresses/:id', updateAddress)
router.delete('/addresses/:id', deleteAddress)
router.get('/wishlist', getWishlist)
router.post('/wishlist', addWishlistItem)
router.delete('/wishlist/:productId', removeWishlistItem)
router.get('/cart', getCart)
router.put('/cart', updateCart)
router.get('/orders', listOrders)

export default router
