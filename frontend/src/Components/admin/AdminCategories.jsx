import { useEffect, useState } from 'react'
import { api } from '../../api'
import { AdminToast, ConfirmModal, FormModal } from './AdminUi'

const emptyCategory = { name: '', featured: false }

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [formCategory, setFormCategory] = useState(emptyCategory)
  const [editingId, setEditingId] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast({ message: '', type }), 2200)
  }

  useEffect(() => {
    api.adminCategories()
      .then(({ categories }) => setCategories(categories))
      .catch((error) => showToast(error.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  const openAddModal = () => {
    setEditingId('')
    setFormCategory(emptyCategory)
    setFormOpen(true)
  }

  const openEditModal = (category) => {
    setEditingId(category.id)
    setFormCategory({ name: category.name || '', featured: Boolean(category.featured) })
    setFormOpen(true)
  }

  const closeModal = () => {
    setFormOpen(false)
    setEditingId('')
    setFormCategory(emptyCategory)
  }

  const saveCategory = async (event) => {
    event.preventDefault()
    setSaving(true)

    try {
      const result = editingId
        ? await api.updateCategory(editingId, formCategory)
        : await api.createCategory(formCategory)
      setCategories((items) => (
        editingId
          ? items.map((item) => (item.id === result.category.id ? result.category : item))
          : [...items, result.category]
      ))
      showToast(editingId ? 'Category updated' : 'Category created')
      closeModal()
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const deleteCategory = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    try {
      await api.deleteCategory(deleteTarget.id)
      setCategories((items) => items.filter((item) => item.id !== deleteTarget.id))
      setDeleteTarget(null)
      showToast('Category deleted')
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="admin-page">
      <AdminToast message={toast.message} type={toast.type} />
      <div className="admin-section-header">
        <h2>Categories</h2>
        <button className="admin-primary-action" type="button" onClick={openAddModal}>Add Category</button>
      </div>

      {loading && <p>Loading categories...</p>}
      {!loading && categories.length === 0 && (
        <article className="admin-panel admin-empty-state">
          <h3>No categories yet</h3>
          <p>Create categories to organize your products.</p>

        </article>
      )}
      {categories.length > 0 && (
        <div className="admin-card-grid">
          {categories.map((category) => (
            <article className="admin-category-card" key={category.id || category.name}>
              <span>{category.name.slice(0, 2).toUpperCase()}</span>
              <h3>{category.name}</h3>
              <p>{category.products || 0} products</p>
              <div className="admin-action-row">
                <button type="button" onClick={() => openEditModal(category)}>Edit</button>
                <button className="danger" type="button" onClick={() => setDeleteTarget(category)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}

      <FormModal open={formOpen} title={editingId ? 'Edit Category' : 'Add Category'} onClose={closeModal}>
        <form className="admin-compact-form" onSubmit={saveCategory}>
          <label>
            Category name
            <input value={formCategory.name} onChange={(event) => setFormCategory((item) => ({ ...item, name: event.target.value }))} required />
          </label>
          <label className="admin-checkbox-row">
            <input checked={formCategory.featured} type="checkbox" onChange={(event) => setFormCategory((item) => ({ ...item, featured: event.target.checked }))} />
            Featured category
          </label>
          <div className="admin-modal-actions">
            <button className="admin-secondary-action" type="button" onClick={closeModal}>Cancel</button>
            <button className="admin-primary-action" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Category'}</button>
          </div>
        </form>
      </FormModal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete this category?"
        message="Products using this category will remain, but this category will be removed from filters."
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={deleteCategory}
      />
    </section>
  )
}

export default AdminCategories
