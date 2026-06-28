import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../useAuth'
import './Signup.css'

const Signup = () => {
    const navigate = useNavigate()
    const { authError, authLoading, register } = useAuth()

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

                {authError && <p className="login-alert">{authError}</p>}

                <form className="signup-form" onSubmit={async (event) => {
                    event.preventDefault()
                    const firstName = event.currentTarget.elements.firstName.value.trim()
                    const lastName = event.currentTarget.elements.lastName.value.trim()
                    const email = event.currentTarget.elements.email.value.trim()
                    const phone = event.currentTarget.elements.phone.value.trim()
                    const password = event.currentTarget.elements.password.value

                    try {
                        await register({ firstName, lastName, email, phone, password })
                        navigate('/')
                    } catch {
                        // The auth provider displays the backend error message.
                    }
                }}>
                    <input name="firstName" type="text" aria-label="First name" placeholder="First name" />
                    <input name="lastName" type="text" aria-label="Last name" placeholder="Last name" />
                    <input name="email" type="email" aria-label="Email address" placeholder="Email address" />
                    <input name="phone" type="tel" aria-label="Phone number" placeholder="Phone number" />
                    <input name="password" type="password" aria-label="Password" placeholder="Password" />
                    <input type="password" aria-label="Confirm password" placeholder="Confirm password" />

                    <div className="password-strength" aria-label="Password strength: Good">
                        <span />
                    </div>
                    <p className="strength-text">Password strength: Good</p>

                    <label className="terms-row">
                        <input type="checkbox" defaultChecked />
                        I agree to Terms and Privacy
                    </label>

                    <p className="signin-link">
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>
                    <button type="submit" className="signup-submit" disabled={authLoading}>{authLoading ? 'Creating account...' : 'Create Account'}</button>
                </form>

                <div className="signup-divider">or continue with</div>

                <button className="signup-google" type="button">
                    <span>G</span>
                    Continue with Google
                </button>
            </section>
        </main>
    );
}

export default Signup;
