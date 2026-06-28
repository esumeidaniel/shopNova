import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
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

    useEffect(() => {
        api.orders()
            .then(({ orders }) => setOrders(orders))
            .catch((error) => setError(error.message))
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

            <section className="orders-layout">
                <div className="orders-list">
                    {loading && <article className="order-card"><h2>Loading orders...</h2></article>}
                    {error && <article className="order-card"><h2>{error}</h2></article>}
                    {!loading && !error && visibleOrders.length === 0 && (
                        <article className="order-card"><h2>No orders found</h2><Link to="/products">Start Shopping</Link></article>
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

                <aside className="order-detail-card">
                    <h2>Order Detail View</h2>
                    <h3>Timeline</h3>
                    <p className="order-timeline">Placed → Processing → Shipped → Delivered</p>
                    <p>Full item list, delivery address, payment method, and invoice download.</p>
                    <button>Download Invoice</button>
                </aside>
            </section>
        </main>
    )
}

export default Orders
