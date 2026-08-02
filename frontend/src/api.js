const explicitApiUrl = import.meta.env.VITE_API_URL
export const API_BASE_URL = explicitApiUrl || (import.meta.env.DEV ? 'http://127.0.0.1:4000/api' : '')
const TOKEN_KEY = 'shopnova-token'
const USER_KEY = 'shopnova-user'
const localPreviewHosts = new Set(['localhost', '127.0.0.1', ''])

export const allowDemoFallback = import.meta.env.VITE_ENABLE_DEMO_FALLBACK === 'true'
  && localPreviewHosts.has(window.location.hostname)

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
  if (!API_BASE_URL) {
    throw new Error('VITE_API_URL is required for production API requests')
  }

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
  forgotPassword: (body) => apiRequest('/auth/forgot-password', { method: 'POST', body }),
  resetPassword: (body) => apiRequest('/auth/reset-password', { method: 'POST', body }),
  sendVerification: (body) => apiRequest('/auth/send-verification', { method: 'POST', body }),
  verifyEmail: (body) => apiRequest('/auth/verify-email', { method: 'POST', body }),
  me: () => apiRequest('/auth/me'),
  products: (query = '') => apiRequest(`/products${query}`),
  productCategories: () => apiRequest('/products/meta/categories'),
  product: (id) => apiRequest(`/products/${id}`),
  publicSettings: () => apiRequest('/settings'),
  profile: () => apiRequest('/customer/profile'),
  updateProfile: (body) => apiRequest('/customer/profile', { method: 'PUT', body }),
  updatePassword: (body) => apiRequest('/customer/password', { method: 'PATCH', body }),
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
  invoiceUrl: (id) => `${API_BASE_URL}/orders/${id}/invoice`,
  createOrder: (body) => apiRequest('/orders', { method: 'POST', body }),
  validateCoupon: (body) => apiRequest('/coupons/validate', { method: 'POST', body }),
  submitContact: (body) => apiRequest('/contact', { method: 'POST', body }),
  adminDashboard: () => apiRequest('/admin/dashboard'),
  adminOrders: () => apiRequest('/admin/orders'),
  adminOrder: (id) => apiRequest(`/admin/orders/${id}`),
  updateAdminOrder: (id, body) => apiRequest(`/admin/orders/${id}`, { method: 'PATCH', body }),
  adminCustomers: () => apiRequest('/admin/customers'),
  adminReviews: () => apiRequest('/admin/reviews'),
  updateAdminReview: (id, body) => apiRequest(`/admin/reviews/${id}`, { method: 'PATCH', body }),
  adminCategories: () => apiRequest('/admin/categories'),
  createCategory: (body) => apiRequest('/admin/categories', { method: 'POST', body }),
  updateCategory: (id, body) => apiRequest(`/admin/categories/${id}`, { method: 'PATCH', body }),
  deleteCategory: (id) => apiRequest(`/admin/categories/${id}`, { method: 'DELETE' }),
  adminInventory: () => apiRequest('/admin/inventory'),
  updateInventory: (id, body) => apiRequest(`/admin/inventory/${id}`, { method: 'PATCH', body }),
  adminCoupons: () => apiRequest('/admin/coupons'),
  createCoupon: (body) => apiRequest('/admin/coupons', { method: 'POST', body }),
  updateCoupon: (id, body) => apiRequest(`/admin/coupons/${id}`, { method: 'PATCH', body }),
  deleteCoupon: (id) => apiRequest(`/admin/coupons/${id}`, { method: 'DELETE' }),
  adminSettings: () => apiRequest('/admin/settings'),
  updateAdminSettings: (body) => apiRequest('/admin/settings', { method: 'PUT', body }),
  uploadProductImage: (formData) => apiRequest('/uploads/product-image', { method: 'POST', body: formData }),
  createProduct: (body) => apiRequest('/products', { method: 'POST', body }),
  updateProduct: (id, body) => apiRequest(`/products/${id}`, { method: 'PATCH', body }),
  deleteProduct: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
  initializePaystack: (body) => apiRequest('/payments/paystack/initialize', { method: 'POST', body }),
  verifyPaystackByBody: (body) => apiRequest('/payments/paystack/verify', { method: 'POST', body }),
  verifyPaystack: (reference, body) => apiRequest(`/payments/paystack/verify/${reference}`, { method: 'POST', body }),
}
