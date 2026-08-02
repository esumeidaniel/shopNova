import { useEffect, useState } from 'react'
import { api } from '../../api'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [message, setMessage] = useState('Loading reviews…')

  useEffect(() => {
    api.adminReviews().then(({ reviews }) => {
      setReviews(reviews)
      setMessage('')
    }).catch((error) => setMessage(error.message))
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const { review } = await api.updateAdminReview(id, { status })
      setReviews((items) => items.map((item) => item.id === id ? review : item))
      setMessage('Review updated')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return <section className="admin-page">
    <div className="admin-section-header"><h2>Reviews</h2></div>
    {message && <p>{message}</p>}
    {reviews.length === 0 && !message ? <div className="admin-empty"><h3>No customer reviews yet</h3><p>Verified product reviews will appear here when review collection is enabled.</p></div> :
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Customer</th><th>Rating</th><th>Review</th><th>Status</th><th>Moderation</th></tr></thead><tbody>
        {reviews.map((review) => <tr key={review.id}><td>{review.productName}</td><td>{review.customerName}</td><td>{review.rating}/5</td><td>{review.comment}</td><td>{review.status}</td><td><select value={review.status} onChange={(event) => updateStatus(review.id, event.target.value)}><option>Pending</option><option>Published</option><option>Hidden</option></select></td></tr>)}
      </tbody></table></div>}
  </section>
}
