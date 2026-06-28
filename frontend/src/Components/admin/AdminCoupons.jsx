import { useEffect, useState } from 'react'
import { api } from '../../api'

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.adminCoupons()
      .then(({ coupons }) => setCoupons(coupons))
      .catch((error) => setError(error.message))
  }, [])

  const createCoupon = async () => {
    const code = window.prompt('Coupon code')
    if (!code) return
    const { coupon } = await api.createCoupon({ code, discount: '10%' })
    setCoupons((items) => [...items, coupon])
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <h2>Coupons</h2>
          <p>Create discount codes for campaigns, loyal customers, and seasonal sales.</p>
        </div>
        <button className="admin-primary-action" type="button" onClick={createCoupon}>Create Coupon</button>
      </div>

      <article className="admin-panel">
        {error && <p>{error}</p>}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Usage</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.code}>
                  <td>{coupon.code}</td>
                  <td>{coupon.discount}</td>
                  <td>{coupon.usage}</td>
                  <td><span className="admin-chip active">{coupon.status}</span></td>
                  <td><button className="admin-table-action" type="button">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}

export default AdminCoupons
