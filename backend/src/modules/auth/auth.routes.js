import express from 'express'
import { requireLogin } from '../../shared/auth.js'
import { login, me, register } from './auth.controller.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', requireLogin, me)

export default router
