/* Site header: brand mark, page navigation, and session controls */
import { useEffect, useRef, useState } from "react";
import logo from "../assets/imagine-scholar-logo.png";
import { APP_PAGES } from "../constants/pages.js";
import "./Header.css";

function Header({ currentUser, account, onLogin, onLogout, activePage, onNavigate }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const profileRef = useRef(null);
    const isLoggedIn = Boolean(currentUser);

    //whenever isMenuOpen changes...
    useEffect(() => {
        if (!isMenuOpen) { //make sure menu is open
            return;
        }

        //check if the profile area exists and the click was outside of it. if so, close the menu
        function handleClickOutside(event) {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        }

        //listen for any pointer press on the document, and call handleClickOutside
        document.addEventListener("pointerdown", handleClickOutside);

        //remove the event listener when the component unmounts or the menu closes
        return () => document.removeEventListener("pointerdown", handleClickOutside);
    }, [isMenuOpen]);

    async function handleLogout() {
        setIsMenuOpen(false);
        await onLogout();
    }

    return (
        <header className="site-header">
            <div className="site-header__row">
                <img className="site-header__logo" src={logo} alt="Imagine Scholar — Peanut Butter & Jelly Auction" />
                {isLoggedIn ? (
                    <div className="site-header__profile" ref={profileRef}>
                        {account?.photoURL && (
                            <img
                                className="site-header__avatar"
                                src={account.photoURL}
                                alt=""
                            />
                        )}
                        <div className="site-header__profile-menu">
                            <button
                                className="site-header__profile-button"
                                onClick={() => setIsMenuOpen((current) => !current)}
                                type="button"
                            >
                                <span>{account?.name ?? ""}</span>
                                <img
                                    className="site-header__chevron"
                                    src={`${import.meta.env.BASE_URL}chevron-down.svg`}
                                    alt=""
                                    aria-hidden="true"
                                />
                            </button>
                            {isMenuOpen && (
                                <div className="site-header__menu">
                                    <button className="site-header__menu-item" onClick={handleLogout} type="button">
                                        Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <button className="site-header__login" onClick={onLogin} type="button">
                        Log in
                    </button>
                )}
            </div>
            <nav className="site-header__nav">
                <button
                    className={`site-header__nav-link ${activePage === APP_PAGES.HOME ? "is-active" : ""}`}
                    onClick={() => onNavigate(APP_PAGES.HOME)}
                >
                    Home
                </button>
                <button
                    className={`site-header__nav-link ${activePage === APP_PAGES.PAST_WINNERS ? "is-active" : ""}`}
                    onClick={() => onNavigate(APP_PAGES.PAST_WINNERS)}
                >
                    Past Winners
                </button>
                {isLoggedIn && (
                    <button
                        className={`site-header__nav-link ${activePage === APP_PAGES.ACCOUNT ? "is-active" : ""}`}
                        onClick={() => onNavigate(APP_PAGES.ACCOUNT)}
                    >
                        Account
                    </button>
                )}
            </nav>
        </header>
    );
}

export default Header;
