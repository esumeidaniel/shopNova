import multer from 'multer'
import { mkdirSync } from 'node:fs'
import { extname, join } from 'node:path'

const productsUploadDir = join(process.cwd(), 'uploads', 'products')
mkdirSync(productsUploadDir, { recursive: true })

export const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, productsUploadDir),
    filename: (_req, file, callback) => {
      const extension = extname(file.originalname).toLowerCase() || '.jpg'
      callback(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`)
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    callback(null, file.mimetype.startsWith('image/'))
  },
})
