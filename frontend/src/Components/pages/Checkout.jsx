import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { allowDemoFallback, api } from '../../api'
import { saveLocalOrder } from '../../orderStorage'
import { useStore } from '../../useStore'
import './Checkout.css'

const deliveryMethods = ['Standard free', 'Express ₦2,500', 'Same-day ₦5,000']

const Checkout = () => {
    const navigate = useNavigate()
    const { cartItems, cartSummary, clearCart } = useStore()
    const [addresses, setAddresses] = useState([])
    const [selectedAddressId, setSelectedAddressId] = useState('')
    const [addressForm, setAddressForm] = useState({ label: 'Home Address', fullName: '', phone: '', address: '', city: '', state: '', deliveryInstructions: '' })
    const [delivery, setDelivery] = useState(deliveryMethods[0])
    const [payment, setPayment] = useState('Pay on Delivery')
    const [paymentMethods, setPaymentMethods] = useState(['Pay on Delivery'])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const selectedAddress = useMemo(() => addresses.find((address) => address.id === selectedAddressId), [addresses, selectedAddressId])

    useEffect(() => {
        Promise.all([api.addresses(), api.publicSettings()])
            .then(([{ addresses }, { settings }]) => {
                setAddresses(addresses || [])
                const defaultAddress = (addresses || []).find((item) => item.isDefault) || addresses?.[0]
                if (defaultAddress) setSelectedAddressId(defaultAddress.id)
                const methods = []
                if (settings.payOnDelivery) methods.push('Pay on Delivery')
                if (settings.paystackEnabled && import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) methods.push('Paystack Card')
                setPaymentMethods(methods)
                setPayment(methods[0] || '')
            })
            .catch((error) => setError(error.message))
    }, [])

    const goToOrderSuccess = (order) => {
        clearCart()
        navigate('/order-success', {
            state: {
                order,
                orderId: order.id,
                items: cartSummary.count,
                total: order.total,
                delivery: selectedAddress?.label || addressForm.label,
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
        deliveryAddress: selectedAddress || addressForm,
        deliveryMethod: delivery,
        paymentMethod: payment,
    })

    const saveAddress = async () => {
        const requiredFields = ['fullName', 'phone', 'address', 'city', 'state']
        const missingField = requiredFields.find((field) => !addressForm[field].trim())
        if (missingField) {
            setError('Please complete the delivery address form.')
            return null
        }

        const { address } = await api.createAddress(addressForm)
        setAddresses((items) => [...items, address])
        setSelectedAddressId(address.id)
        setAddressForm({ label: 'Home Address', fullName: '', phone: '', address: '', city: '', state: '', deliveryInstructions: '' })
        return address
    }

    const placeOrder = async () => {
        setLoading(true)
        setError('')

        try {
            let deliveryAddress = selectedAddress
            if (!deliveryAddress) deliveryAddress = await saveAddress()
            if (!deliveryAddress) return

            const { order } = await api.createOrder({
                items: cartItems,
                deliveryAddress,
                addressId: deliveryAddress.id,
                deliveryMethod: delivery,
                paymentMethod: payment,
                couponCode: cartSummary.coupon?.coupon?.code || '',
            })
            if (payment === 'Paystack Card') {
                const callbackUrl = `${window.location.origin}${import.meta.env.BASE_URL}order-success?orderId=${encodeURIComponent(order.id)}`
                const { payment: paystackPayment } = await api.initializePaystack({ orderId: order.id, callbackUrl })
                window.location.href = paystackPayment.authorization_url
                return
            }
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
                            <input checked={!selectedAddressId} name="address" type="radio" onChange={() => setSelectedAddressId('')} />
                            <strong>Use new address</strong>
                            <span>Fill the form below for this order.</span>
                        </label>
                        {addresses.map((address) => (
                            <label key={address.id}>
                                <input checked={selectedAddressId === address.id} name="address" type="radio" onChange={() => setSelectedAddressId(address.id)} />
                                <strong>{address.label || 'Saved Address'} {address.isDefault ? '• Default' : ''}</strong>
                                <span>{address.address}, {address.city} • {address.phone}</span>
                            </label>
                        ))}
                    </div>

                    <h2>Add New Address</h2>
                    <form className="address-form" onSubmit={(event) => {
                        event.preventDefault()
                        saveAddress().catch((error) => setError(error.message))
                    }}>
                        <input placeholder="Full name" aria-label="Full name" value={addressForm.fullName} onChange={(event) => setAddressForm((form) => ({ ...form, fullName: event.target.value }))} />
                        <input placeholder="Phone" aria-label="Phone" value={addressForm.phone} onChange={(event) => setAddressForm((form) => ({ ...form, phone: event.target.value }))} />
                        <input placeholder="Address" aria-label="Address" value={addressForm.address} onChange={(event) => setAddressForm((form) => ({ ...form, address: event.target.value }))} />
                        <input placeholder="City" aria-label="City" value={addressForm.city} onChange={(event) => setAddressForm((form) => ({ ...form, city: event.target.value }))} />
                        <input placeholder="State" aria-label="State" value={addressForm.state} onChange={(event) => setAddressForm((form) => ({ ...form, state: event.target.value }))} />
                        <input placeholder="Delivery instructions" aria-label="Delivery instructions" value={addressForm.deliveryInstructions} onChange={(event) => setAddressForm((form) => ({ ...form, deliveryInstructions: event.target.value }))} />
                        <button type="submit">Save Address</button>
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
                                        Delivery: {selectedAddress?.label || 'New Address'}<br />
                                        Method: {delivery}<br />
                                        Payment: {payment}<br />
                                        Final Total: {cartSummary.formattedTotal}
                                    </p>
                                    <button type="button" onClick={placeOrder} disabled={loading || !payment}>{loading ? 'Placing order...' : payment === 'Paystack Card' ? 'Continue to secure payment' : 'Confirm order'}</button>
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
