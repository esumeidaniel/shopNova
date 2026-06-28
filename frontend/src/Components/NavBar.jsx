import { useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import './NavBar.css'
import { useAuth } from '../useAuth'
import { useStore } from '../useStore'

const NavBar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { isLoggedIn, userEmail, logout } = useAuth()
    const { cartSummary, wishlistItems } = useStore()
    const [mobileOpen, setMobileOpen] = useState(false)
    const menuRef = useRef(null)

    const protectedLink = (path) => (
        isLoggedIn ? { to: path } : { to: '/login', state: { from: path } }
    )
    const accountInitials = (userEmail || 'Customer')
        .split('@')[0]
        .split(/[._\-\s]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('') || 'C'
    const getPageLabel = () => {
        if (location.pathname === '/') return 'SHOPNOVA'
        if (location.pathname.startsWith('/products')) return 'Categories'
        if (location.pathname.startsWith('/product/')) return 'Product'
        if (location.pathname.startsWith('/cart')) return 'Cart'
        if (location.pathname.startsWith('/checkout')) return 'Checkout'
        if (location.pathname.startsWith('/wishlist')) return 'Wishlist'
        if (location.pathname.startsWith('/orders')) return 'Orders'
        if (location.pathname.startsWith('/account')) return 'Profile'
        if (location.pathname.startsWith('/contact')) return 'Contact'
        if (location.pathname.startsWith('/about')) return 'About'
        if (location.pathname.startsWith('/delivery')) return 'Delivery'
        if (location.pathname.startsWith('/returns')) return 'Returns'
        return 'SHOPNOVA'
    }

    const handleLogout = () => {
        logout()
        window.location.replace('/')
    }
    const closeMobileMenu = () => setMobileOpen(false)
    const mobileNavigate = (path) => {
        closeMobileMenu()
        navigate(path)
    }
    const isActivePath = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`)
    const protectedClass = (path) => (isActivePath(path) ? 'active' : undefined)

    return (
        <header className='navbar'>
            <div className="site-header">
                <Link className="brand" to="/">
                    <span className="brand-mark">S</span>
                    <span className="brand-title desktop-brand-title">SHOPNOVA</span>
                    <span className="brand-title mobile-brand-title">{getPageLabel()}</span>
                </Link>

                <form className="search-bar desktop-search" onSubmit={(event) => {
                    event.preventDefault()
                    const keyword = event.currentTarget.elements.search.value.trim()
                    navigate(keyword ? `/products?search=${encodeURIComponent(keyword)}` : '/products')
                }}>
                    <input name="search" aria-label="Search products" placeholder="Search SHOPNOVA products..." />
                    <button type="submit">Search</button>
                </form>

                <div className="header-actions">
                    <NavLink to="/" end>Home</NavLink>
                    <NavLink to="/products">Categories</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                    <Link className={protectedClass('/wishlist')} {...protectedLink('/wishlist')}>Wishlist{wishlistItems.length > 0 && <span className="nav-count">{wishlistItems.length}</span>}</Link>
                    <Link className={protectedClass('/cart')} {...protectedLink('/cart')}>Cart{cartSummary.count > 0 && <span className="nav-count">{cartSummary.count}</span>}</Link>
                    {isLoggedIn ? (
                        <details className="account-menu">
                            <summary aria-label="Open account menu">
                                <span className="account-avatar">{accountInitials}</span>
                            </summary>
                            <div className="account-dropdown">
                                <Link to="/account/profile">Profile</Link>
                                <Link to="/account/orders">Orders</Link>
                                <Link to="/account/addresses">Addresses</Link>
                                <button type="button" onClick={handleLogout}>Logout</button>
                            </div>
                        </details>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link className="account-link" to="/register">Register</Link>
                        </>
                    )}
                </div>

                <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} ref={menuRef}>
                    <button
                        className="mobile-menu-trigger"
                        type="button"
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-menu-panel"
                        onClick={() => setMobileOpen((open) => !open)}
                    >
                        Menu
                    </button>
                    <div className="mobile-menu-panel" id="mobile-menu-panel">
                        <div className="mobile-menu-top">
                            <strong>Menu</strong>
                            <button type="button" onClick={closeMobileMenu}>Close</button>
                        </div>
                        <form className="search-bar mobile-search" onSubmit={(event) => {
                            event.preventDefault()
                            const keyword = event.currentTarget.elements.search.value.trim()
                            mobileNavigate(keyword ? `/products?search=${encodeURIComponent(keyword)}` : '/products')
                        }}>
                            <input name="search" aria-label="Search products" placeholder="Search products..." />
                            <button type="submit">Search</button>
                        </form>

                        <NavLink to="/" end onClick={closeMobileMenu}>Home</NavLink>
                        <NavLink to="/products" onClick={closeMobileMenu}>Categories</NavLink>
                        <NavLink to="/contact" onClick={closeMobileMenu}>Contact</NavLink>
                        <Link className={protectedClass('/wishlist')} {...protectedLink('/wishlist')} onClick={closeMobileMenu}>Wishlist{wishlistItems.length > 0 && <span className="nav-count">{wishlistItems.length}</span>}</Link>
                        <Link className={protectedClass('/cart')} {...protectedLink('/cart')} onClick={closeMobileMenu}>Cart{cartSummary.count > 0 && <span className="nav-count">{cartSummary.count}</span>}</Link>
                        {isLoggedIn ? (
                            <>
                                <Link to="/account/profile" onClick={closeMobileMenu}>Profile</Link>
                                <Link to="/account/orders" onClick={closeMobileMenu}>Orders</Link>
                                <button type="button" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={closeMobileMenu}>Login</Link>
                                <Link to="/register" onClick={closeMobileMenu}>Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default NavBar;
