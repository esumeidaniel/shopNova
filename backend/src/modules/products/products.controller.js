import { getDb, saveDb } from '../../shared/db.js'
import { moneyToNumber, slugify } from '../../shared/helpers.js'
import { deleteCloudinaryImage } from '../../config/cloudinary.js'
import { validateProduct } from '../../shared/validation.js'

function filterProducts(products, query) {
  const search = query.search?.toLowerCase()
  const category = query.category
  const minPrice = Number(query.minPrice || 0)
  const maxPrice = Number(query.maxPrice || 0)
  const inStock = query.inStock === 'true'
  const sort = query.sort || ''

  const filteredProducts = products.filter((product) => {
    const matchesSearch = search
      ? [product.name, product.brand, product.category].join(' ').toLowerCase().includes(search)
      : true
    const matchesCategory = category ? product.category === category : true
    const productPrice = moneyToNumber(product.price)
    const matchesMinPrice = minPrice ? productPrice >= minPrice : true
    const matchesMaxPrice = maxPrice ? productPrice <= maxPrice : true
    const matchesStock = inStock ? Number(product.stock || 0) > 0 : true
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesStock
  })

  return filteredProducts.sort((a, b) => {
    if (sort === 'price-low') return moneyToNumber(a.price) - moneyToNumber(b.price)
    if (sort === 'price-high') return moneyToNumber(b.price) - moneyToNumber(a.price)
    if (sort === 'popular') return Number(b.bestSeller) - Number(a.bestSeller)
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  })
}

function uniqueProductId(products, name) {
  const baseId = slugify(name)
  let id = baseId
  let index = 2

  while (products.some((product) => product.id === id)) {
    id = `${baseId}-${index}`
    index += 1
  }

  return id
}

function makeProduct(body, products = []) {
  const name = body.name?.trim()
  const stock = Number(body.stock || 0)
  const requestedStatus = body.status || 'Active'
  const status = stock <= 0 ? 'Out of Stock' : requestedStatus

  return {
    id: body.id || uniqueProductId(products, name),
    name,
    brand: body.brand || '',
    category: body.category,
    price: body.price,
    oldPrice: body.oldPrice || '',
    discount: body.discount || '',
    stock,
    status,
    description: body.description || `${name} from the SHOPNOVA electronics catalog.`,
    image: body.image || '',
    imagePublicId: body.imagePublicId || '',
    images: body.images || (body.image ? [body.image] : []),
    featured: Boolean(body.featured),
    bestSeller: Boolean(body.bestSeller),
    createdAt: body.createdAt || new Date().toISOString(),
  }
}

export async function listProducts(req, res) {
  const db = await getDb()
  const publicProducts = db.products.filter((product) => ['Active', 'Published'].includes(product.status))
  res.json({ products: filterProducts(publicProducts, req.query) })
}

export async function listCategories(req, res) {
  const db = await getDb()
  const categories = db.categories.filter((category) => category.visible !== false && category.status !== 'Disabled').map((category) => ({
    ...category,
    products: db.products.filter((product) => product.category === category.name).length,
  }))

  res.json({ categories })
}

export async function getProduct(req, res) {
  const db = await getDb()
  const product = db.products.find((item) => item.id === req.params.id)

  if (!product || !['Active', 'Published'].includes(product.status)) return res.status(404).json({ message: 'Product not found' })
  return res.json({ product })
}

export async function createProduct(req, res) {
  const validationError = validateProduct(req.body)
  if (validationError) return res.status(400).json({ message: validationError })

  const product = makeProduct(req.body, req.db.products)
  if (req.db.products.some((item) => item.id === product.id)) {
    return res.status(400).json({ message: 'Product already exists' })
  }

  req.db.products.unshift(product)
  await saveDb(req.db)
  return res.status(201).json({ product })
}

export async function updateProduct(req, res) {
  const index = req.db.products.findIndex((item) => item.id === req.params.id)

  if (index === -1) return res.status(404).json({ message: 'Product not found' })

  const currentProduct = req.db.products[index]
  const imageIsChanging = req.body.imagePublicId && req.body.imagePublicId !== currentProduct.imagePublicId

  if (imageIsChanging && currentProduct.imagePublicId) {
    await deleteCloudinaryImage(currentProduct.imagePublicId)
  }

  const nextProduct = { ...currentProduct, ...req.body, id: req.params.id }
  const validationError = validateProduct(nextProduct)
  if (validationError) return res.status(400).json({ message: validationError })

  nextProduct.stock = Number(nextProduct.stock || 0)
  nextProduct.status = nextProduct.stock <= 0 ? 'Out of Stock' : (req.body.status || currentProduct.status || 'Active')
  req.db.products[index] = nextProduct
  await saveDb(req.db)
  return res.json({ product: req.db.products[index] })
}

export async function deleteProduct(req, res) {
  const product = req.db.products.find((item) => item.id === req.params.id)
  if (!product) return res.status(404).json({ message: 'Product not found' })

  if (product.imagePublicId) {
    await deleteCloudinaryImage(product.imagePublicId)
  }

  req.db.products = req.db.products.filter((item) => item.id !== req.params.id)
  await saveDb(req.db)
  return res.json({ message: 'Product deleted' })
}
