import { Link, NavLink } from 'react-router-dom'
import './Profile.css'
import { useAuth } from '../../useAuth'
import { useEffect, useState } from 'react'
import { api } from '../../api'

const preferences = [
    'Order updates',
    'Promotions',
    'New arrivals',
    'WhatsApp notifications',
    'Email newsletters',
]

const Profile = ({ section = 'profile' }) => {
    const { logout, user } = useAuth()
    const [profile, setProfile] = useState(user || {})
    const [addresses, setAddresses] = useState([])
    const [message, setMessage] = useState('')
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
        const address = window.prompt('Delivery address')
        if (!address) return
        const { address: savedAddress } = await api.createAddress({ label: 'Home Address', address })
        setAddresses((items) => [...items, savedAddress])
    }

    const deleteAddress = async (id) => {
        await api.deleteAddress(id)
        setAddresses((items) => items.filter((item) => item.id !== id))
    }

    return (
        <main className="profile-page">
            <section className="profile-heading">
                <h1>{showAddresses ? 'Saved Addresses' : showNotifications ? 'Notifications' : showSecurity ? 'Security' : 'My Account'}</h1>
                <p>Manage your profile, orders, addresses, password, and notifications.</p>
            </section>

            <nav className="page-breadcrumb" aria-label="Breadcrumb">
                <Link to="/">Home</Link> &gt; My Account
            </nav>

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
                                <label>Email<input placeholder="Email ✓ Verified" aria-label="Email verified" value={profile.email || ''} readOnly /></label>
                                <label>Phone<input placeholder="Phone" aria-label="Phone" value={profile.phone || ''} onChange={(event) => updateProfileField('phone', event.target.value)} /></label>
                                <label>Date of birth<input placeholder="Date of Birth" aria-label="Date of Birth" value={profile.dateOfBirth || ''} onChange={(event) => updateProfileField('dateOfBirth', event.target.value)} /></label>
                                <label>Gender<input placeholder="Gender" aria-label="Gender" value={profile.gender || ''} onChange={(event) => updateProfileField('gender', event.target.value)} /></label>
                            </form>

                            <button className="save-profile" onClick={saveProfile}>Save Changes</button>
                        </>
                    )}

                    {showAddresses && (
                        <section className="account-section-card">
                            <h2>Saved Addresses</h2>
                            {addresses.map((address) => (
                                <article key={address.id}>
                                    <strong>{address.label || 'Address'} {address.isDefault ? '• Default' : ''}</strong>
                                    <p>{address.address} {address.city ? `• ${address.city}` : ''} {address.phone ? `• ${address.phone}` : ''}</p>
                                    <div>
                                        <button onClick={() => deleteAddress(address.id)}>Delete</button>
                                    </div>
                                </article>
                            ))}
                            <button className="save-profile" onClick={addAddress}>+ Add New Address</button>
                        </section>
                    )}

                    {showNotifications && (
                        <section className="account-section-card">
                            <h2>Notification Preferences</h2>
                            <div className="notification-list">
                                {preferences.map((preference) => (
                                    <label key={preference}>
                                        <span>{preference}</span>
                                        <input type="checkbox" defaultChecked />
                                    </label>
                                ))}
                            </div>
                        </section>
                    )}

                    {showSecurity && (
                        <section className="password-section account-section-card">
                            <h2>Change Password</h2>
                            <form>
                                <input type="password" placeholder="Current password" aria-label="Current password" />
                                <input type="password" placeholder="New password" aria-label="New password" />
                                <input type="password" placeholder="Confirm new password" aria-label="Confirm new password" />
                            </form>
                            <button>Update Password</button>
                        </section>
                    )}

                    <div className="account-logout-row">
                        <button type="button" onClick={() => {
                            logout()
                            window.location.replace('/')
                        }}>Logout</button>
                    </div>
                </section>

                <aside className="profile-side">
                    <section className="saved-addresses">
                        <h2>Account Summary</h2>
                        <div>
                            <h3>Profile completion</h3>
                            <p>Add your phone number and delivery address to make checkout faster.</p>
                        </div>
                        <Link to="/account/addresses">Manage Addresses</Link>
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
