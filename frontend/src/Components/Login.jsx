import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../useAuth'
import './Login.css'

const Login = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { authError, authLoading, login } = useAuth()
    const [showPassword, setShowPassword] = useState(false)

    return (
        <main className="login">
            <section className="login-card" aria-labelledby="login-title">
                <div className="login-brand">
                    <span>S</span>
                    <strong>SHOPNOVA</strong>
                </div>

                <div className="login-heading">
                    <h1 id="login-title">Welcome back.</h1>
                    <p>Log in to continue shopping.</p>
                </div>

                <p className="login-alert">Please log in or create an account to continue.</p>

                {authError && <p className="login-alert">{authError}</p>}

                <form className="login-form" onSubmit={async (event) => {
                    event.preventDefault()
                    const email = event.currentTarget.elements.email.value.trim()
                    const password = event.currentTarget.elements.password.value

                    try {
                        await login(email || 'customer@shopnova.ng', password || 'password123')
                        navigate(location.state?.from || '/')
                    } catch {
                        // The auth provider displays the backend error message.
                    }
                }}>
                    <input name="email" type="email" aria-label="Email address" placeholder="Email address" />
                    <div className="password-field">
                        <input name="password" type={showPassword ? 'text' : 'password'} aria-label="Password" placeholder="Password" />
                        <button
                            type="button"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            onClick={() => setShowPassword((visible) => !visible)}
                        >
                            {showPassword ? 'Hide' : '👁️'}
                        </button>
                    </div>
                    <Link className="forgot-link" to="/forgot-password">Forgot password?</Link>
                    <button type="submit" className="login-submit" disabled={authLoading}>{authLoading ? 'Logging in...' : 'Log In'}</button>
                </form>

                <div className="login-divider">or continue with</div>

                <button className="google-login" type="button">
                    <span>G</span>
                    Continue with Google
                </button>

                <p className="register-link">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </section>
        </main>
    );
}

export default Login;
