import { Link, useLocation } from 'react-router-dom'
import './OrderSuccess.css'

const OrderSuccess = () => {
  const { state } = useLocation()
  const orderId = state?.orderId || 'Pending'

  return (
    <main className="order-success-page">
      <section className="success-card">
        <span className="success-mark">✓</span>
        <h1>Order placed successfully</h1>
        <p>Your SHOPNOVA order has been confirmed. You can track the delivery status from My Orders.</p>
        <div className="success-summary">
          <div>
            <span>Order ID</span>
            <strong>{orderId}</strong>
          </div>
          <div>
            <span>Total</span>
            <strong>{state?.total || '₦0'}</strong>
          </div>
          <div>
            <span>Delivery</span>
            <strong>{state?.delivery || 'Home Address'}</strong>
          </div>
        </div>
        <div className="success-actions">
          <Link to="/account/orders">View Orders</Link>
          <Link to="/products">Continue Shopping</Link>
        </div>
      </section>
    </main>
  )
}

export default OrderSuccess
