/* The login page */
import { login } from "../firebase/auth.js";
import { useState } from "react";
import AuthLayout from "../components/AuthLayout.jsx";
import "../components/AuthForm.css";

function Login({ setPage }) {

    //All vars
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    //handles login
    async function handleLogin(event) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            await login(email, password);
        } catch (error) {
            console.error(error);
            setError("Couldn't log you in. Check your email and password and try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthLayout
            title="Log in"
            footer={
                <>
                    Don&rsquo;t have an account?
                    <button className="auth-link-button" type="button" onClick={() => setPage("signup")}>
                        Create one
                    </button>
                </>
            }
        >
            <form className="auth-form" onSubmit={handleLogin}>
                <div className="auth-field">
                    <label htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="auth-field">
                    <label htmlFor="login-password">Password</label>
                    <input
                        id="login-password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button className="auth-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in…" : "Log in"}
                </button>
            </form>
        </AuthLayout>
    );
}

export default Login;
