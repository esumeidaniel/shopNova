import { initialData } from '../data/seedData.js'
import { saveDb } from '../shared/db.js'

await saveDb(structuredClone(initialData))
console.log(`Seeded ${initialData.products.length} products across ${initialData.categories.length} categories.`)
