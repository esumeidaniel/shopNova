import { getDb, saveDb } from '../shared/db.js'

const db = await getDb()

db.products = []
db.orders = []
db.coupons = []
db.users = (db.users || []).map((user) => ({
  ...user,
  cart: [],
  wishlist: [],
}))

await saveDb(db)

console.log('SHOPNOVA catalog cleared. Products, orders, coupons, carts, and wishlists are now empty.')
