import { Link } from 'react-router-dom'
import { useStore } from '../../useStore'
import { hasRealDiscount, visibleProducts } from '../../productDisplay'
import './Wishlist.css'

function WishlistCard({ item }) {
    const { addToCart, removeFromWishlist } = useStore()
    const showDiscount = hasRealDiscount(item)

    return (
        <article className="wishlist-card">
            <div className="wishlist-media">
                <img src={item.image} alt={item.name} />
                <div>
                    {showDiscount && <span>{item.discount}</span>}
                </div>
                <button aria-label={`Remove ${item.name} from wishlist`} onClick={() => removeFromWishlist(item.id)}>♡</button>
            </div>
            <div className="wishlist-body">
                <Link className="wishlist-title" to={`/product/${item.id}`}>{item.name}</Link>
                <p>★ 4.7 (128)</p>
                <div className="wishlist-price">
                    <strong>{item.price}</strong>
                    {showDiscount && <span>{item.oldPrice}</span>}
                </div>
                <small>In Stock</small>
                <Link to="/cart" onClick={() => addToCart(item.id)}>Add to Cart</Link>
            </div>
        </article>
    )
}

const Wishlist = () => {
    const { wishlistItems } = useStore()
    const visibleWishlistItems = visibleProducts(wishlistItems)

    return (
        <main className="wishlist-page">
           
            {visibleWishlistItems.length > 0 ? (
                <section className="wishlist-grid">
                    {visibleWishlistItems.map((item, index) => (
                        <WishlistCard key={item.id || `${item.name}-${index}`} item={item} />
                    ))}
                </section>
            ) : (
                <section className="wishlist-empty">
                    <h2>Your wishlist is empty</h2>
                    <p>Save electronics you want to compare or buy later.</p>
                    <Link to="/products">Explore Products</Link>
                </section>
            )}
        </main>
    )
}

export default Wishlist
