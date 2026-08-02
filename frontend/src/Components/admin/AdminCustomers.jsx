import { useEffect, useState } from 'react'
import { api } from '../../api'

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const visibleCustomers = customers.filter((customer) => {
    const haystack = [customer.firstName, customer.lastName, customer.email].join(' ').toLowerCase()
    return search ? haystack.includes(search.toLowerCase()) : true
  })

  useEffect(() => {
    api.adminCustomers()
      .then(({ customers }) => setCustomers(customers))
      .catch((error) => setError(error.message))
  }, [])

  return (
    <section className="admin-page">
      <article className="admin-panel">
        <div className="admin-panel-heading">
          <h3>Customers</h3>
          <input className="admin-search" aria-label="Search customers" placeholder="Search customers" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        {error && <p>{error}</p>}
        {visibleCustomers.length === 0 && !error && (
          <div className="admin-empty-state">
            <h3>No customers yet</h3>
            <p>Customers will appear here after registration or orders.</p>
          </div>
        )}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleCustomers.map((customer) => (
                <tr key={customer.email}>
                  <td>{`${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email}</td>
                  <td>{customer.email}</td>
                  <td>{customer.cart?.length || 0}</td>
                  <td>Live account</td>
                  <td><span className="admin-chip active">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}

export default AdminCustomers
