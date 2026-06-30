import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { allowDemoFallback, api } from '../../api'
import { saveLocalOrder } from '../../orderStorage'
import { useStore } from '../../useStore'
import './Checkout.css'

const paymentMethods = ['Pay on Delivery']
const deliveryMethods = ['Standard free', 'Express ₦2,500', 'Same-day ₦5,000']

const Checkout = () => {
    const navigate = useNavigate()
    const { cartItems, cartSummary, clearCart } = useStore()
    const [address, setAddress] = useState('Home Address')
    const [delivery, setDelivery] = useState(deliveryMethods[0])
    const [payment, setPayment] = useState(paymentMethods[0])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const goToOrderSuccess = (order) => {
        clearCart()
        navigate('/order-success', {
            state: {
                order,
                orderId: order.id,
                items: cartSummary.count,
                total: order.total,
                delivery: address,
                deliveryMethod: delivery,
                payment,
            },
        })
    }

    const createLocalPayOnDeliveryOrder = () => saveLocalOrder({
        id: `SN${Date.now().toString().slice(-6)}`,
        items: cartItems,
        status: 'Processing',
        subtotal: cartSummary.formattedSubtotal,
        discount: cartSummary.formattedDiscount,
        deliveryFee: cartSummary.formattedDeliveryFee,
        total: cartSummary.formattedTotal,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        deliveryAddress: address,
        deliveryMethod: delivery,
        paymentMethod: payment,
    })

    const placeOrder = async () => {
        setLoading(true)
        setError('')

        try {
            const { order } = await api.createOrder({
                items: cartItems,
                deliveryAddress: address,
                paymentMethod: payment,
            })
            goToOrderSuccess(order)
        } catch (error) {
            if (allowDemoFallback && error.message === 'Failed to fetch' && payment === 'Pay on Delivery') {
                goToOrderSuccess(createLocalPayOnDeliveryOrder())
                return
            }

            setError(error.message === 'Failed to fetch'
                ? 'Could not reach the backend. Please make sure the backend is running or deployed.'
                : error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="checkout-page">
            <section className="checkout-heading">
                <h1>Checkout</h1>
                <p>Delivery → Payment → Review &amp; Confirm</p>
            </section>

            <nav className="page-breadcrumb" aria-label="Breadcrumb">
                <Link to="/">Home</Link> &gt; <Link to="/cart">Cart</Link> &gt; Checkout
            </nav>

            <section className="checkout-steps" aria-label="Checkout steps">
                <span>1 Delivery</span>
                <b>→</b>
                <span>2 Payment</span>
                <b>→</b>
                <span>3 Review &amp; Confirm</span>
            </section>

            <section className="checkout-layout">
                <div className="checkout-delivery">
                    <h2>Delivery Address</h2>

                    <div className="address-list">
                        <label>
                            <input checked={address === 'Home Address'} name="address" type="radio" onChange={() => setAddress('Home Address')} />
                            <strong>Home Address</strong>
                            <span>12 Admiralty Way, Lagos • +234 801 000 0000</span>
                        </label>
                        <label>
                            <input checked={address === 'Office Address'} name="address" type="radio" onChange={() => setAddress('Office Address')} />
                            <strong>Office Address</strong>
                            <span>12 Admiralty Way, Lagos • +234 801 000 0000</span>
                        </label>
                    </div>

                    <h2>Add New Address</h2>
                    <form className="address-form">
                        <input placeholder="Full name" aria-label="Full name" />
                        <input placeholder="Phone" aria-label="Phone" />
                        <input placeholder="Address" aria-label="Address" />
                        <input placeholder="City" aria-label="City" />
                        <input placeholder="State" aria-label="State" />
                        <input placeholder="Delivery instructions" aria-label="Delivery instructions" />
                    </form>

                    <h2>Delivery Method</h2>
                    <div className="delivery-methods">
                        {deliveryMethods.map((method) => (
                            <label key={method}>
                                <input checked={delivery === method} name="delivery" type="radio" onChange={() => setDelivery(method)} />
                                {method}
                            </label>
                        ))}
                    </div>
                </div>

                <aside className="checkout-side">
                    <section>
                        <h2>Payment Method</h2>
                        <div className="payment-methods">
                            {paymentMethods.map((method) => (
                                <label key={method}>
                                    <input checked={payment === method} name="payment" type="radio" onChange={() => setPayment(method)} />
                                    {method}
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="review-section">
                        <h2>Review &amp; Confirm</h2>
                        <div className="review-card">
                            {error && <p>{error}</p>}
                            {cartItems.length > 0 ? (
                                <>
                                    <p>
                                        Items: {cartSummary.count}<br />
                                        Delivery: {address}<br />
                                        Method: {delivery}<br />
                                        Payment: {payment}<br />
                                        Final Total: {cartSummary.formattedTotal}
                                    </p>
                                    <button type="button" onClick={placeOrder} disabled={loading}>{loading ? 'Placing order...' : 'Confirm Pay on Delivery Order'}</button>
                                </>
                            ) : (
                                <>
                                    <p>Your cart is empty. Add products before checkout.</p>
                                    <Link to="/products">Browse Products</Link>
                                </>
                            )}
                        </div>
                    </section>
                </aside>
            </section>
        </main>
    )
}

export default Checkout
