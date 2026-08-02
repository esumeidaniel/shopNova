import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api'
import { emptyProduct, fallbackProducts, getProductById, getProductImage } from '../../productData'
import { hasRealDiscount, visibleProducts } from '../../productDisplay'
import { useAuth } from '../../useAuth'
import { useStore } from '../../useStore'
import './ProductDetail.css'

function getProductOptions(product) {
    if (!product.name) return []
    const name = product.name.toLowerCase()
    if (name.includes('laptop') || name.includes('elitebook')) {
        return [
            ['Memory', ['8GB RAM', '16GB RAM', '32GB RAM']],
            ['Storage', ['256GB SSD', '512GB SSD', '1TB SSD']],
        ]
    }
    if (name.includes('tv')) {
        return [
            ['Screen Size', ['43"', '50"', '55"']],
            ['Display', ['LED', 'QLED', 'UHD']],
        ]
    }
    if (name.includes('earbuds') || name.includes('airpods') || name.includes('headphones')) {
        return [
            ['Color', ['White', 'Black', 'Blue']],
            ['Fit', ['Standard', 'Sport', 'Comfort']],
        ]
    }
    if (name.includes('cable') || name.includes('adapter') || name.includes('charger') || name.includes('power bank')) {
        return [
            ['Connector', ['USB-C', 'Lightning', 'Micro USB']],
            ['Power', ['20W', '33W', '65W']],
        ]
    }
    if (name.includes('watch')) {
        return [
            ['Color', ['Black', 'Silver', 'Gold']],
            ['Band Size', ['S/M', 'M/L', 'XL']],
        ]
    }
    return [
        ['Color', ['Natural', 'Blue', 'Black']],
        ['Storage', ['128GB', '256GB', '512GB']],
    ]
}

function getProductSpecs(product) {
    if (!product.name) return []
    const name = product.name.toLowerCase()
    if (name.includes('laptop') || name.includes('elitebook')) return ['Processor: Intel Core i5/i7', 'Memory: up to 32GB RAM', 'Warranty: 1 year']
    if (name.includes('tv')) return ['Display: UHD Smart TV', 'Connectivity: HDMI, USB, Wi-Fi', 'Warranty: 1 year']
    if (name.includes('earbuds') || name.includes('headphones') || name.includes('airpods')) return ['Battery: up to 24 hours', 'Connectivity: Bluetooth', 'Warranty: 6 months']
    if (name.includes('cable') || name.includes('adapter') || name.includes('charger') || name.includes('power bank')) return ['Fast charging support', 'Device compatibility: USB-C and mobile devices', 'Warranty: 6 months']
    return ['Storage: up to 256GB', 'Display: high-resolution screen', 'Warranty: 1 year']
}

function RelatedCard({ product, onToast }) {
    const navigate = useNavigate()
    const { isLoggedIn } = useAuth()
    const { addToCart, toggleWishlist } = useStore()
    const showDiscount = hasRealDiscount(product)
    const handleAddToCart = () => {
        addToCart(product)
        onToast(`${product.name} added to cart`)
    }

    return (
        <article className="pd-card">
            <div className="pd-card-media">
                {product.image && <img src={product.image || getProductImage(product.name)} alt={product.name} />}
                {showDiscount && <span>{product.discount}</span>}
                <button aria-label={`Save ${product.name} to wishlist`} onClick={() => {
                    if (!isLoggedIn) {
                        navigate('/login', { state: { from: `/product/${product.id}` } })
                        return
                    }
                    toggleWishlist(product)
                    onToast(`${product.name} saved to wishlist`)
                }}>♡</button>
            </div>
            <div className="pd-card-body">
                <Link className="pd-card-title" to={`/product/${product.id}`}>{product.name}</Link>
                <p>★ 4.7 (128)</p>
                <div>
                    <strong>{product.price}</strong>
                    {showDiscount && <span>{product.oldPrice}</span>}
                </div>
                <small>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</small>
                <button type="button" onClick={handleAddToCart}>Add to Cart</button>
            </div>
        </article>
    )
}

const ProductDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isLoggedIn } = useAuth()
    const { addToCart, toggleWishlist } = useStore()
    const [toast, setToast] = useState('')
    const [product, setProduct] = useState(() => getProductById(id))
    const [relatedProducts, setRelatedProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const optionGroups = useMemo(() => getProductOptions(product), [product])
    const specs = useMemo(() => getProductSpecs(product), [product])
    const galleryImages = product.images?.length ? product.images : [product.image].filter(Boolean)
    const [selectedImage, setSelectedImage] = useState(product.image)
    const [quantity, setQuantity] = useState(1)
    const [selectedOptions, setSelectedOptions] = useState(() => Object.fromEntries(
        optionGroups.map(([label, options]) => [label, options[1] || options[0]]),
    ))
    const showDiscount = hasRealDiscount(product)
    const inStock = Number(product.stock || 0) > 0
    useEffect(() => {
        setLoading(true)
        setError('')
        api.product(id)
            .then(({ product }) => {
                setProduct({
                    ...getProductById(product.id),
                    ...product,
                })
            })
            .catch(() => {
                setProduct({ ...emptyProduct, id })
                setError('')
            })
            .finally(() => setLoading(false))
    }, [id])

    useEffect(() => {
        setSelectedImage(product.image || '')
        setQuantity(1)
        setSelectedOptions(Object.fromEntries(
            optionGroups.map(([label, options]) => [label, options[1] || options[0]]),
        ))
    }, [optionGroups, product.id, product.image])

    useEffect(() => {
        if (!product.category) return

        api.products(`?category=${encodeURIComponent(product.category)}`)
            .then(({ products }) => {
                setRelatedProducts(visibleProducts(products).filter((item) => item.id !== product.id).slice(0, 4))
            })
            .catch(() => {
                setRelatedProducts(visibleProducts(fallbackProducts).filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4))
            })
    }, [product.category, product.id])
    const showToast = (message) => {
        setToast(message)
        window.setTimeout(() => setToast(''), 1800)
    }
    const handleAddToCart = () => {
        if (!product.id || !product.name) return
        addToCart(product, selectedOptions, quantity)
        showToast(`${product.name} added to cart`)
    }
    const handleBuyNow = () => {
        if (!product.id || !product.name) return
        addToCart(product, selectedOptions, quantity)
        navigate('/checkout')
    }

    if (!loading && !product.name) {
        return (
            <main className="product-detail">
                <section className="pd-details-panel">
                    <h1>Product not found</h1>
                    <p>This product is not available yet. Add products from the admin panel to make them appear in the store.</p>
                    <Link to="/products">Back to products</Link>
                </section>
            </main>
        )
    }

    return (
        <main className="product-detail">
            {toast && <div className="store-toast">{toast}</div>}
            {loading && <div className="store-toast">Loading product...</div>}
            {error && <div className="store-toast">{error}</div>}
            <section className="pd-page-heading">
                <h1>Product Details</h1>
                <p>Review product specifications, choose options, and checkout securely.</p>
            </section>

            <nav className="pd-breadcrumb" aria-label="Breadcrumb">
                <Link to="/">Home</Link> / <Link to="/products">Products</Link> / {product.name}
            </nav>

            <section className="pd-main">
                <div className="pd-gallery">
                    <div className="pd-image">
                        {selectedImage && <img src={selectedImage} alt={product.name} />}
                    </div>
                    {galleryImages.length > 0 && (
                        <div className="pd-thumbs">
                            {galleryImages.map((image, index) => (
                                <button className={selectedImage === image ? 'active' : ''} key={`${image}-${index}`} type="button" onClick={() => setSelectedImage(image)}>
                                    <img src={image} alt="" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pd-info">
                    <p className="pd-brand-name">{product.brand}</p>
                    <h2>{product.name}</h2>
                    <p className="pd-rating">★ 4.8 (2,481 reviews)</p>

                    <div className="pd-price-row">
                        <strong>{product.price}</strong>
                        {showDiscount && <span>{product.oldPrice}</span>}
                        {showDiscount && <b>{product.discount}</b>}
                    </div>

                    <p className={`pd-stock ${inStock ? '' : 'out'}`}><span /> {inStock ? `${product.stock} in stock` : 'Out of stock'}</p>

                    {optionGroups.map(([label, options]) => (
                        <div className="pd-option-group" key={label}>
                            <h3>{label}</h3>
                            <div>
                                {options.map((option) => (
                                    <button
                                        className={selectedOptions[label] === option ? 'active' : ''}
                                        key={option}
                                        type="button"
                                        onClick={() => setSelectedOptions((current) => ({ ...current, [label]: option }))}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="pd-quantity">
                        <h3>Quantity</h3>
                        <div>
                            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
                            <span>{quantity}</span>
                            <button type="button" onClick={() => setQuantity((value) => Math.min(Number(product.stock || 1), value + 1))}>+</button>
                        </div>
                    </div>

                    <div className="pd-purchase-actions">
                        <button type="button" onClick={handleAddToCart} disabled={!inStock}>Add to Cart</button>
                        <button type="button" onClick={handleBuyNow} disabled={!inStock}>Buy Now</button>
                    </div>

                    <button className="pd-save" onClick={() => {
                        if (!isLoggedIn) {
                            navigate('/login', { state: { from: `/product/${product.id}` } })
                            return
                        }
                        const saved = toggleWishlist(product)
                        showToast(saved ? `${product.name} saved to wishlist` : `${product.name} removed from wishlist`)
                    }}>♡ Save to Wishlist</button>
                </div>
            </section>

            <section className="pd-details-panel">
                <div className="pd-tabs">
                    <button>Description</button>
                    <button>Specifications</button>
                    <button>Reviews</button>
                    <button>Q&amp;A</button>
                </div>
                <p>{product.name} ships from the SHOPNOVA catalog with secure checkout, fast delivery, and customer support.</p>
                <div className="pd-spec-box">
                    <h3>Specifications</h3>
                    <p>{specs.map((spec) => <span key={spec}>{spec}<br /></span>)}</p>
                </div>
                <div className="pd-spec-box">
                    <h3>Customer Reviews</h3>
                    <p>Reviews will appear here after customers start buying this product.</p>
                </div>
            </section>

            {relatedProducts.length > 0 && (
                <section className="pd-related">
                    <h2>You May Also Like</h2>
                    <div className="pd-related-grid">
                        {relatedProducts.map((product) => (
                            <RelatedCard key={product.id} product={product} onToast={showToast} />
                        ))}
                    </div>
                </section>
            )}
        </main>
    )
}

export default ProductDetail
