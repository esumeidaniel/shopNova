import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { allowDemoFallback, api } from '../../api'
import { getLocalOrders } from '../../orderStorage'
import './Orders.css'

const tabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returns']

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [activeTab, setActiveTab] = useState('All')
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const visibleOrders = useMemo(() => orders.filter((order) => {
        const matchesTab = activeTab === 'All' ? true : order.status === activeTab
        const haystack = [order.id, order.items?.map((item) => item.name).join(' ')].join(' ').toLowerCase()
        const matchesSearch = search ? haystack.includes(search.toLowerCase()) : true
        return matchesTab && matchesSearch
    }), [activeTab, orders, search])
    const showEmptyState = !loading && !error && visibleOrders.length === 0

    useEffect(() => {
        api.orders()
            .then(({ orders }) => setOrders(orders))
            .catch((error) => {
                const localOrders = getLocalOrders()
                if (allowDemoFallback && error.message === 'Failed to fetch' && localOrders.length > 0) {
                    setOrders(localOrders)
                    setError('')
                    return
                }
                setError(error.message)
            })
            .finally(() => setLoading(false))
    }, [])

    return (
        <main className="orders-page">
            
            <section className="orders-tools">
                <nav aria-label="Order filters">
                    {tabs.map((tab) => (
                        <button className={activeTab === tab ? 'active' : ''} key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>
                    ))}
                </nav>
                <input aria-label="Search orders" placeholder="Search order ID or product name" value={search} onChange={(event) => setSearch(event.target.value)} />
            </section>

            <section className={`orders-layout ${showEmptyState ? 'orders-layout-empty' : ''}`}>
                <div className="orders-list">
                    {loading && <article className="order-card"><h2>Loading orders...</h2></article>}
                    {error && <article className="order-card"><h2>{error}</h2></article>}
                    {showEmptyState && (
                        <article className="orders-empty-card">
                            <h2>No orders found</h2>
                            <p>Your orders will appear here after checkout.</p>
                            <Link to="/products">Start Shopping</Link>
                        </article>
                    )}
                    {visibleOrders.map((order) => (
                        <article className="order-card" key={order.id}>
                            <div>
                                <h2>#{order.id}</h2>
                                <div className="order-product">
                                    <span />
                                    <strong>{order.items?.[0]?.name || 'SHOPNOVA order'}</strong>
                                </div>
                            </div>
                            <b className={`order-status ${order.status.toLowerCase()}`}>{order.status}</b>
                            <Link to={`/orders/${order.id}`}>View Details</Link>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    )
}

export default Orders
