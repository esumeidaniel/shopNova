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
      ['Products', dashboard.stats.totalProducts],
      ['Customers', dashboard.stats.totalCustomers],
    ]
    : []
  const lowStock = dashboard?.lowStock || []
  const recentOrders = dashboard?.recentOrders || []
  const salesChart = dashboard?.salesChart || []
  const maxSales = Math.max(...salesChart.map((day) => day.sales), 1)

  return (
    <section className="admin-page">
      <div className="admin-section-header">
        <h2>Dashboard</h2>
      </div>

      <div className="admin-stats-grid">
        {stats.map(([label, value]) => (
          <article className="admin-stat-card" key={label}>
            <p>{label}</p>
            <strong>{value}</strong>
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
            {salesChart.map((day) => (
              <span key={day.date} title={`${day.date}: ${day.orders} orders`} style={{ height: `${Math.max(8, (day.sales / maxSales) * 100)}%` }} />
            ))}
          </div>
          {salesChart.every((day) => day.sales === 0) && <p>No sales data yet.</p>}
        </article>

        <article className="admin-panel">
          <div className="admin-panel-heading">
            <h3>Low Stock</h3>
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
            {lowStock.length === 0 && <p>No low stock products.</p>}
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
          {recentOrders.length === 0 && (
            <div className="admin-empty-state compact">
              <h3>No orders yet</h3>
              <p>Orders will appear here once customers start buying.</p>
            </div>
          )}
        </div>
      </article>
    </section>
  )
}

export default AdminDashboard
