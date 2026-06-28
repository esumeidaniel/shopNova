import { Link } from 'react-router-dom'
import './NotFound.css'

const NotFound = () => {
  return (
    <main className="not-found-page">
      <section>
        <span>404</span>
        <h1>Page not found</h1>
        <p>The page you are looking for may have moved. Continue shopping from the electronics catalog.</p>
        <div>
          <Link to="/">Go Home</Link>
          <Link to="/products">Browse Products</Link>
        </div>
      </section>
    </main>
  )
}

export default NotFound
