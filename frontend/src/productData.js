export function productSlug(name = '') {
  return name.toLowerCase().replaceAll('"', '').replaceAll('&', 'and').replaceAll(' ', '-')
}

export const emptyProduct = {
  id: '',
  name: '',
  brand: '',
  price: '',
  oldPrice: '',
  discount: '',
  image: '',
  images: [],
  category: '',
  stock: 0,
  featured: false,
  bestSeller: false,
  status: 'Draft',
}

export const fallbackProducts = []
export const fallbackCategories = []

export function getProductById(id = '') {
  return { ...emptyProduct, id }
}

export function getProductImage() {
  return ''
}
