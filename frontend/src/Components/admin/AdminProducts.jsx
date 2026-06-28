import { useEffect, useState } from 'react'
import { api } from '../../api'

const emptyProduct = {
  name: '',
  brand: 'SHOPNOVA',
  category: 'Phones',
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

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [newProduct, setNewProduct] = useState(emptyProduct)
  const [imageName, setImageName] = useState('')
  const [editingId, setEditingId] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const updateProduct = (field, value) => {
    setNewProduct((product) => ({ ...product, [field]: value }))
  }

  useEffect(() => {
    Promise.all([api.products(), api.productCategories()])
      .then(([productData, categoryData]) => {
        setProducts(productData.products)
        setCategories(categoryData.categories || [])
      })
      .catch((error) => setMessage(error.message))
      .finally(() => setLoading(false))
  }, [])

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImageName(file.name)
    const formData = new FormData()
    formData.append('image', file)

    api.uploadProductImage(formData)
      .then(({ image, publicId }) => {
        setNewProduct((product) => ({ ...product, image, imagePublicId: publicId }))
      })
      .catch((error) => setMessage(error.message))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!newProduct.name || !newProduct.price || !newProduct.stock) return

    try {
      const payload = {
        ...newProduct,
        stock: Number(newProduct.stock),
        featured: Boolean(newProduct.featured),
        bestSeller: Boolean(newProduct.bestSeller),
        status: Number(newProduct.stock) <= 5 ? 'Low Stock' : newProduct.status,
      }
      const result = editingId
        ? await api.updateProduct(editingId, payload)
        : await api.createProduct(payload)

      setProducts((currentProducts) => (
        editingId
          ? currentProducts.map((product) => (product.id === result.product.id ? result.product : product))
          : [result.product, ...currentProducts]
      ))
      setMessage(editingId ? 'Product updated' : 'Product saved')
      setNewProduct(emptyProduct)
      setImageName('')
      setEditingId('')
      setIsAdding(false)
    } catch (error) {
      setMessage(error.message)
    }
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setNewProduct({
      name: product.name,
      brand: product.brand || 'SHOPNOVA',
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice || product.price,
      discount: product.discount || '',
      stock: String(product.stock),
      status: product.status,
      description: product.description || '',
      image: product.image || '',
      imagePublicId: product.imagePublicId || '',
      featured: Boolean(product.featured),
      bestSeller: Boolean(product.bestSeller),
    })
    setIsAdding(true)
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return

    try {
      await api.deleteProduct(product.id)
      setProducts((currentProducts) => currentProducts.filter((item) => item.id !== product.id))
      setMessage('Product deleted')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <h2>Products</h2>
          <p>Add, edit, price, publish, and manage electronics products.</p>
        </div>
        <button className="admin-primary-action" type="button" onClick={() => setIsAdding((open) => !open)}>
          {isAdding ? 'Close Form' : 'Add Product'}
        </button>
      </div>

      {isAdding && (
        <article className="admin-panel admin-product-form-panel">
          <div>
            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <p>Upload the product image and enter the product details customers will see.</p>
          </div>

          <form className="admin-product-form" onSubmit={handleSubmit}>
            <label className="admin-image-upload">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {newProduct.image ? (
                <img src={newProduct.image} alt="Selected product preview" />
              ) : (
                <span>
                  <strong>Upload product image</strong>
                  <small>PNG, JPG, or WEBP</small>
                </span>
              )}
            </label>

            <div className="admin-product-fields">
              <label>
                Product name
                <input value={newProduct.name} onChange={(event) => updateProduct('name', event.target.value)} placeholder="e.g. Samsung Galaxy A55" />
              </label>
              <label>
                Brand
                <input value={newProduct.brand} onChange={(event) => updateProduct('brand', event.target.value)} placeholder="e.g. Samsung" />
              </label>
              <label>
                Category
                <select value={newProduct.category} onChange={(event) => updateProduct('category', event.target.value)}>
                  {categories.map((category) => (
                    <option key={category.id || category.name}>{category.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Price
                <input value={newProduct.price} onChange={(event) => updateProduct('price', event.target.value)} placeholder="₦245,000" />
              </label>
              <label>
                Old price
                <input value={newProduct.oldPrice} onChange={(event) => updateProduct('oldPrice', event.target.value)} placeholder="₦280,000" />
              </label>
              <label>
                Discount badge
                <input value={newProduct.discount} onChange={(event) => updateProduct('discount', event.target.value)} placeholder="-20%" />
              </label>
              <label>
                Stock quantity
                <input min="0" type="number" value={newProduct.stock} onChange={(event) => updateProduct('stock', event.target.value)} placeholder="25" />
              </label>
              <label>
                Status
                <select value={newProduct.status} onChange={(event) => updateProduct('status', event.target.value)}>
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Low Stock</option>
                </select>
              </label>
              <label className="admin-wide-field">
                Description
                <textarea value={newProduct.description} onChange={(event) => updateProduct('description', event.target.value)} placeholder="Short product description" />
              </label>
              <div className="admin-product-flags">
                <label>
                  <input checked={newProduct.featured} type="checkbox" onChange={(event) => updateProduct('featured', event.target.checked)} />
                  Show in Featured Products
                </label>
                <label>
                  <input checked={newProduct.bestSeller} type="checkbox" onChange={(event) => updateProduct('bestSeller', event.target.checked)} />
                  Show in Best Sellers
                </label>
              </div>
              <div className="admin-form-actions">
                <p>{imageName || 'No image selected yet'}</p>
                <button className="admin-primary-action" type="submit">{editingId ? 'Update Product' : 'Save Product'}</button>
              </div>
            </div>
          </form>
        </article>
      )}

      <article className="admin-panel">
        {message && <p>{message}</p>}
        <div className="admin-panel-heading">
          <h3>Product Catalog</h3>
          <input className="admin-search" aria-label="Search products" placeholder="Search products" />
        </div>
        {loading && <p>Loading products...</p>}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.name}>
                  <td>
                    <div className="admin-product-cell">
                      {product.image ? <img src={product.image} alt={product.name} /> : <span />}
                      <strong>{product.name}</strong>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>{product.discount}</td>
                  <td>{product.stock}</td>
                  <td><span className={`admin-chip ${product.status === 'Low Stock' ? 'warning' : 'active'}`}>{product.status}</span></td>
                  <td>
                    <button className="admin-table-action" type="button" onClick={() => startEdit(product)}>Edit</button>
                    <button className="admin-table-action" type="button" onClick={() => handleDelete(product)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}

export default AdminProducts
