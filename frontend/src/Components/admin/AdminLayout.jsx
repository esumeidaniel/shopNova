import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../useAuth'
import './AdminLayout.css'

const navItems = [
  ['Dashboard', '/admin'],
  ['Products', '/admin/products'],
  ['Orders', '/admin/orders'],
  ['Customers', '/admin/customers'],
  ['Categories', '/admin/categories'],
  ['Inventory', '/admin/inventory'],
  ['Coupons', '/admin/coupons'],
  ['Settings', '/admin/settings'],
]

function getInitials(email) {
  if (!email) return 'A'
  return email.slice(0, 2).toUpperCase()
}

const AdminLayout = () => {
  const navigate = useNavigate()
  const { logout, userEmail } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <NavLink className="admin-brand" to="/admin" end>
          <span>S</span>
          <strong>SHOPNOVA Admin</strong>
        </NavLink>

        <nav className="admin-nav" aria-label="Admin navigation">
          {navItems.map(([label, path]) => (
            <NavLink key={path} to={path} end={path === '/admin'}>
              {label}
            </NavLink>
          ))}
        </nav>

        <button className="admin-store-link" type="button" onClick={() => navigate('/')}>
          View Store
        </button>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p>Owner workspace</p>
            <h1>Manage SHOPNOVA</h1>
          </div>
          <div className="admin-user">
            <span>{getInitials(userEmail)}</span>
            <button type="button" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <Outlet />
      </section>
    </main>
  )
}

export default AdminLayout
