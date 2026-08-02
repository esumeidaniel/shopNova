import { useEffect, useState } from 'react'
import { api } from '../../api'
import { AdminToast, FormModal } from './AdminUi'

const AdminInventory = () => {
  const [inventory, setInventory] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [stockValue, setStockValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast({ message: '', type }), 2200)
  }

  useEffect(() => {
    api.adminInventory()
      .then(({ inventory }) => setInventory(inventory))
      .catch((error) => showToast(error.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  const openStockModal = (item) => {
    setSelectedItem(item)
    setStockValue(String(item.stock ?? 0))
  }

  const updateStock = async (event) => {
    event.preventDefault()
    if (!selectedItem) return
    setSaving(true)

    try {
      const { product } = await api.updateInventory(selectedItem.id, { stock: Number(stockValue) })
      setInventory((items) => items.map((entry) => (
        entry.id === product.id ? { ...entry, stock: product.stock, status: product.status } : entry
      )))
      showToast('Stock updated')
      setSelectedItem(null)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="admin-page">
      <AdminToast message={toast.message} type={toast.type} />

      <article className="admin-panel">
        <div className="admin-panel-heading">
          <h3>Inventory</h3>
          <span>{inventory.length} products</span>
        </div>
        {loading && <p>Loading inventory...</p>}
        {!loading && inventory.length === 0 && (
          <div className="admin-empty-state">
            <h3>No products yet</h3>
            <p>Add products before updating inventory.</p>
          </div>
        )}
        <div className="admin-list">
          {inventory.map((item) => (
            <div className="admin-list-row" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <p>{item.status}</p>
              </div>
              <div className="admin-stock-meter">
                <span style={{ width: `${Math.min((item.stock / 20) * 100, 100)}%` }} />
              </div>
              <button className="admin-chip warning" type="button" onClick={() => openStockModal(item)}>{item.stock} left</button>
            </div>
          ))}
        </div>
      </article>

      <FormModal open={Boolean(selectedItem)} title="Update Stock" onClose={() => setSelectedItem(null)}>
        <form className="admin-compact-form" onSubmit={updateStock}>
          <label>
            Product
            <input value={selectedItem?.name || ''} readOnly />
          </label>
          <label>
            Stock quantity
            <input min="0" type="number" value={stockValue} onChange={(event) => setStockValue(event.target.value)} required />
          </label>
          <div className="admin-modal-actions">
            <button className="admin-secondary-action" type="button" onClick={() => setSelectedItem(null)}>Cancel</button>
            <button className="admin-primary-action" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Stock'}</button>
          </div>
        </form>
      </FormModal>
    </section>
  )
}

export default AdminInventory
