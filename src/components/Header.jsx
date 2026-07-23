/* Site header: brand mark plus session controls */
import logo from "../assets/imagine-scholar-logo.png";
import "./Header.css";

function Header({ onLogout }) {
    return (
        <header className="site-header">
            <img className="site-header__logo" src={logo} alt="Imagine Scholar — Peanut Butter & Jelly Auction" />
            <button className="site-header__logout" onClick={onLogout}>
                Log out
            </button>
        </header>
    );
}

export default Header;
