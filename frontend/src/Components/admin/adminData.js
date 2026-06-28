export const adminStats = [
  { label: 'Total Sales', value: '₦8.42m', change: '+18%' },
  { label: 'Orders Today', value: '42', change: '+9%' },
  { label: 'Pending Orders', value: '11', change: 'Needs review' },
  { label: 'Low Stock Items', value: '7', change: 'Restock soon' },
]

export const adminOrders = [
  { id: 'SN2088', customer: 'Ada Okafor', product: 'Samsung TV + 2 items', total: '₦450,000', status: 'Processing', date: '28 Jun 2026' },
  { id: 'SN2072', customer: 'Daniel Chinonso', product: 'AirPods Pro', total: '₦285,000', status: 'Delivered', date: '27 Jun 2026' },
  { id: 'SN2065', customer: 'Maya James', product: 'Dell Monitor 27"', total: '₦180,000', status: 'Shipped', date: '27 Jun 2026' },
  { id: 'SN2055', customer: 'Ife Adams', product: 'iPhone Case', total: '₦18,000', status: 'Cancelled', date: '26 Jun 2026' },
]

export const adminProducts = [
  { name: 'iPhone 15 Pro Max', category: 'Phones', price: '₦1,340,000', stock: 18, status: 'Active' },
  { name: 'HP EliteBook 840 G8', category: 'Laptops', price: '₦620,000', stock: 9, status: 'Active' },
  { name: 'Oraimo Power Bank 30000mAh', category: 'Accessories', price: '₦31,500', stock: 4, status: 'Low Stock' },
  { name: 'JBL Tune Headphones', category: 'Audio', price: '₦55,000', stock: 21, status: 'Active' },
  { name: 'Hisense 43" Smart TV', category: 'Smart TVs', price: '₦285,000', stock: 6, status: 'Active' },
]

export const adminCustomers = [
  { name: 'Ada Okafor', email: 'ada@example.com', orders: 24, spent: '₦1,358,000', status: 'Active' },
  { name: 'Daniel Chinonso', email: 'daniel@example.com', orders: 12, spent: '₦890,000', status: 'Active' },
  { name: 'Maya James', email: 'maya@example.com', orders: 5, spent: '₦210,000', status: 'New' },
  { name: 'Ife Adams', email: 'ife@example.com', orders: 8, spent: '₦342,000', status: 'Active' },
]

export const adminCategories = [
  { name: 'Phones', products: 42, featured: 'Yes' },
  { name: 'Laptops', products: 18, featured: 'Yes' },
  { name: 'Accessories', products: 64, featured: 'Yes' },
  { name: 'Audio', products: 22, featured: 'No' },
  { name: 'Smart TVs', products: 12, featured: 'No' },
  { name: 'Tablets', products: 10, featured: 'No' },
]

export const inventoryAlerts = [
  { product: 'Oraimo Power Bank 30000mAh', sku: 'SN-PB-30000', stock: 4, reorder: 20 },
  { product: 'Anker USB-C Cable', sku: 'SN-CBL-USB-C', stock: 5, reorder: 30 },
  { product: 'Noise Smart Watch', sku: 'SN-SW-09', stock: 6, reorder: 18 },
  { product: 'Hisense 43" Smart TV', sku: 'SN-TV-43', stock: 6, reorder: 10 },
]

export const coupons = [
  { code: 'NOVA10', discount: '10%', usage: '84 used', status: 'Active' },
  { code: 'WELCOME5', discount: '5%', usage: '126 used', status: 'Active' },
  { code: 'TECH40', discount: '40%', usage: '18 used', status: 'Scheduled' },
]
