export async function uploadProductImage(req, res) {
  if (!req.file) return res.status(400).json({ message: 'Image file is required' })
  return res.status(201).json({ image: `/uploads/products/${req.file.filename}` })
}
