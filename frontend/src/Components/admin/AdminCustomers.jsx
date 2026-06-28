import { useEffect, useState } from 'react'
import { api } from '../../api'

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.adminCustomers()
      .then(({ customers }) => setCustomers(customers))
      .catch((error) => setError(error.message))
  }, [])

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <h2>Customers</h2>
          <p>View customer accounts, order history, and spending activity.</p>
        </div>
      </div>

      <article className="admin-panel">
        <div className="admin-panel-heading">
          <h3>Customer List</h3>
          <input className="admin-search" aria-label="Search customers" placeholder="Search customers" />
        </div>
        {error && <p>{error}</p>}
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
              {customers.map((customer) => (
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
