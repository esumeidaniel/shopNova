import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import AdminCategories from './Components/admin/AdminCategories'
import AdminCoupons from './Components/admin/AdminCoupons'
import AdminCustomers from './Components/admin/AdminCustomers'
import AdminDashboard from './Components/admin/AdminDashboard'
import AdminInventory from './Components/admin/AdminInventory'
import AdminLayout from './Components/admin/AdminLayout'
import AdminOrders from './Components/admin/AdminOrders'
import AdminProducts from './Components/admin/AdminProducts'
import AdminSettings from './Components/admin/AdminSettings'
import Cart from './Components/pages/Cart'
import Checkout from './Components/pages/Checkout'
import Dashboard from './Components/Dashboard'
import ForgotPassword from './Components/ForgotPassword'
import Login from './Components/Login'
import NavBar from './Components/NavBar'
import NotFound from './Components/pages/NotFound'
import OrderDetails from './Components/pages/OrderDetails'
import OrderSuccess from './Components/pages/OrderSuccess'
import Orders from './Components/pages/Orders'
import Profile from './Components/pages/Profile'
import ProductDetail from './Components/pages/ProductDetail'
import Productlist from './Components/Productlist'
import Signup from './Components/Signup'
import TrustPage from './Components/pages/TrustPage'
import Wishlist from './Components/pages/Wishlist'
import { AuthProvider } from './auth'
import { StoreProvider } from './store'
import { useAuth } from './useAuth'

import './App.css'

function PublicPage({ children }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  )
}

function StorePage({ children }) {
  return (
    <div className="store-shell">
      <NavBar />
      {children}
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

function AdminRoute({ children }) {
  const { isAdmin, isLoggedIn } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search])

  return null
}

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<PublicPage><Dashboard /></PublicPage>} />
          <Route path="/products" element={<PublicPage><Productlist /></PublicPage>} />
          <Route path="/product/:id" element={<PublicPage><ProductDetail /></PublicPage>} />
          <Route path="/about" element={<PublicPage><TrustPage type="about" /></PublicPage>} />
          <Route path="/contact" element={<PublicPage><TrustPage type="contact" /></PublicPage>} />
          <Route path="/delivery" element={<PublicPage><TrustPage type="delivery" /></PublicPage>} />
          <Route path="/returns" element={<PublicPage><TrustPage type="returns" /></PublicPage>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/cart" element={<ProtectedRoute><StorePage><Cart /></StorePage></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><StorePage><Checkout /></StorePage></ProtectedRoute>} />
          <Route path="/order-success" element={<ProtectedRoute><StorePage><OrderSuccess /></StorePage></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><StorePage><Orders /></StorePage></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><StorePage><OrderDetails /></StorePage></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><StorePage><Wishlist /></StorePage></ProtectedRoute>} />
          <Route path="/account" element={<Navigate to="/account/profile" replace />} />
          <Route path="/account/profile" element={<ProtectedRoute><StorePage><Profile section="profile" /></StorePage></ProtectedRoute>} />
          <Route path="/account/addresses" element={<ProtectedRoute><StorePage><Profile section="addresses" /></StorePage></ProtectedRoute>} />
          <Route path="/account/notifications" element={<ProtectedRoute><StorePage><Profile section="notifications" /></StorePage></ProtectedRoute>} />
          <Route path="/account/security" element={<ProtectedRoute><StorePage><Profile section="security" /></StorePage></ProtectedRoute>} />
          <Route path="/account/orders" element={<ProtectedRoute><StorePage><Orders /></StorePage></ProtectedRoute>} />
          <Route path="/account/orders/:id" element={<ProtectedRoute><StorePage><OrderDetails /></StorePage></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<PublicPage><NotFound /></PublicPage>} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </AuthProvider>
  )
}

export default App
