import { access } from 'node:fs/promises'
import { join } from 'node:path'
import { initialData } from '../data/seedData.js'

const products = initialData.products
const imageToProducts = new Map()

for (const product of products) {
  const image = product.image?.trim()
  if (!image) throw new Error(`${product.name} is missing an image.`)
  if (!product.sourceUrl?.trim()) throw new Error(`${product.name} is missing its Jumia source URL.`)

  const matches = imageToProducts.get(image) || []
  matches.push(product.name)
  imageToProducts.set(image, matches)

  if (image.startsWith('/catalog/')) {
    await access(join(process.cwd(), 'src', 'assets', image))
  }
}

const duplicates = [...imageToProducts.entries()].filter(([, names]) => names.length > 1)
if (duplicates.length) {
  throw new Error(`Duplicate catalog images: ${duplicates.map(([image, names]) => `${image} (${names.join(', ')})`).join('; ')}`)
}

console.log(`Catalog image audit passed: ${products.length} products, ${imageToProducts.size} unique images.`)
