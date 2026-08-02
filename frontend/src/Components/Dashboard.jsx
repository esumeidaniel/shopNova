import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import heroProducts from '../assets/shopnova-hero-products.png';
import { fallbackCategories, fallbackProducts, getProductImage } from '../productData';
import { hasRealDiscount, visibleProducts } from '../productDisplay';
import { useAuth } from '../useAuth';
import { useStore } from '../useStore';
import './Dashboard.css';

const categoryIcons = {
  Phones: '📱',
  Laptops: '💻',
  Accessories: '🔌',
  Audio: '🎧',
  Gaming: '🎮',
  'Smart TVs': '📺',
  Tablets: '▣',
  'Smart Watches': '⌚',
}

function ProductCard({ product, onToast }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addToCart, toggleWishlist } = useStore();
  const showDiscount = hasRealDiscount(product);
  const inStock = Number(product.stock || 0) > 0;

  return (
    <article className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="product-media">
        <img src={product.image || getProductImage(product.name)} alt={product.name} />
        <div className="badge-row">
          {showDiscount && <span className="discount-badge">{product.discount}</span>}
          {product.featured && <span className="new-badge">NEW</span>}
        </div>
        <button className="wishlist-btn" aria-label={`Add ${product.name} to wishlist`} onClick={(event) => {
          event.stopPropagation();
          if (!isLoggedIn) {
            navigate('/login', { state: { from: '/' } });
            return;
          }
          const saved = toggleWishlist(product);
          onToast(saved ? `${product.name} saved to wishlist` : `${product.name} removed from wishlist`);
        }}>
          ♥
        </button>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="rating">★ 4.7 (128)</p>
        <div className="price-row">
          <strong>{product.price}</strong>
          {showDiscount && <span>{product.oldPrice}</span>}
        </div>
        <p className="stock">{inStock ? 'In Stock' : 'Out of Stock'}</p>
        <button className="cart-btn" onClick={(event) => {
          event.stopPropagation();
          addToCart(product);
          onToast('Added to cart');
        }} aria-label={`Add ${product.name} to cart`} disabled={!inStock}>Add to Cart</button>
      </div>
    </article>
  );
}

function ProductGrid({ products, onToast }) {
  if (products.length === 0) {
    return (
      <section className="home-empty-state">
        <h3>No products here yet</h3>
        <p>Products selected by SHOPNOVA will appear here soon.</p>
        <Link to="/products">Browse Catalog</Link>
      </section>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onToast={onToast} />
      ))}
    </div>
  );
}

