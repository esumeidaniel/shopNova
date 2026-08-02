import { Link } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../../api'
import { useStore } from '../../useStore'
import './Cart.css'

function CartItem({ item }) {
    const { removeFromCart, updateCartQuantity } = useStore()
    const variants = Object.values(item.options || {}).join(' / ') || 'Standard'

    return (
        <article className="cart-item">
            <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
            </div>
            <div>
                <h2>{item.name}</h2>
                <p>Variant: {variants}</p>
            </div>
            <strong>{item.price}</strong>
            <div className="cart-quantity">
                <button type="button" onClick={() => updateCartQuantity(item.key, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button type="button" disabled={item.stock && item.quantity >= item.stock} onClick={() => updateCartQuantity(item.key, item.quantity + 1)}>+</button>
            </div>
            <button className="cart-remove" type="button" onClick={() => removeFromCart(item.key)}>Remove</button>
        </article>
    )
}

const Cart = () => {
    const { cartItems, cartSummary, setAppliedCoupon } = useStore()
    const [couponCode, setCouponCode] = useState('')
    const [couponMessage, setCouponMessage] = useState('')
    const [couponLoading, setCouponLoading] = useState(false)
    const applyCoupon = async (event) => {
        event.preventDefault()
        setCouponLoading(true)
        setCouponMessage('')

        try {
            const coupon = await api.validateCoupon({ code: couponCode, subtotal: cartSummary.subtotal })
            setAppliedCoupon(coupon)
            setCouponMessage(`${coupon.coupon.code} applied`)
        } catch (error) {
            setAppliedCoupon(null)
            setCouponMessage(error.message)
        } finally {
            setCouponLoading(false)
        }
    }

    return (
        <main className="cart-page">

            <section className={`cart-layout ${cartItems.length === 0 ? 'cart-layout-empty' : ''}`}>
                <div className="cart-items-panel">
                    {cartItems.length > 0 ? (
                        <>
                            <div className="cart-items">
                                {cartItems.map((item, index) => (
                                    <CartItem key={item.key || `${item.id}-${index}`} item={item} />
                                ))}
                            </div>

                            <form className="coupon-form" onSubmit={applyCoupon}>
                                <input aria-label="Promo or coupon code" placeholder="Promo / coupon code" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} />
                                <button type="submit" disabled={couponLoading}>{couponLoading ? 'Applying...' : 'Apply'}</button>
                                {couponMessage && <p>{couponMessage}</p>}
                            </form>
                        </>
                    ) : (
                        <section className="empty-cart-card inline-empty">
                            <h2>Your cart is empty</h2>
                            <p>Start shopping from the SHOPNOVA catalog.</p>
                            <Link to="/products">Start Shopping</Link>
                        </section>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <aside className="cart-side">
                        <section className="order-summary">
                            <h2>Order Summary</h2>
                            <dl>
                                <div>
                                    <dt>Subtotal</dt>
                                    <dd>{cartSummary.formattedSubtotal}</dd>
                                </div>
                                <div className="discount">
                                    <dt>Applied discount{cartSummary.coupon ? ` (${cartSummary.coupon.coupon.code})` : ''}</dt>
                                    <dd>{cartSummary.formattedDiscount}</dd>
                                </div>
                                <div>
                                    <dt>Delivery fee</dt>
                                    <dd>{cartSummary.formattedDeliveryFee}</dd>
                                </div>
                            </dl>
                            <div className="summary-total">
                                <span>Total</span>
                                <strong>{cartSummary.formattedTotal}</strong>
                            </div>
                            <Link className="checkout-link" to="/checkout">Proceed to Checkout</Link>
                            <p>Visa • Mastercard • Verve • Paystack</p>
                        </section>
                    </aside>
                )}
            </section>
        </main>
    )
}

export default Cart
