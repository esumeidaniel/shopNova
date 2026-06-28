export function isTestProduct(product) {
  const name = product?.name?.toLowerCase() || ''
  const id = product?.id?.toLowerCase() || ''
  return name.includes('backend test') || id.includes('backend-test')
}

export function hasRealDiscount(product) {
  const discount = String(product?.discount || '').trim()
  if (!discount || discount === '-0%' || discount === '0%' || discount === '0') return false
  if (!product?.oldPrice || product.oldPrice === product.price) return false
  return true
}

export function visibleProducts(products = []) {
  return products.filter((product) => !isTestProduct(product))
}
