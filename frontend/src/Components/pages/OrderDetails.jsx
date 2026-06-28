import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../api'
import './OrderDetails.css'

const OrderDetails = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.order(id)
      .then(({ order }) => setOrder(order))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <main className="order-details-page"><h1>Loading order...</h1></main>
  if (error) return <main className="order-details-page"><h1>{error}</h1><Link to="/orders">Back to orders</Link></main>

  return (
    <main className="order-details-page">
      <section className="order-details-heading">
        <h1>Order {id}</h1>
        <p>Track delivery progress, review items and download invoice.</p>
      </section>

      <section className="order-details-layout">
        <div className="order-details-main">
          <section className="timeline-card">
            <h2>Timeline</h2>
            <div className="timeline-steps">
              {['Placed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => (
                <div className={index < 3 ? 'active' : ''} key={step}>
                  <span>{index + 1}</span>
                  <strong>{step}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="order-items-card">
            <h2>Items</h2>
            {(order?.items || []).map((item) => (
              <article key={item.key || item.id}>
                <span />
                <strong>{item.name}</strong>
                <b>{item.price}</b>
              </article>
            ))}
          </section>
        </div>

        <aside className="order-info-card">
          <h2>Delivery & Payment</h2>
          <p><strong>Address:</strong> {order?.deliveryAddress || 'Home Address'}</p>
          <p><strong>Payment:</strong> {order?.paymentMethod || 'Paystack Card'}</p>
          <p><strong>Total:</strong> {order?.total || '₦0'}</p>
          <button type="button">Download Invoice</button>
        </aside>
      </section>
    </main>
  )
}

export default OrderDetails
