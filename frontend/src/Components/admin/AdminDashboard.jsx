import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.adminDashboard()
      .then(setDashboard)
      .catch((error) => setError(error.message))
  }, [])

  const stats = dashboard?.stats
    ? [
      ['Total Sales', dashboard.stats.totalSales],
      ['Total Orders', dashboard.stats.totalOrders],
      ['Pending Orders', dashboard.stats.pendingOrders],
      ['Low Stock Items', dashboard.stats.lowStockItems],
    ]
    : []
  const lowStock = dashboard?.lowStock || []
  const recentOrders = dashboard?.recentOrders || []

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <h2>Dashboard</h2>
          <p>Store performance, recent orders, and stock alerts.</p>
        </div>
        <Link className="admin-primary-action" to="/admin/products">Add Product</Link>
      </div>

      <div className="admin-stats-grid">
        {stats.map(([label, value]) => (
          <article className="admin-stat-card" key={label}>
            <p>{label}</p>
            <strong>{value}</strong>
            <span>Live API</span>
          </article>
        ))}
        {error && <article className="admin-stat-card"><p>{error}</p></article>}
      </div>

      <div className="admin-dashboard-grid">
        <article className="admin-panel admin-sales-panel">
          <div className="admin-panel-heading">
            <h3>Sales Overview</h3>
            <span>Last 7 days</span>
          </div>
          <div className="admin-chart" aria-label="Sales chart">
            {[46, 68, 52, 82, 74, 92, 78].map((height, index) => (
              <span key={height + index} style={{ height: `${height}%` }} />
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel-heading">
            <h3>Low Stock</h3>
            <Link to="/admin/inventory">View all</Link>
          </div>
          <div className="admin-list">
            {lowStock.map((product) => (
              <div className="admin-list-row" key={product.id || product.name}>
                <div>
                  <strong>{product.name}</strong>
                  <p>{product.category}</p>
                </div>
                <span className="admin-chip warning">{product.stock} left</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="admin-panel">
        <div className="admin-panel-heading">
          <h3>Recent Orders</h3>
          <Link to="/admin/orders">View orders</Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
            {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.items?.[0]?.name || 'Order items'}</td>
                  <td>{order.total}</td>
                  <td><span className={`admin-chip ${order.status.toLowerCase()}`}>{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}

export default AdminDashboard
