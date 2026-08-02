export const orderStatuses = ['Pending Payment', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned']

export const orderStatusTransitions = {
  'Pending Payment': ['Processing', 'Cancelled'],
  Processing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered', 'Returned'],
  Delivered: ['Returned'],
  Cancelled: [],
  Returned: [],
}

export function isEmail(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())
}

export function isStrongPassword(value = '') {
  return String(value).length >= 8
}

export function requiredString(body, field, label = field) {
  const value = String(body[field] || '').trim()
  if (!value) return { message: `${label} is required` }
  return null
}

export function validateRegister(body) {
  if (!isEmail(body.email)) return 'Valid email is required'
  if (!isStrongPassword(body.password)) return 'Password must be at least 8 characters'
  return ''
}

export function validateLogin(body) {
  if (!isEmail(body.email)) return 'Valid email is required'
  if (!body.password) return 'Password is required'
  return ''
}

export function validateProduct(body) {
  const requiredFields = ['name', 'category', 'price']
  for (const field of requiredFields) {
    const error = requiredString(body, field)
    if (error) return error.message
  }

  if (Number(body.stock || 0) < 0) return 'Stock cannot be negative'
  return ''
}

export function validateAddress(body) {
  const fields = [
    ['fullName', 'Full name'],
    ['phone', 'Phone'],
    ['address', 'Address'],
    ['city', 'City'],
    ['state', 'State'],
  ]

  for (const [field, label] of fields) {
    const error = requiredString(body, field, label)
    if (error) return error.message
  }

  if (String(body.phone).replace(/\D/g, '').length < 7) return 'Enter a valid phone number'
  return ''
}

export function validateContact(body) {
  if (!body.name?.trim()) return 'Name is required'
  if (!isEmail(body.email)) return 'Valid email is required'
  if (!body.message?.trim() || body.message.trim().length < 10) return 'Message must be at least 10 characters'
  return ''
}

export function validatePasswordChange(body) {
  if (!body.currentPassword) return 'Current password is required'
  if (!isStrongPassword(body.newPassword)) return 'New password must be at least 8 characters'
  if (body.newPassword !== body.confirmPassword) return 'New passwords do not match'
  return ''
}
