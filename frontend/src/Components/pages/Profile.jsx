import { Link, NavLink } from 'react-router-dom'
import './Profile.css'
import { useAuth } from '../../useAuth'
import { useEffect, useState } from 'react'
import { api } from '../../api'

const preferences = [
    ['orderUpdates', 'Order updates'],
    ['promotions', 'Promotions'],
    ['newArrivals', 'New arrivals'],
    ['whatsapp', 'WhatsApp notifications'],
    ['newsletters', 'Email newsletters'],
]

const Profile = ({ section = 'profile' }) => {
    const { user } = useAuth()
    const [profile, setProfile] = useState(user || {})
    const [addresses, setAddresses] = useState([])
    const [orderCount, setOrderCount] = useState(0)
    const [message, setMessage] = useState('')
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [addressForm, setAddressForm] = useState({ label: 'Home', fullName: '', phone: '', address: '', city: '', state: '' })
    const showProfile = section === 'profile'
    const showAddresses = section === 'addresses'
    const showNotifications = section === 'notifications'
    const showSecurity = section === 'security'

    useEffect(() => {
        api.profile()
            .then(({ user }) => setProfile(user))
            .catch((error) => setMessage(error.message))
        api.addresses()
            .then(({ addresses }) => setAddresses(addresses))
            .catch(() => {})
        api.orders()
            .then(({ orders }) => setOrderCount(orders.length))
            .catch(() => {})
    }, [])

    const updateProfileField = (field, value) => {
        setProfile((current) => ({ ...current, [field]: value }))
    }

    const saveProfile = async () => {
        const { user } = await api.updateProfile(profile)
        setProfile(user)
        setMessage('Profile saved')
    }

    const addAddress = async () => {
        try {
            const { address } = await api.createAddress(addressForm)
            setAddresses((items) => [...items, address])
            setAddressForm({ label: 'Home', fullName: '', phone: '', address: '', city: '', state: '' })
            setShowAddressForm(false)
            setMessage('Address saved')
        } catch (error) {
            setMessage(error.message)
        }
    }

    const deleteAddress = async (id) => {
        await api.deleteAddress(id)
        setAddresses((items) => items.filter((item) => item.id !== id))
    }
    const completionItems = [
        profile.firstName,
        profile.lastName,
        profile.email,
        profile.phone,
        addresses.length > 0,
    ]
    const profileCompletion = Math.round((completionItems.filter(Boolean).length / completionItems.length) * 100)

    return (
        <main className="profile-page">


            <section className="profile-layout">
                <section className="profile-main-card">
                    {message && <p>{message}</p>}
                    <nav className="account-shortcuts" aria-label="Account sections">
                        <NavLink to="/account/profile">Profile</NavLink>
                        <NavLink to="/account/addresses">Addresses</NavLink>
                        <NavLink to="/account/notifications">Notifications</NavLink>
                        <NavLink to="/account/security">Security</NavLink>
                    </nav>

                    {showProfile && (
                        <>
                            <div className="photo-row">
                                <div className="profile-avatar" />
                                <div>
                                    <h2 id="profile">Profile</h2>
                                    <p>Update your customer information.</p>
                                </div>
                            </div>

                            <form className="profile-form">
                                <label>First name<input placeholder="First name" aria-label="First name" value={profile.firstName || ''} onChange={(event) => updateProfileField('firstName', event.target.value)} /></label>
                                <label>Last name<input placeholder="Last name" aria-label="Last name" value={profile.lastName || ''} onChange={(event) => updateProfileField('lastName', event.target.value)} /></label>
                                <label>Email<input placeholder={profile.emailVerified ? 'Email verified' : 'Email not verified'} aria-label="Email" value={profile.email ? `${profile.email}${profile.emailVerified ? ' ✓ Verified' : ' • Not verified'}` : ''} readOnly /></label>
                                <label>Phone<input placeholder="Phone" aria-label="Phone" value={profile.phone || ''} onChange={(event) => updateProfileField('phone', event.target.value)} /></label>
                                <label>Date of birth<input placeholder="Date of Birth" aria-label="Date of Birth" value={profile.dateOfBirth || ''} onChange={(event) => updateProfileField('dateOfBirth', event.target.value)} /></label>
                                <label>Gender<input placeholder="Gender" aria-label="Gender" value={profile.gender || ''} onChange={(event) => updateProfileField('gender', event.target.value)} /></label>
                            </form>

                            <button className="save-profile" onClick={saveProfile}>Save Changes</button>
                        </>
                    )}

                    {showAddresses && (
                        <section className="account-section-card">
                            <div className="account-section-header">
                                <h2>Saved Addresses</h2>
                                <button className="save-profile compact" onClick={() => setShowAddressForm((value) => !value)}>Add New Address</button>
                            </div>
                            {showAddressForm && <form className="profile-form" onSubmit={(event) => { event.preventDefault(); addAddress() }}>
                                <label>Label<input value={addressForm.label} onChange={(event) => setAddressForm((form) => ({ ...form, label: event.target.value }))} /></label>
                                <label>Full name<input required value={addressForm.fullName} onChange={(event) => setAddressForm((form) => ({ ...form, fullName: event.target.value }))} /></label>
                                <label>Phone<input required value={addressForm.phone} onChange={(event) => setAddressForm((form) => ({ ...form, phone: event.target.value }))} /></label>
                                <label>Address<input required value={addressForm.address} onChange={(event) => setAddressForm((form) => ({ ...form, address: event.target.value }))} /></label>
                                <label>City<input required value={addressForm.city} onChange={(event) => setAddressForm((form) => ({ ...form, city: event.target.value }))} /></label>
                                <label>State<input required value={addressForm.state} onChange={(event) => setAddressForm((form) => ({ ...form, state: event.target.value }))} /></label>
                                <button className="save-profile compact">Save Address</button>
                            </form>}
                            {addresses.length > 0 ? (
                                <div className="address-list">
                                    {addresses.map((address) => (
                                        <article key={address.id}>
                                            <strong>{address.label || 'Address'} {address.isDefault ? '• Default' : ''}</strong>
                                            <p>{address.address} {address.city ? `• ${address.city}` : ''} {address.phone ? `• ${address.phone}` : ''}</p>
                                            <div>
                                                <button onClick={() => deleteAddress(address.id)}>Delete</button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <div className="account-empty-state">
                                    <h3>No saved addresses yet</h3>
                                    <p>Add a delivery address to make checkout faster.</p>
                                    <button className="save-profile compact" onClick={() => setShowAddressForm(true)}>Add New Address</button>
                                </div>
                            )}
                        </section>
                    )}

                    {showNotifications && (
                        <section className="account-section-card">
                            <h2>Notification Preferences</h2>
                            <div className="notification-list">
                                {preferences.map(([key, label]) => (
                                    <label key={key}>
                                        <span>{label}</span>
                                        <input
                                            type="checkbox"
                                            checked={profile.notifications?.[key] ?? true}
                                            onChange={(event) => setProfile((current) => ({
                                                ...current,
                                                notifications: {
                                                    ...(current.notifications || {}),
                                                    [key]: event.target.checked,
                                                },
                                            }))}
                                        />
                                    </label>
                                ))}
                            </div>
                            <button className="save-profile" onClick={saveProfile}>Save Notifications</button>
                        </section>
                    )}

                    {showSecurity && (
                        <section className="password-section account-section-card">
                            <h2>Change Password</h2>
                            <form onSubmit={async (event) => {
                                event.preventDefault()
                                try {
                                    const response = await api.updatePassword(passwordForm)
                                    setMessage(response.message)
                                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                                } catch (error) {
                                    setMessage(error.message)
                                }
                            }}>
                                <input type="password" placeholder="Current password" aria-label="Current password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm((form) => ({ ...form, currentPassword: event.target.value }))} />
                                <input type="password" placeholder="New password" aria-label="New password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm((form) => ({ ...form, newPassword: event.target.value }))} />
                                <input type="password" placeholder="Confirm new password" aria-label="Confirm new password" value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm((form) => ({ ...form, confirmPassword: event.target.value }))} />
                                <button>Update Password</button>
                            </form>
                        </section>
                    )}

                </section>

                <aside className="profile-side">
                    <section className="saved-addresses">
                        <h2>Account Summary</h2>
                        <div className="account-summary-list">
                            <p><span>Profile completion</span><strong>{profileCompletion}%</strong></p>
                            <p><span>Saved addresses</span><strong>{addresses.length}</strong></p>
                            <p><span>Orders</span><strong>{orderCount}</strong></p>
                            <p><span>Email</span><strong>{profile.emailVerified ? 'Verified' : 'Not verified'}</strong></p>
                        </div>
                    </section>

                    <section className="notification-card">
                        <h2>Need help?</h2>
                        <div>
                            <p>Contact SHOPNOVA support for order, delivery, and warranty questions.</p>
                            <Link to="/contact">Contact Support</Link>
                        </div>
                    </section>
                </aside>
            </section>
        </main>
    )
}

export default Profile
