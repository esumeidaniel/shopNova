import { getDb, saveDb } from '../../shared/db.js'
import { slugify } from '../../shared/helpers.js'
import { deleteCloudinaryImage } from '../../config/cloudinary.js'

function filterProducts(products, query) {
  const search = query.search?.toLowerCase()
  const category = query.category

  return products.filter((product) => {
    const matchesSearch = search
      ? [product.name, product.brand, product.category].join(' ').toLowerCase().includes(search)
      : true
    const matchesCategory = category ? product.category === category : true
    return matchesSearch && matchesCategory
  })
}

function makeProduct(body) {
  const name = body.name?.trim()
  const stock = Number(body.stock || 0)

  return {
    id: body.id || slugify(name),
    name,
    brand: body.brand || 'SHOPNOVA',
    category: body.category || 'Accessories',
    price: body.price || '₦0',
    oldPrice: body.oldPrice || '',
    discount: body.discount || '',
    stock,
    status: body.status || (stock <= 5 ? 'Low Stock' : 'Active'),
    description: body.description || `${name} from the SHOPNOVA electronics catalog.`,
    image: body.image || '',
    imagePublicId: body.imagePublicId || '',
    images: body.images || (body.image ? [body.image] : []),
    featured: Boolean(body.featured),
    bestSeller: Boolean(body.bestSeller),
  }
}

export async function listProducts(req, res) {
  const db = await getDb()
  res.json({ products: filterProducts(db.products, req.query) })
}

export async function listCategories(req, res) {
  const db = await getDb()
  const categories = db.categories.map((category) => ({
    ...category,
    products: db.products.filter((product) => product.category === category.name).length,
  }))

  res.json({ categories })
}

export async function getProduct(req, res) {
  const db = await getDb()
  const product = db.products.find((item) => item.id === req.params.id)

  if (!product) return res.status(404).json({ message: 'Product not found' })
  return res.json({ product })
}

export async function createProduct(req, res) {
  if (!req.body.name) return res.status(400).json({ message: 'Product name is required' })

  const product = makeProduct(req.body)
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

  req.db.products[index] = { ...currentProduct, ...req.body, id: req.params.id }
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
