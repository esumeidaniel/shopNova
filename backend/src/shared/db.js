import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import mongoose from 'mongoose'
import { connectMongo, mongoIsEnabled } from '../config/mongodb.js'
import { initialData } from '../data/seedData.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', '..', 'data')
const dbPath = join(dataDir, 'db.json')
const SHOPNOVA_DOCUMENT_ID = 'shopnova-store'

const shopnovaDataSchema = new mongoose.Schema(
  {
    _id: { type: String, default: SHOPNOVA_DOCUMENT_ID },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  {
    collection: 'shopnova_data',
    minimize: false,
    timestamps: true,
  },
)

const ShopnovaData = mongoose.models.ShopnovaData || mongoose.model('ShopnovaData', shopnovaDataSchema)

async function readJsonDb() {
  return JSON.parse(await readFile(dbPath, 'utf8'))
}

export async function ensureDb() {
  if (mongoIsEnabled()) {
    const connected = await connectMongo()
    if (!connected) return ensureJsonDb()

    const existingData = await ShopnovaData.exists({ _id: SHOPNOVA_DOCUMENT_ID })

    if (!existingData) {
      let seed = initialData

      try {
        seed = await readJsonDb()
      } catch {
        seed = initialData
      }

      await ShopnovaData.create({ _id: SHOPNOVA_DOCUMENT_ID, data: seed })
    }

    return
  }

  return ensureJsonDb()
}

async function ensureJsonDb() {
  await mkdir(dataDir, { recursive: true })
  try {
    await readFile(dbPath, 'utf8')
  } catch {
    await saveDb(initialData)
  }
}

export async function getDb() {
  await ensureDb()

  if (mongoIsEnabled()) {
    const connected = await connectMongo()
    if (!connected) return readJsonDb()

    const document = await ShopnovaData.findById(SHOPNOVA_DOCUMENT_ID).lean()
    return document?.data || initialData
  }

  return readJsonDb()
}

export async function saveDb(data) {
  if (mongoIsEnabled()) {
    const connected = await connectMongo()
    if (!connected) return saveJsonDb(data)

    await ShopnovaData.findByIdAndUpdate(
      SHOPNOVA_DOCUMENT_ID,
      { $set: { data } },
      { new: true, upsert: true },
    )
    return
  }

  return saveJsonDb(data)
}

async function saveJsonDb(data) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(dbPath, JSON.stringify(data, null, 2))
}

export function removePassword(user) {
  const { password: _password, ...safeUser } = user
  return safeUser
}
