import express from 'express'
import { requireLogin } from '../../shared/auth.js'
import { addWishlistItem, getWishlist, removeWishlistItem } from './wishlist.controller.js'

const router = express.Router()

router.use(requireLogin)

router.get('/', getWishlist)
router.post('/', addWishlistItem)
router.delete('/:productId', removeWishlistItem)

export default router
