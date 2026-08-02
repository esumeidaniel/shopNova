export function AdminToast({ message, type = 'success' }) {
  if (!message) return null
  return <div className={`admin-toast ${type}`}>{message}</div>
}

export function ConfirmModal({ open, title, message, loading, onCancel, onConfirm }) {
  if (!open) return null

  return (
    <div className="admin-modal-overlay" role="presentation">
      <section className="admin-modal admin-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <h3 id="confirm-title">{title}</h3>
        <p>{message}</p>
        <div className="admin-modal-actions">
          <button className="admin-secondary-action" type="button" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="admin-danger-action" type="button" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </section>
    </div>
  )
}

export function FormModal({ open, title, children, onClose }) {
  if (!open) return null

  return (
    <div className="admin-modal-overlay" role="presentation">
      <section className="admin-modal admin-form-modal" role="dialog" aria-modal="true" aria-labelledby="form-modal-title">
        <div className="admin-modal-heading">
          <h3 id="form-modal-title">{title}</h3>
          <button className="admin-icon-action" type="button" aria-label="Close" onClick={onClose}>×</button>
        </div>
        {children}
      </section>
    </div>
  )
}
