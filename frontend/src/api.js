const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000/api'
const TOKEN_KEY = 'shopnova-token'
const USER_KEY = 'shopnova-user'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  } catch {
    return null
  }
}

export function storeSession({ token, user }) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem('shopnova-auth')
  localStorage.removeItem('shopnova-user-email')
}

export async function apiRequest(path, options = {}) {
  const token = options.token ?? getStoredToken()
  const isFormData = options.body instanceof FormData
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: isFormData || typeof options.body === 'string' ? options.body : options.body ? JSON.stringify(options.body) : undefined,
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

export const api = {
  login: (body) => apiRequest('/auth/login', { method: 'POST', body }),
  register: (body) => apiRequest('/auth/register', { method: 'POST', body }),
  me: () => apiRequest('/auth/me'),
  products: (query = '') => apiRequest(`/products${query}`),
  productCategories: () => apiRequest('/products/meta/categories'),
  product: (id) => apiRequest(`/products/${id}`),
  profile: () => apiRequest('/customer/profile'),
  updateProfile: (body) => apiRequest('/customer/profile', { method: 'PUT', body }),
  addresses: () => apiRequest('/customer/addresses'),
  createAddress: (body) => apiRequest('/customer/addresses', { method: 'POST', body }),
  updateAddress: (id, body) => apiRequest(`/customer/addresses/${id}`, { method: 'PATCH', body }),
  deleteAddress: (id) => apiRequest(`/customer/addresses/${id}`, { method: 'DELETE' }),
  cart: () => apiRequest('/cart'),
  saveCart: (cart) => apiRequest('/cart', { method: 'PUT', body: { cart } }),
  clearCart: () => apiRequest('/cart', { method: 'DELETE' }),
  wishlist: () => apiRequest('/wishlist'),
  addWishlist: (productId) => apiRequest('/wishlist', { method: 'POST', body: { productId } }),
  removeWishlist: (productId) => apiRequest(`/wishlist/${productId}`, { method: 'DELETE' }),
  orders: () => apiRequest('/orders'),
  order: (id) => apiRequest(`/orders/${id}`),
  createOrder: (body) => apiRequest('/orders', { method: 'POST', body }),
  adminDashboard: () => apiRequest('/admin/dashboard'),
  adminOrders: () => apiRequest('/admin/orders'),
  adminOrder: (id) => apiRequest(`/admin/orders/${id}`),
  updateAdminOrder: (id, body) => apiRequest(`/admin/orders/${id}`, { method: 'PATCH', body }),
  adminCustomers: () => apiRequest('/admin/customers'),
  adminCategories: () => apiRequest('/admin/categories'),
  createCategory: (body) => apiRequest('/admin/categories', { method: 'POST', body }),
  updateCategory: (id, body) => apiRequest(`/admin/categories/${id}`, { method: 'PATCH', body }),
  adminInventory: () => apiRequest('/admin/inventory'),
  adminCoupons: () => apiRequest('/admin/coupons'),
  createCoupon: (body) => apiRequest('/admin/coupons', { method: 'POST', body }),
  updateCoupon: (id, body) => apiRequest(`/admin/coupons/${id}`, { method: 'PATCH', body }),
  adminSettings: () => apiRequest('/admin/settings'),
  updateAdminSettings: (body) => apiRequest('/admin/settings', { method: 'PUT', body }),
  uploadProductImage: (formData) => apiRequest('/uploads/product-image', { method: 'POST', body: formData }),
  createProduct: (body) => apiRequest('/products', { method: 'POST', body }),
  updateProduct: (id, body) => apiRequest(`/products/${id}`, { method: 'PATCH', body }),
  deleteProduct: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
}
