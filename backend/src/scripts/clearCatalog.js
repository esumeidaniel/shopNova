import { getDb, saveDb } from '../shared/db.js'
import mongoose from 'mongoose'

const db = await getDb()

db.products = []
db.categories = []
db.orders = []
db.coupons = []
db.messages = []
db.users = (db.users || [])
  .filter((user) => user.role === 'admin')
  .map((user) => ({
    ...user,
    cart: [],
    wishlist: [],
  }))

await saveDb(db)

console.log('SHOPNOVA store reset. Products, categories, customers, orders, coupons, messages, carts, and wishlists are now empty. Admin users were kept.')

await mongoose.disconnect()
