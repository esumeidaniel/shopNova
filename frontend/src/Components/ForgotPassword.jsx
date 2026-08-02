import { Link } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../api'
import './ForgotPassword.css'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [password, setPassword] = useState('')
    const [sent, setSent] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const googleEnabled = false

    return (
        <main className="forgot-password">
            <section className="forgot-card" aria-labelledby="forgot-title">
                <div className="forgot-brand">
                    <span>S</span>
                    <strong>SHOPNOVA</strong>
                </div>

                <div className="forgot-heading">
                    <h1 id="forgot-title">Reset your password.</h1>
                    <p>Enter your email and we'll send you a reset link.</p>
                </div>

                {error && <p className="login-alert">{error}</p>}
                {message && <p className="login-alert">{message}</p>}

                <form className="forgot-form" onSubmit={async (event) => {
                    event.preventDefault()
                    setError('')
                    setMessage('')
                    try {
                        if (!sent) {
                            const response = await api.forgotPassword({ email })
                            setSent(true)
                            setMessage(response.message)
                            return
                        }

                        const response = await api.resetPassword({ email, code, password })
                        setMessage(response.message)
                    } catch (error) {
                        setError(error.message)
                    }
                }}>
                    <input type="email" aria-label="Email address" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />
                    {sent && <input type="text" aria-label="Reset code" placeholder="6-digit reset code" value={code} onChange={(event) => setCode(event.target.value)} />}
                    {sent && <input type="password" aria-label="New password" placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} />}
                    <button type="submit">{sent ? 'Reset Password' : 'Send Reset Code'}</button>
                </form>

                {googleEnabled && (
                    <>
                        <div className="forgot-divider">or continue with</div>
                        <button className="forgot-google" type="button">
                            <span>G</span>
                            Continue with Google
                        </button>
                    </>
                )}

                {sent && (
                    <section className="reset-success" aria-label="Reset email sent">
                        <h2>✓ Check your email</h2>
                        <p>A reset code has been sent if the email exists. It expires in 15 minutes.</p>
                    </section>
                )}

                <Link className="back-login" to="/login">← Back to Login</Link>
            </section>
        </main>
    )
}

export default ForgotPassword
