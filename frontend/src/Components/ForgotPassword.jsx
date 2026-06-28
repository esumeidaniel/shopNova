import { Link } from 'react-router-dom'
import './ForgotPassword.css'

const ForgotPassword = () => {
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

                <form className="forgot-form">
                    <input type="email" aria-label="Email address" placeholder="Email address" />
                    <button type="submit">Send Reset Link</button>
                </form>

                <div className="forgot-divider">or continue with</div>

                <button className="forgot-google" type="button">
                    <span>G</span>
                    Continue with Google
                </button>

                <section className="reset-success" aria-label="Reset email sent">
                    <h2>✓ Check your email</h2>
                    <p>A reset link has been sent. It expires in 15 minutes. Resend</p>
                </section>

                <Link className="back-login" to="/login">← Back to Login</Link>
            </section>
        </main>
    )
}

export default ForgotPassword
