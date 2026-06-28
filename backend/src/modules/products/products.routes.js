import express from 'express'
import { requireAdmin, requireLogin } from '../../shared/auth.js'
import { createProduct, deleteProduct, getProduct, listCategories, listProducts, updateProduct } from './products.controller.js'

const router = express.Router()

router.get('/', listProducts)
router.get('/meta/categories', listCategories)
router.get('/:id', getProduct)
router.post('/', requireLogin, requireAdmin, createProduct)
router.patch('/:id', requireLogin, requireAdmin, updateProduct)
router.delete('/:id', requireLogin, requireAdmin, deleteProduct)

export default router
