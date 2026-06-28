import { useEffect, useState } from 'react'
import { api } from '../../api'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.adminCategories()
      .then(({ categories }) => setCategories(categories))
      .catch((error) => setError(error.message))
  }, [])

  const addCategory = async () => {
    const name = window.prompt('Category name')
    if (!name) return
    const { category } = await api.createCategory({ name })
    setCategories((items) => [...items, category])
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <h2>Categories</h2>
          <p>Organize the electronics categories customers use to browse the store.</p>
        </div>
        <button className="admin-primary-action" type="button" onClick={addCategory}>Add Category</button>
      </div>

      {error && <p>{error}</p>}
      <div className="admin-card-grid">
        {categories.map((category) => (
          <article className="admin-category-card" key={category.id || category.name}>
            <span>{category.name.slice(0, 2).toUpperCase()}</span>
            <h3>{category.name}</h3>
            <p>{category.products || 0} products</p>
            <button type="button">{category.featured ? 'Featured' : 'Make Featured'}</button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AdminCategories
