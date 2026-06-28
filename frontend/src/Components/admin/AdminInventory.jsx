import { useEffect, useState } from 'react'
import { api } from '../../api'

const AdminInventory = () => {
  const [inventory, setInventory] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.adminInventory()
      .then(({ inventory }) => setInventory(inventory))
      .catch((error) => setError(error.message))
  }, [])

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <h2>Inventory</h2>
          <p>Track low stock, reorder levels, and product availability.</p>
        </div>
        <button className="admin-primary-action" type="button">Update Stock</button>
      </div>

      <article className="admin-panel">
        <div className="admin-panel-heading">
          <h3>Restock Alerts</h3>
          <span>Items below reorder level</span>
        </div>
        {error && <p>{error}</p>}
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
              <span className="admin-chip warning">{item.stock} left</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default AdminInventory
