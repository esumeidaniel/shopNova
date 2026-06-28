import { Link } from 'react-router-dom'
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
                <button type="button" onClick={() => updateCartQuantity(item.key, item.quantity + 1)}>+</button>
            </div>
            <button className="cart-remove" type="button" onClick={() => removeFromCart(item.key)}>Remove</button>
        </article>
    )
}

const Cart = () => {
    const { cartItems, cartSummary } = useStore()

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

                            <form className="coupon-form" onSubmit={(event) => event.preventDefault()}>
                                <input aria-label="Promo or coupon code" placeholder="Promo / coupon code" />
                                <button type="submit">Apply</button>
                            </form>
                        </>
                    ) : (
                        <section className="empty-cart-card inline-empty">
                            <h2>Your cart is empty</h2>
                            <p>Start shopping from the SHOPNOVA electronics catalog.</p>
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
                                    <dt>Applied discount</dt>
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
