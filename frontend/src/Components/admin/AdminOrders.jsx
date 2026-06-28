import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const visibleOrders = useMemo(() => orders.filter((order) => {
    const haystack = [order.id, order.customer, order.items?.map((item) => item.name).join(' ')].join(' ').toLowerCase()
    return search ? haystack.includes(search.toLowerCase()) : true
  }), [orders, search])

  useEffect(() => {
    api.adminOrders()
      .then(({ orders }) => setOrders(orders))
      .catch((error) => setError(error.message))
  }, [])

  const updateStatus = async (order, status) => {
    const { order: updatedOrder } = await api.updateAdminOrder(order.id, { status })
    setOrders((items) => items.map((item) => (item.id === updatedOrder.id ? updatedOrder : item)))
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <h2>Orders</h2>
          <p>Review customer purchases, update fulfillment, and manage invoices.</p>
        </div>
        <button className="admin-primary-action" type="button">Export Orders</button>
      </div>

      <article className="admin-panel">
        <div className="admin-panel-heading">
          <h3>Order Queue</h3>
          <input className="admin-search" aria-label="Search orders" placeholder="Search order ID or customer" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        {error && <p>{error}</p>}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.items?.[0]?.name || 'Order items'}</td>
                  <td>{order.date}</td>
                  <td>{order.total}</td>
                  <td><span className={`admin-chip ${order.status.toLowerCase()}`}>{order.status}</span></td>
                  <td><button className="admin-table-action" type="button" onClick={() => updateStatus(order, order.status === 'Delivered' ? 'Processing' : 'Delivered')}>Update</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}

export default AdminOrders
