import { Link, useLocation } from 'react-router-dom'
import './OrderSuccess.css'

const OrderSuccess = () => {
  const { state } = useLocation()
  const orderId = state?.orderId || 'Pending'
  const order = state?.order || {}
  const itemCount = state?.items || order.items?.reduce?.((total, item) => total + Number(item.quantity || 1), 0) || 0
  const payment = state?.payment || order.paymentMethod || 'Pay on Delivery'
  const delivery = state?.delivery || order.deliveryAddress || 'Home Address'
  const deliveryMethod = state?.deliveryMethod || order.deliveryMethod || 'Standard delivery'

  return (
    <main className="order-success-page">
      <section className="success-card">
        <span className="success-mark">✓</span>
        <h1>Order confirmed</h1>
        <p>Your SHOPNOVA order has been placed successfully. No online payment was collected because you selected Pay on Delivery.</p>
        <div className="success-payment-note">
          <strong>Pay on Delivery</strong>
          <span>Keep your order ID ready. Our team will confirm delivery details before dispatch.</span>
        </div>
        <div className="success-summary">
          <div>
            <span>Order ID</span>
            <strong>{orderId}</strong>
          </div>
          <div>
            <span>Items</span>
            <strong>{itemCount}</strong>
          </div>
          <div>
            <span>Total</span>
            <strong>{state?.total || '₦0'}</strong>
          </div>
          <div>
            <span>Delivery</span>
            <strong>{delivery}</strong>
          </div>
          <div>
            <span>Method</span>
            <strong>{deliveryMethod}</strong>
          </div>
          <div>
            <span>Payment</span>
            <strong>{payment}</strong>
          </div>
        </div>
        <ol className="success-next-steps" aria-label="What happens next">
          <li>Order received</li>
          <li>SHOPNOVA confirms availability</li>
          <li>Delivery is arranged</li>
          <li>You pay when the item arrives</li>
        </ol>
        <div className="success-actions">
          <Link to="/account/orders">View Orders</Link>
          <Link to="/products">Continue Shopping</Link>
        </div>
      </section>
    </main>
  )
}

export default OrderSuccess
