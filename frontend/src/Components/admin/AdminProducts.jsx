import { useEffect, useState } from 'react'
import { api } from '../../api'
import { AdminToast, ConfirmModal, FormModal } from './AdminUi'

const emptyProduct = {
  name: '',
  brand: 'SHOPNOVA',
  category: '',
  price: '',
  oldPrice: '',
  discount: '',
  stock: '',
  status: 'Active',
  description: '',
  image: '',
  imagePublicId: '',
  featured: false,
  bestSeller: false,
}

function ProductForm({ product, categories, imageName, saving, uploading, onChange, onImageChange, onSubmit, submitLabel }) {
  return (
    <form className="admin-product-form" onSubmit={onSubmit}>
      <label className="admin-image-upload">
        <input type="file" accept="image/*" onChange={onImageChange} disabled={uploading} />
        {product.image ? (
          <img src={product.image} alt="Selected product preview" />
        ) : (
          <span>
            <strong>{uploading ? 'Uploading image...' : 'Upload product image'}</strong>
            <small>PNG, JPG, or WEBP</small>
          </span>
        )}
      </label>

      <div className="admin-product-fields">
        <label>
          Product name
          <input value={product.name} onChange={(event) => onChange('name', event.target.value)} placeholder="Product name" required />
        </label>
        <label>
          Brand
          <input value={product.brand} onChange={(event) => onChange('brand', event.target.value)} placeholder="Brand" />
        </label>
        <label>
          Category
          <select value={product.category} onChange={(event) => onChange('category', event.target.value)} required>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id || category.name} value={category.name}>{category.name}</option>
            ))}
          </select>
        </label>
        <label>
          Price
          <input value={product.price} onChange={(event) => onChange('price', event.target.value)} placeholder="₦245,000" required />
        </label>
        <label>
          Old price
          <input value={product.oldPrice} onChange={(event) => onChange('oldPrice', event.target.value)} placeholder="Optional" />
        </label>
        <label>
          Discount badge
          <input value={product.discount} onChange={(event) => onChange('discount', event.target.value)} placeholder="Optional" />
        </label>
        <label>
          Stock quantity
          <input min="0" type="number" value={product.stock} onChange={(event) => onChange('stock', event.target.value)} required />
        </label>
        <label>
          Status
          <select value={product.status} onChange={(event) => onChange('status', event.target.value)}>
            <option>Active</option>
            <option>Inactive</option>
            <option>Draft</option>
            <option>Out of Stock</option>
          </select>
        </label>
        <label className="admin-wide-field">
          Description
          <textarea value={product.description} onChange={(event) => onChange('description', event.target.value)} placeholder="Short product description" />
        </label>
        <div className="admin-product-flags">
          <label>
            <input checked={product.featured} type="checkbox" onChange={(event) => onChange('featured', event.target.checked)} />
            Show in Featured Products
          </label>
          <label>
            <input checked={product.bestSeller} type="checkbox" onChange={(event) => onChange('bestSeller', event.target.checked)} />
            Show in Best Sellers
          </label>
        </div>
        <div className="admin-form-actions">
          <p>{imageName || 'No new image selected'}</p>
          <button className="admin-primary-action" type="submit" disabled={saving || uploading}>
            {saving ? 'Saving...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [formProduct, setFormProduct] = useState(emptyProduct)
  const [imageName, setImageName] = useState('')
  const [editingId, setEditingId] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast({ message: '', type }), 2200)
  }

  const loadProducts = () => {
    setLoading(true)
    Promise.all([api.products(), api.productCategories()])
      .then(([productData, categoryData]) => {
        setProducts(productData.products || [])
        setCategories(categoryData.categories || [])
      })
      .catch((error) => showToast(error.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const resetForm = () => {
    setFormProduct(emptyProduct)
    setImageName('')
    setEditingId('')
    setFormOpen(false)
  }

  const openAddModal = () => {
    setEditingId('')
    setImageName('')
    setFormProduct({ ...emptyProduct, category: categories[0]?.name || '' })
    setFormOpen(true)
  }

  const openEditModal = (product) => {
    setEditingId(product.id)
    setImageName('')
    setFormProduct({
      name: product.name || '',
      brand: product.brand || 'SHOPNOVA',
      category: product.category || '',
      price: product.price || '',
      oldPrice: product.oldPrice || '',
      discount: product.discount || '',
      stock: String(product.stock ?? ''),
      status: product.status || 'Active',
      description: product.description || '',
      image: product.image || '',
      imagePublicId: product.imagePublicId || '',
      featured: Boolean(product.featured),
      bestSeller: Boolean(product.bestSeller),
    })
    setFormOpen(true)
  }

  const updateProduct = (field, value) => {
    setFormProduct((product) => ({ ...product, [field]: value }))
  }

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setImageName(file.name)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const { image, publicId } = await api.uploadProductImage(formData)
      setFormProduct((product) => ({ ...product, image, imagePublicId: publicId }))
      showToast('Image uploaded')
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)

    try {
      const payload = {
        ...formProduct,
        stock: Number(formProduct.stock),
        featured: Boolean(formProduct.featured),
        bestSeller: Boolean(formProduct.bestSeller),
      }
      const result = editingId
        ? await api.updateProduct(editingId, payload)
        : await api.createProduct(payload)

      setProducts((currentProducts) => (
        editingId
          ? currentProducts.map((product) => (product.id === result.product.id ? result.product : product))
          : [result.product, ...currentProducts]
      ))
      showToast(editingId ? 'Product updated' : 'Product saved')
      resetForm()
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    try {
      await api.deleteProduct(deleteTarget.id)
      setProducts((currentProducts) => currentProducts.filter((item) => item.id !== deleteTarget.id))
      setDeleteTarget(null)
      showToast('Product deleted')
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="admin-page">
      <AdminToast message={toast.message} type={toast.type} />

      <article className="admin-panel">
        <div className="admin-panel-heading">
          <h3>Product Catalog</h3>
          <div className="admin-header-actions">
            <input className="admin-search" aria-label="Search products" placeholder="Search products" />
            <button className="admin-primary-action" type="button" onClick={openAddModal}>Add Product</button>
          </div>
        </div>
        {loading && <p>Loading products...</p>}
        {!loading && products.length === 0 && (
          <div className="admin-empty-state">
            <h3>No products yet</h3>
            <p>Add your first product to start selling on SHOPNOVA.</p>

          </div>
        )}
        {products.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-product-cell">
                        {product.image ? <img src={product.image} alt={product.name} /> : <span />}
                        <strong>{product.name}</strong>
                      </div>
                    </td>
                    <td>{product.category || 'Uncategorized'}</td>
                    <td>{product.price}</td>
                    <td>{product.stock}</td>
                    <td><span className={`admin-chip ${String(product.status).toLowerCase().replaceAll(' ', '-')}`}>{product.status}</span></td>
                    <td>
                      <div className="admin-action-row">
                        <button className="admin-table-action" type="button" onClick={() => openEditModal(product)}>Edit</button>
                        <button className="admin-table-action danger" type="button" onClick={() => setDeleteTarget(product)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      <FormModal open={formOpen} title={editingId ? 'Edit Product' : 'Add Product'} onClose={resetForm}>
        <ProductForm
          product={formProduct}
          categories={categories}
          imageName={imageName}
          saving={saving}
          uploading={uploading}
          onChange={updateProduct}
          onImageChange={handleImageChange}
          onSubmit={handleSubmit}
          submitLabel={editingId ? 'Save Changes' : 'Save Product'}
        />
      </FormModal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete this product?"
        message="This action cannot be undone."
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </section>
  )
}

export default AdminProducts
