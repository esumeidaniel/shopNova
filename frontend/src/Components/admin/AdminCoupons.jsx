import { useEffect, useState } from 'react'
import { api } from '../../api'
import { AdminToast, ConfirmModal, FormModal } from './AdminUi'

const emptyCoupon = {
  code: '',
  discount: '',
  status: 'Active',
  usageLimit: '',
  expiresAt: '',
}

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([])
  const [formCoupon, setFormCoupon] = useState(emptyCoupon)
  const [editingId, setEditingId] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast({ message: '', type }), 2200)
  }

  useEffect(() => {
    api.adminCoupons()
      .then(({ coupons }) => setCoupons(coupons))
      .catch((error) => showToast(error.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  const openAddModal = () => {
    setEditingId('')
    setFormCoupon(emptyCoupon)
    setFormOpen(true)
  }

  const openEditModal = (coupon) => {
    setEditingId(coupon.id)
    setFormCoupon({
      code: coupon.code || '',
      discount: coupon.discount || '',
      status: coupon.status || 'Active',
      usageLimit: coupon.usageLimit || '',
      expiresAt: coupon.expiresAt || '',
    })
    setFormOpen(true)
  }

  const closeModal = () => {
    setFormOpen(false)
    setEditingId('')
    setFormCoupon(emptyCoupon)
  }

  const updateCoupon = (field, value) => {
    setFormCoupon((coupon) => ({ ...coupon, [field]: value }))
  }

  const saveCoupon = async (event) => {
    event.preventDefault()
    setSaving(true)

    try {
      const result = editingId
        ? await api.updateCoupon(editingId, formCoupon)
        : await api.createCoupon(formCoupon)
      setCoupons((items) => (
        editingId
          ? items.map((item) => (item.id === result.coupon.id ? result.coupon : item))
          : [...items, result.coupon]
      ))
      showToast(editingId ? 'Coupon updated' : 'Coupon created')
      closeModal()
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const deleteCoupon = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    try {
      await api.deleteCoupon(deleteTarget.id)
      setCoupons((items) => items.filter((item) => item.id !== deleteTarget.id))
      setDeleteTarget(null)
      showToast('Coupon deleted')
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="admin-page">
      <AdminToast message={toast.message} type={toast.type} />

      <article className="admin-panel">
        <div className="admin-panel-heading">
          <h3>Coupons</h3>
          <button className="admin-primary-action" type="button" onClick={openAddModal}>Create Coupon</button>
        </div>
        {loading && <p>Loading coupons...</p>}
        {!loading && coupons.length === 0 && (
          <div className="admin-empty-state">
            <h3>No coupons yet</h3>
            <p>Create a coupon to offer discounts.</p>

          </div>
        )}
        {coupons.length > 0 && (
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
                  <tr key={coupon.id}>
                    <td>{coupon.code}</td>
                    <td>{coupon.discount}</td>
                    <td>{coupon.usage || 0}</td>
                    <td><span className={`admin-chip ${String(coupon.status).toLowerCase()}`}>{coupon.status}</span></td>
                    <td>
                      <div className="admin-action-row">
                        <button className="admin-table-action" type="button" onClick={() => openEditModal(coupon)}>Edit</button>
                        <button className="admin-table-action danger" type="button" onClick={() => setDeleteTarget(coupon)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      <FormModal open={formOpen} title={editingId ? 'Edit Coupon' : 'Create Coupon'} onClose={closeModal}>
        <form className="admin-compact-form" onSubmit={saveCoupon}>
          <label>
            Coupon code
            <input value={formCoupon.code} onChange={(event) => updateCoupon('code', event.target.value.toUpperCase())} required />
          </label>
          <label>
            Discount
            <input value={formCoupon.discount} onChange={(event) => updateCoupon('discount', event.target.value)} placeholder="10% or ₦5000" required />
          </label>
          <label>
            Status
            <select value={formCoupon.status} onChange={(event) => updateCoupon('status', event.target.value)}>
              <option>Active</option>
              <option>Disabled</option>
            </select>
          </label>
          <label>
            Usage limit
            <input value={formCoupon.usageLimit} onChange={(event) => updateCoupon('usageLimit', event.target.value)} placeholder="Optional" />
          </label>
          <label>
            Expiry date
            <input type="date" value={formCoupon.expiresAt} onChange={(event) => updateCoupon('expiresAt', event.target.value)} />
          </label>
          <div className="admin-modal-actions">
            <button className="admin-secondary-action" type="button" onClick={closeModal}>Cancel</button>
            <button className="admin-primary-action" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Coupon'}</button>
          </div>
        </form>
      </FormModal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete this coupon?"
        message="This action cannot be undone."
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={deleteCoupon}
      />
    </section>
  )
}

export default AdminCoupons
