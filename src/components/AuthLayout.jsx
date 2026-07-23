/* Shared shell for the Login and Signup screens */
import logo from "../assets/imagine-scholar-logo.png";
import "./AuthLayout.css";

function AuthLayout({ title, children, footer }) {
    return (
        <div className="auth-page">
            <div className="auth-card">
                <img className="auth-card__logo" src={logo} alt="Imagine Scholar — Peanut Butter & Jelly Auction" />
                <h1 className="auth-card__title">{title}</h1>
                {children}
                {footer && <div className="auth-card__footer">{footer}</div>}
            </div>
        </div>
    );
}

export default AuthLayout;
