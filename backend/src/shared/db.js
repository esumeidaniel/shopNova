import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { initialData } from '../data/seedData.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', '..', 'data')
const dbPath = join(dataDir, 'db.json')

export async function ensureDb() {
  await mkdir(dataDir, { recursive: true })

  try {
    await readFile(dbPath, 'utf8')
  } catch {
    await saveDb(initialData)
  }
}

export async function getDb() {
  await ensureDb()
  return JSON.parse(await readFile(dbPath, 'utf8'))
}

export async function saveDb(data) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(dbPath, JSON.stringify(data, null, 2))
}

export function removePassword(user) {
  const { password: _password, ...safeUser } = user
  return safeUser
}
