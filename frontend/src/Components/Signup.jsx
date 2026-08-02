import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../useAuth'
import { api } from '../api'
import './Signup.css'

const Signup = () => {
    const navigate = useNavigate()
    const { authError, authLoading, register } = useAuth()
    const [formError, setFormError] = useState('')
    const [registeredEmail, setRegisteredEmail] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const [verificationMessage, setVerificationMessage] = useState('')
    const googleEnabled = false

    return (
        <main className="signup">
            <section className="signup-card" aria-labelledby="signup-title">
                <div className="signup-brand">
                    <span>S</span>
                    <strong>SHOPNOVA</strong>
                </div>

                <div className="signup-heading">
                    <h1 id="signup-title">Create your account.</h1>
                    <p>Join SHOPNOVA and start shopping.</p>
                </div>

                {(authError || formError) && <p className="login-alert">{authError || formError}</p>}

                {registeredEmail ? (
                    <form className="signup-form" onSubmit={async (event) => {
                        event.preventDefault()
                        setFormError('')
                        try {
                            const response = await api.verifyEmail({ email: registeredEmail, code: verificationCode })
                            setVerificationMessage(response.message)
                            navigate('/')
                        } catch (error) {
                            setFormError(error.message)
                        }
                    }}>
                        <input value={registeredEmail} aria-label="Registered email" readOnly />
                        <input value={verificationCode} onChange={(event) => setVerificationCode(event.target.value)} aria-label="Verification code" placeholder="6-digit verification code" />
                        <button type="submit" className="signup-submit">Verify Email</button>
                        <button type="button" className="signup-google" onClick={async () => {
                            setFormError('')
                            try {
                                const response = await api.sendVerification({ email: registeredEmail })
                                setVerificationMessage(response.message)
                            } catch (error) {
                                setFormError(error.message)
                            }
                        }}>Resend Code</button>
                        {verificationMessage && <p>{verificationMessage}</p>}
                    </form>
                ) : (
                <form className="signup-form" onSubmit={async (event) => {
                    event.preventDefault()
                    const firstName = event.currentTarget.elements.firstName.value.trim()
                    const lastName = event.currentTarget.elements.lastName.value.trim()
                    const email = event.currentTarget.elements.email.value.trim()
                    const phone = event.currentTarget.elements.phone.value.trim()
                    const password = event.currentTarget.elements.password.value
                    const confirmPassword = event.currentTarget.elements.confirmPassword.value
                    const termsAccepted = event.currentTarget.elements.terms.checked

                    setFormError('')
                    if (password !== confirmPassword) {
                        setFormError('Passwords do not match')
                        return
                    }
                    if (!termsAccepted) {
                        setFormError('Please agree to Terms and Privacy')
                        return
                    }

                    try {
                        const session = await register({ firstName, lastName, email, phone, password })
                        setRegisteredEmail(session.user.email)
                        setVerificationMessage(session.message || 'Account created. Check your email for a verification code.')
                    } catch (error) {
                        setFormError(error.message)
                    }
                }}>
                    <input name="firstName" type="text" aria-label="First name" placeholder="First name" />
                    <input name="lastName" type="text" aria-label="Last name" placeholder="Last name" />
                    <input name="email" type="email" aria-label="Email address" placeholder="Email address" />
                    <input name="phone" type="tel" aria-label="Phone number" placeholder="Phone number" />
                    <input name="password" type="password" aria-label="Password" placeholder="Password" />
                    <input name="confirmPassword" type="password" aria-label="Confirm password" placeholder="Confirm password" />

                    <div className="password-strength" aria-label="Password strength: Good">
                        <span />
                    </div>
                    <p className="strength-text">Password strength: Good</p>

                    <label className="terms-row">
                        <input name="terms" type="checkbox" defaultChecked />
                        I agree to Terms and Privacy
                    </label>

                    <p className="signin-link">
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>
                    <button type="submit" className="signup-submit" disabled={authLoading}>{authLoading ? 'Creating account...' : 'Create Account'}</button>
                </form>
                )}

                {googleEnabled && (
                    <>
                        <div className="signup-divider">or continue with</div>
                        <button className="signup-google" type="button">
                            <span>G</span>
                            Continue with Google
                        </button>
                    </>
                )}
            </section>
        </main>
    );
}

export default Signup;
