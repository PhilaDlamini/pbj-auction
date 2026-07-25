/* Site header: brand mark, page navigation, and session controls */
import logo from "../assets/imagine-scholar-logo.png";
import "./Header.css";

function Header({ onLogout, activePage, onNavigate }) {
    return (
        <header className="site-header">
            <div className="site-header__row">
                <img className="site-header__logo" src={logo} alt="Imagine Scholar — Peanut Butter & Jelly Auction" />
                <button className="site-header__logout" onClick={onLogout}>
                    Log out
                </button>
            </div>
            <nav className="site-header__nav">
                <button
                    className={`site-header__nav-link ${activePage === "home" ? "is-active" : ""}`}
                    onClick={() => onNavigate("home")}
                >
                    Home
                </button>
                <button
                    className={`site-header__nav-link ${activePage === "account" ? "is-active" : ""}`}
                    onClick={() => onNavigate("account")}
                >
                    Account
                </button>
            </nav>
        </header>
    );
}

export default Header;
