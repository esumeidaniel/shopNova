import express from 'express'
import { requireAdmin, requireLogin } from '../../shared/auth.js'
import { upload } from '../../shared/upload.js'
import { uploadProductImage } from './uploads.controller.js'

const router = express.Router()

router.post('/product-image', requireLogin, requireAdmin, upload.single('image'), uploadProductImage)

export default router