const Dashboard = () => {
  const { isLoggedIn } = useAuth();
  const [toast, setToast] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [homeError, setHomeError] = useState('');
  const [settings, setSettings] = useState({});
  const featuredProducts = products.filter((product) => product.featured).slice(0, 8);
  const displayedFeatured = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);
  const bestSellerProducts = products.filter((product) => product.bestSeller).slice(0, 4);
  const displayedBestSellers = bestSellerProducts.length > 0 ? bestSellerProducts : products.slice(8, 12);
  const newArrivals = [...products].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 4);
  const flashDeals = products.filter(hasRealDiscount).slice(0, 4);
  const recommended = products.slice(0, 4);

  useEffect(() => {
    Promise.all([api.products(), api.productCategories(), api.publicSettings()])
      .then(([productData, categoryData, settingsData]) => {
        setProducts(visibleProducts(productData.products || []));
        setCategories(categoryData.categories || []);
        setSettings(settingsData.settings || {});
      })
      .catch(() => {
        setProducts(visibleProducts(fallbackProducts));
        setCategories(fallbackCategories);
        setHomeError('');
      });
  }, []);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 1800);
  };
  const hero = settings.heroSlides?.[0];

  return (
    <main className="dashboard">
      {toast && <div className="store-toast">{toast}</div>}
      {!isLoggedIn && (
        <section className="hero-section">
          <div className="hero-copy">
            <>
              <h1>{hero?.title || 'Your trusted electronics store'}</h1>
              <p>{hero?.subtitle || 'Browse the latest products added by our store team.'}</p>
              <div className="hero-actions">
                <Link to="/products">Browse Products</Link>
                <Link to="/register">Create Account</Link>
              </div>
            </>
          </div>
          <div className="hero-visual">
            <img className="hero-products-image" src={hero?.image || heroProducts} alt="" />
          </div>
        </section>
      )}

      {!isLoggedIn && (
        <section className="content-section">
        <div className="section-heading">
          <div>
            <h2>Shop by Category</h2>
            <p>Choose the type of electronics you want to browse.</p>
          </div>
        </div>
        {homeError && <p className="section-error">{homeError}</p>}
        <div className="category-grid">
          {categories.map((category) => (
            <Link className="category-card" to={`/products?category=${encodeURIComponent(category.name)}`} id={category.name.toLowerCase()} key={category.name}>
              <span>{categoryIcons[category.name] || '▣'}</span>
              <div>
                <h3>{category.name}</h3>
                <p>{category.products} products</p>
              </div>
            </Link>
          ))}
        </div>
        </section>
      )}

      <section className={`content-section ${isLoggedIn ? 'first-shop-section' : ''}`}>
        <div className="section-heading with-action">
          <h2>Featured Products</h2>
          <Link to="/products">View All</Link>
        </div>
        <ProductGrid products={displayedFeatured} onToast={showToast} />
      </section>

      {products.length > 0 && (
        <>
          <section className="content-section">
            <div className="section-heading">
              <h2>Best Sellers</h2>
            </div>
            <ProductGrid products={displayedBestSellers} onToast={showToast} />
          </section>

          <section className="content-section">
            <div className="section-heading with-action">
              <h2>New Arrivals</h2>
              <Link to="/products?sort=newest">See New</Link>
            </div>
            <ProductGrid products={newArrivals} onToast={showToast} />
          </section>

          {flashDeals.length > 0 && (
            <section className="content-section">
              <div className="section-heading with-action">
                <h2>Flash Deals</h2>
                <Link to="/products?sort=popular">View Deals</Link>
              </div>
              <ProductGrid products={flashDeals} onToast={showToast} />
            </section>
          )}

          <section className="content-section">
            <div className="section-heading with-action">
              <h2>Recommended Gadgets</h2>
              <Link to="/products">Browse All</Link>
            </div>
            <ProductGrid products={recommended} onToast={showToast} />
          </section>
        </>
      )}

      {settings.trustItems?.length > 0 && <section className="trust-strip content-section">
        {settings.trustItems.map((item, index) => <article key={`${item.title}-${index}`}><strong>{item.title}</strong><span>{item.text}</span></article>)}
      </section>}

      <section className="reviews-newsletter content-section">
        <div>
          <h2>Customers shop SHOPNOVA for reliable gadgets.</h2>
          <p>Verified reviews will appear here as real orders come in.</p>
        </div>
        <form onSubmit={(event) => {
          event.preventDefault()
          showToast('Thanks. We will keep you updated.')
          event.currentTarget.reset()
        }}>
          <input type="email" placeholder="Email or WhatsApp number" aria-label="Email or WhatsApp number" />
          <button type="submit">Get Updates</button>
        </form>
      </section>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h2>{settings.storeName || 'SHOPNOVA'}</h2>
            <p>{settings.footerDescription || ''}</p>
          </div>
          <div>
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/products">Categories</Link>
            <Link to="/about">About SHOPNOVA</Link>
            <Link to="/contact">Contact Us</Link>
            {isLoggedIn ? (
              <>
                <Link to="/orders">My Orders</Link>
                <Link to="/account/profile">My Account</Link>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
          <div>
            <h3>Customer Service</h3>
            <Link to="/delivery">Delivery Info</Link>
            <Link to="/returns">Returns & Warranty</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/account/orders">My Orders</Link>
            <Link to="/account/profile">My Account</Link>
          </div>
          <div>
            <h3>Contact & App</h3>
            <p>{settings.address}<br />{settings.supportEmail}<br />{settings.phone}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {settings.storeName || 'SHOPNOVA'}. All rights reserved.</span>
          <span>Visa&nbsp;&nbsp; Mastercard&nbsp;&nbsp; Paystack&nbsp;&nbsp; Verve</span>
        </div>
      </footer>
    </main>
  );
};

export default Dashboard;
