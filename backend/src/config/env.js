import dotenv from 'dotenv'

dotenv.config()

const cleanMongoUri = (value = '') => value.trim().replace(/^MONGODB_URI=/, '')

export const env = {
  port: Number(process.env.PORT || 4000),
  clientUrl: process.env.CLIENT_URL || 'http://127.0.0.1:5173',
  mongodbUri: cleanMongoUri(process.env.MONGODB_URI),
}
