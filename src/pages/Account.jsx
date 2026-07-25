/*
The account page: profile picture, account details, and the current
user's own bid history.
*/
import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { logout } from "../firebase/auth.js";
import {
    updateAccountPhotoById,
    uploadPhotoById,
    subscribeToAuctionData
} from "../firebase/database.js";
import { formatBidTime } from "../utils/formatBidTime.js";
import "../components/AuthForm.css";
import "./Account.css";

function Account({ onNavigate }) {
    const { currentUser, account, setAccount } = useAuth();
    const [myBids, setMyBids] = useState([]);
    const [now, setNow] = useState(Date.now());
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [photoError, setPhotoError] = useState("");

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error(error);
        }
    }

    // Reuse the same live auction feed Home uses, filtered down to this user's bids
    useEffect(() => {
        const unsubscribe = subscribeToAuctionData(
            (auction) => {
                setMyBids(
                    auction.bids.filter((bid) => bid.bidderId === currentUser.uid)
                );
            },
            (error) => {
                console.error(error);
            }
        );

        return unsubscribe;
    }, [currentUser.uid]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setNow(Date.now());
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    async function handlePhotoChange(event) {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        setPhotoError("");
        setIsUploadingPhoto(true);
        try {
            const photoURL = await uploadPhotoById(currentUser.uid, file);
            await updateAccountPhotoById(currentUser.uid, photoURL);
            setAccount((current) => ({ ...current, photoURL }));
        } catch (error) {
            console.error(error);
            setPhotoError("Couldn't update your photo. Try again.");
        } finally {
            setIsUploadingPhoto(false);
            event.target.value = "";
        }
    }

    return (
        <div className="page">
            <Header onLogout={handleLogout} activePage="account" onNavigate={onNavigate} />
            <main className="auction-card">
                <section className="account-profile">
                    <div className="photo-upload account-profile__photo">
                        <div className="photo-upload__frame">
                            <label className="photo-upload__preview" htmlFor="account-photo">
                                {account?.photoURL ? (
                                    <img className="photo-upload__image" src={account.photoURL} alt="" />
                                ) : (
                                    <span className="photo-upload__placeholder" aria-hidden="true">+</span>
                                )}
                            </label>
                            <label className="photo-upload__badge" htmlFor="account-photo" aria-hidden="true">
                                +
                            </label>
                        </div>
                        <input
                            className="photo-upload__input"
                            id="account-photo"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            disabled={isUploadingPhoto}
                        />
                        <span className="photo-upload__hint">
                            {isUploadingPhoto ? "Uploading…" : "Tap to change photo"}
                        </span>
                    </div>
                    {photoError && <p className="auth-error">{photoError}</p>}

                    <h1 className="account-profile__name">{account?.name ?? " "}</h1>
                    <p className="account-profile__email">{currentUser.email}</p>
                </section>

                <section className="account-bids">
                    <h2 className="account-bids__title">Your bids</h2>
                    {myBids.length === 0 ? (
                        <p className="account-bids__empty">You haven&rsquo;t placed a bid yet.</p>
                    ) : (
                        <ul className="account-bids__list">
                            {myBids.map((bid) => (
                                <li className="account-bids__row" key={bid.bidId}>
                                    <span className="account-bids__amount">R{bid.amount}</span>
                                    <span className="account-bids__time">
                                        {formatBidTime(bid.timestamp, now)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Account;
