import cors from 'cors'
import express from 'express'
import { join } from 'node:path'
import { env } from './config/env.js'
import { mongoStatus } from './config/mongodb.js'
import adminRoutes from './modules/admin/admin.routes.js'
import authRoutes from './modules/auth/auth.routes.js'
import cartRoutes from './modules/cart/cart.routes.js'
import checkoutRoutes from './modules/checkout/checkout.routes.js'
import customerRoutes from './modules/customer/customer.routes.js'
import orderRoutes from './modules/orders/orders.routes.js'
import productRoutes from './modules/products/products.routes.js'
import uploadRoutes from './modules/uploads/uploads.routes.js'
import wishlistRoutes from './modules/wishlist/wishlist.routes.js'

const app = express()
const allowedOrigins = new Set([
  env.clientUrl,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
])

const isLocalDevOrigin = (origin) => {
  try {
    const { hostname, protocol } = new URL(origin)
    return protocol === 'http:' && (hostname === 'localhost' || hostname === '127.0.0.1')
  } catch {
    return false
  }
}

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin) || isLocalDevOrigin(origin)) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '8mb' }))
app.use('/uploads', express.static(join(process.cwd(), 'uploads')))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'SHOPNOVA API', database: mongoStatus() })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/customer', customerRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/checkout', checkoutRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/uploads', uploadRoutes)

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((error, _req, res, _next) => {
  res.status(error.status || 500).json({
    message: error.message || 'Server error',
  })
})

export default app
