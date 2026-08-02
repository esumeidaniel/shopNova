import { useEffect, useMemo, useState } from 'react'
import { API_BASE_URL, api, getStoredToken } from '../../api'
import { AdminToast, FormModal } from './AdminUi'

const statusOptions = ['Pending Payment', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned']

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusValue, setStatusValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })
  const visibleOrders = useMemo(() => orders.filter((order) => {
    const haystack = [order.id, order.customer, order.items?.map((item) => item.name).join(' ')].join(' ').toLowerCase()
    return search ? haystack.includes(search.toLowerCase()) : true
  }), [orders, search])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast({ message: '', type }), 2200)
  }

  useEffect(() => {
    api.adminOrders()
      .then(({ orders }) => setOrders(orders))
      .catch((error) => showToast(error.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  const openStatusModal = (order) => {
    setSelectedOrder(order)
    setStatusValue(order.status)
  }

  const updateStatus = async (event) => {
    event.preventDefault()
    if (!selectedOrder) return
    setSaving(true)

    try {
      const { order: updatedOrder } = await api.updateAdminOrder(selectedOrder.id, { status: statusValue })
      setOrders((items) => items.map((item) => (item.id === updatedOrder.id ? updatedOrder : item)))
      setSelectedOrder(null)
      showToast('Order status updated')
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const exportOrders = async () => {
    try {
      const token = getStoredToken()
      const response = await fetch(`${API_BASE_URL}/admin/orders/export/csv`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Order export failed')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'shopnova-orders.csv'
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  return (
    <section className="admin-page">
      <AdminToast message={toast.message} type={toast.type} />

      <article className="admin-panel">
        <div className="admin-panel-heading">
          <h3>Orders</h3>
          <div className="admin-header-actions">
            <input className="admin-search" aria-label="Search orders" placeholder="Search order ID or customer" value={search} onChange={(event) => setSearch(event.target.value)} />
            <button className="admin-primary-action" type="button" onClick={exportOrders}>Export Orders</button>
          </div>
        </div>
        {loading && <p>Loading orders...</p>}
        {!loading && visibleOrders.length === 0 && (
          <div className="admin-empty-state">
            <h3>No orders yet</h3>
            <p>Orders will appear here once customers start buying.</p>
          </div>
        )}
        {visibleOrders.length > 0 && (
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
                    <td><span className={`admin-chip ${String(order.status).toLowerCase().replaceAll(' ', '-')}`}>{order.status}</span></td>
                    <td><button className="admin-table-action" type="button" onClick={() => openStatusModal(order)}>Update</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      <FormModal open={Boolean(selectedOrder)} title="Update Order Status" onClose={() => setSelectedOrder(null)}>
        <form className="admin-compact-form" onSubmit={updateStatus}>
          <label>
            Order
            <input value={selectedOrder?.id || ''} readOnly />
          </label>
          <label>
            Status
            <select value={statusValue} onChange={(event) => setStatusValue(event.target.value)}>
              {statusOptions.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <div className="admin-modal-actions">
            <button className="admin-secondary-action" type="button" onClick={() => setSelectedOrder(null)}>Cancel</button>
            <button className="admin-primary-action" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Status'}</button>
          </div>
        </form>
      </FormModal>
    </section>
  )
}

export default AdminOrders
