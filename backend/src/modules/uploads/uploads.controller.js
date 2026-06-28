import { cloudinary, cloudinaryIsConfigured } from '../../config/cloudinary.js'

function uploadBufferToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'shopnova/products',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error)
        return resolve(result)
      },
    )

    stream.end(file.buffer)
  })
}

export async function uploadProductImage(req, res) {
  if (!req.file) return res.status(400).json({ message: 'Image file is required' })

  if (!cloudinaryIsConfigured()) {
    return res.status(500).json({ message: 'Cloudinary is not configured on the backend' })
  }

  const result = await uploadBufferToCloudinary(req.file)

  return res.status(201).json({
    image: result.secure_url,
    publicId: result.public_id,
  })
}
