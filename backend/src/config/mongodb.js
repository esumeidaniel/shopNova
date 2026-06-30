import mongoose from 'mongoose'
import { env } from './env.js'

let connectionPromise
let connectionFailed = false

export function mongoIsEnabled() {
  return Boolean(env.mongodbUri?.trim()) && !connectionFailed
}

function validateMongoUri(uri) {
  if (!uri) return

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error(
      'Invalid MONGODB_URI. It must start with "mongodb://" or "mongodb+srv://". Check backend/.env and make sure the value is not pasted as "MONGODB_URI=MONGODB_URI=...".',
    )
  }
}

export async function connectMongo() {
  if (!mongoIsEnabled()) return false
  validateMongoUri(env.mongodbUri)

  if (mongoose.connection.readyState === 1) return true

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 10000,
    })
  }

  try {
    await connectionPromise
    return true
  } catch (error) {
    connectionFailed = true
    connectionPromise = null
    console.warn(`MongoDB unavailable, using local JSON database instead: ${error.message}`)
    return false
  }
}

export function mongoStatus() {
  if (connectionFailed) return 'fallback-json'
  if (!mongoIsEnabled()) return 'disabled'
  if (mongoose.connection.readyState === 1) return 'connected'
  if (mongoose.connection.readyState === 2) return 'connecting'
  return 'disconnected'
}
