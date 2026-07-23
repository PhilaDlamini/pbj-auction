/*
The signup page
*/
import { useState } from "react";
import { signup } from "../firebase/auth.js";
import { createAccount } from "../firebase/database.js";
import AuthLayout from "../components/AuthLayout.jsx";
import "../components/AuthForm.css";

function Signup({ setPage }) {

    //all vars
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    //handles signup
    async function handleSignup(event) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            const user = await signup(email, password);

            //save data to database
            await createAccount(
                user.uid,
                {
                    name: name,
                    email: email,
                    photoURL: "https://i.pravatar.cc/150?img=12" //dummy url for now
                }
            );
        } catch (error) {
            console.error(error);
            setError("Couldn't create your account. That email may already be in use.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthLayout
            title="Create your account"
            footer={
                <>
                    Already have an account?
                    <button className="auth-link-button" type="button" onClick={() => setPage("login")}>
                        Log in
                    </button>
                </>
            }
        >
            <form className="auth-form" onSubmit={handleSignup}>
                <div className="auth-field">
                    <label htmlFor="signup-name">Name</label>
                    <input
                        id="signup-name"
                        type="text"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>
                <div className="auth-field">
                    <label htmlFor="signup-email">Email</label>
                    <input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="auth-field">
                    <label htmlFor="signup-password">Password</label>
                    <input
                        id="signup-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button className="auth-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account…" : "Create account"}
                </button>
            </form>
        </AuthLayout>
    );
}

export default Signup;
