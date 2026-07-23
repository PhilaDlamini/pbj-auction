/*
The signup page
*/
import { useEffect, useState } from "react";
import { signup } from "../firebase/auth.js";
import AuthLayout from "../components/AuthLayout.jsx";
import "../components/AuthForm.css";
import { createAccount, uploadPhotoById } from "../firebase/database.js";

function Signup({ setPage }) {

    //all vars
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Release the preview URL whenever it changes or the page unmounts
    useEffect(() => {
        return () => {
            if (photoPreview) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

    function handlePhotoChange(event) {
        const file = event.target.files[0];

        if (!file) {
            setPhotoFile(null);
            setPhotoPreview("");
            return;
        }

        setError("");
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    }

    //handles signup
    async function handleSignup(event) {
        event.preventDefault();
        setError("");

        if (!photoFile) {
            setError("Please upload a profile picture.");
            return;
        }

        setIsSubmitting(true);
        try {
            const user = await signup(email, password);
            const photoURL = await uploadPhotoById(user.uid, photoFile);

            //save data to database
            await createAccount(
                user.uid,
                {
                    name: name,
                    email: email,
                    photoURL: photoURL
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
                <div className="auth-field auth-field--photo">
                    <label htmlFor="signup-photo">Profile picture</label>
                    <div className="photo-upload">
                        <label className="photo-upload__preview" htmlFor="signup-photo">
                            {photoPreview ? (
                                <img className="photo-upload__image" src={photoPreview} alt="" />
                            ) : (
                                <span className="photo-upload__placeholder" aria-hidden="true">+</span>
                            )}
                        </label>
                        <input
                            className="photo-upload__input"
                            id="signup-photo"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />
                        <span className="photo-upload__hint">
                            {photoFile ? photoFile.name : "This appears on your bids"}
                        </span>
                    </div>
                </div>
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
