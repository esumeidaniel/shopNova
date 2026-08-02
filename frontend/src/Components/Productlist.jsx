import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api'
import { fallbackCategories, fallbackProducts, getProductImage } from '../productData'
import { hasRealDiscount, visibleProducts as filterVisibleProducts } from '../productDisplay'
import { useAuth } from '../useAuth'
import { useStore } from '../useStore'
import './Productlist.css'

function ListingCard({ product, onToast }) {
    const navigate = useNavigate()
    const { isLoggedIn } = useAuth()
    const { addToCart, toggleWishlist } = useStore()
    const showDiscount = hasRealDiscount(product)
    const inStock = Number(product.stock || 0) > 0
    const productId = product.id
    const openProduct = () => {
        navigate(`/product/${productId}`)
    }
    const handleWishlist = (event) => {
        event.stopPropagation()
        if (!isLoggedIn) {
            navigate('/login', { state: { from: `/product/${product.id}` } })
            return
        }
        const saved = toggleWishlist(product)
        onToast(saved ? `${product.name} saved to wishlist` : `${product.name} removed from wishlist`)
    }
    const handleCart = (event) => {
        event.stopPropagation()
        addToCart(product)
        onToast('Added to cart')
    }

    return (
        <article className="pl-card" onClick={openProduct}>
            <div className="pl-card-media">
                <img src={product.image || getProductImage(product.name)} alt={product.name} />
                <div className="pl-badges">
                    {showDiscount && <span>{product.discount}</span>}
                    {product.featured && <span>NEW</span>}
                </div>
                <button aria-label={`Add ${product.name} to wishlist`} onClick={handleWishlist}>♡</button>
            </div>

            <div className="pl-card-body">
                <h3>{product.name}</h3>
                <p className="pl-rating">★ 4.7 (128)</p>
                <div className="pl-price-row">
                    <strong>{product.price}</strong>
                    {showDiscount && <span>{product.oldPrice}</span>}
                </div>
                <p className="pl-stock">{inStock ? 'In Stock' : 'Out of Stock'}</p>
                <button className="pl-cart-button" aria-label={`Add ${product.name} to cart`} onClick={handleCart} disabled={!inStock}>Add to Cart</button>
            </div>
        </article>
    )
}

const Productlist = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [toast, setToast] = useState('')
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const selectedCategory = searchParams.get('category')
    const searchKeyword = searchParams.get('search')?.toLowerCase()
    const selectedSort = searchParams.get('sort') || 'newest'
    const selectedMinPrice = searchParams.get('minPrice') || ''
    const selectedMaxPrice = searchParams.get('maxPrice') || ''
    const selectedInStock = searchParams.get('inStock') === 'true'
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ''

    useEffect(() => {
        setLoading(true)
        setError('')
        Promise.all([api.products(query), api.productCategories()])
            .then(([productData, categoryData]) => {
                setProducts(filterVisibleProducts(productData.products || []))
                setCategories(categoryData.categories || [])
            })
            .catch(() => {
                const products = fallbackProducts.filter((product) => {
                    const matchesCategory = selectedCategory ? product.category === selectedCategory : true
                    const matchesSearch = searchKeyword
                        ? [product.name, product.brand, product.category].join(' ').toLowerCase().includes(searchKeyword)
                        : true
                    return matchesCategory && matchesSearch
                })
                setProducts(filterVisibleProducts(products))
                setCategories(fallbackCategories)
                setError('')
            })
            .finally(() => setLoading(false))
    }, [query, searchKeyword, selectedCategory])

    const visibleProducts = products
    const updateFilters = (updates) => {
        const nextParams = new URLSearchParams(searchParams)
        Object.entries(updates).forEach(([key, value]) => {
            if (value) nextParams.set(key, value)
            else nextParams.delete(key)
        })
        setSearchParams(nextParams)
    }
    const showToast = (message) => {
        setToast(message)
        window.setTimeout(() => setToast(''), 1800)
    }

    return (
        <main className="productlist">
            {toast && <div className="store-toast">{toast}</div>}
            <nav className="pl-category-links" aria-label="Product categories">
                <Link className={!selectedCategory ? 'active' : ''} to="/products">All</Link>
                {categories.map((category) => (
                    <Link
                        className={selectedCategory === category.name ? 'active' : ''}
                        key={category.id || category.name}
                        to={`/products?category=${encodeURIComponent(category.name)}`}
                    >
                        {category.name}
                    </Link>
                ))}
            </nav>

            <div className={`pl-mobile-filter ${mobileFilterOpen ? 'open' : ''}`}>
                <button type="button" onClick={() => setMobileFilterOpen((open) => !open)}>
                    Filter Categories
                </button>
                <div>
                    <Link className={!selectedCategory ? 'active' : ''} to="/products" onClick={() => setMobileFilterOpen(false)}>All Products</Link>
                    {categories.map((category) => (
                        <Link
                            className={selectedCategory === category.name ? 'active' : ''}
                            key={category.id || category.name}
                            to={`/products?category=${encodeURIComponent(category.name)}`}
                            onClick={() => setMobileFilterOpen(false)}
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>
            </div>

            <section className="pl-layout">
                <aside className="pl-filter-panel">
                    <h2>Filter</h2>
                    <label>
                        Category
                        <select value={selectedCategory || ''} onChange={(event) => updateFilters({ category: event.target.value })}>
                            <option value="">All categories</option>
                            {categories.map((category) => <option key={category.id || category.name} value={category.name}>{category.name}</option>)}
                        </select>
                    </label>
                    <label>
                        Min price
                        <input value={selectedMinPrice} inputMode="numeric" onChange={(event) => updateFilters({ minPrice: event.target.value.replace(/\D/g, '') })} placeholder="0" />
                    </label>
                    <label>
                        Max price
                        <input value={selectedMaxPrice} inputMode="numeric" onChange={(event) => updateFilters({ maxPrice: event.target.value.replace(/\D/g, '') })} placeholder="500000" />
                    </label>
                    <label className="pl-checkbox">
                        <input checked={selectedInStock} type="checkbox" onChange={(event) => updateFilters({ inStock: event.target.checked ? 'true' : '' })} />
                        In stock only
                    </label>
                    <label>
                        Sort by
                        <select value={selectedSort} onChange={(event) => updateFilters({ sort: event.target.value })}>
                            <option value="newest">Newest</option>
                            <option value="popular">Popular</option>
                            <option value="price-low">Price: low to high</option>
                            <option value="price-high">Price: high to low</option>
                        </select>
                    </label>
                    <button type="button" onClick={() => navigate('/products')}>Clear filters</button>
                </aside>
                <div className="pl-results">
                    {loading && <section className="pl-empty-state"><h2>Loading products...</h2></section>}
                    {error && <section className="pl-empty-state"><h2>{error}</h2></section>}
                    {!loading && !error && visibleProducts.length > 0 ? (
                        <div className="pl-grid">
                            {visibleProducts.map((product) => (
                                <ListingCard key={product.id} product={product} onToast={showToast} />
                            ))}
                        </div>
                    ) : !loading && !error ? (
                        <section className="pl-empty-state">
                            <h2>No products found</h2>
                            <p>Try another search term or browse all electronics categories.</p>
                            <Link to="/products">View all products</Link>
                        </section>
                    ) : null}
                </div>
            </section>
        </main>
    );
}

export default Productlist;
