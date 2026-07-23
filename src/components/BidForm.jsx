/* Allows a user to submit a new higher bid */
import { useState } from "react";
import { createBid } from "../firebase/database.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./BidForm.css";

function BidForm({ highestBid, loadAuction }) {
    const [amount, setAmount] = useState("");
    const { currentUser } = useAuth();
    const currentHighest = highestBid
        ? highestBid.amount
        : 0;

    async function handleSubmit(event) {
        event.preventDefault();

        const bidAmount = Number(amount);

        if (bidAmount <= currentHighest) {
            alert("Your bid must be higher than the current highest bid.");
            return;
        }

        try {
            await createBid(
                currentUser.uid,
                bidAmount
            );

            await loadAuction();
            setAmount("");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <section className="bid-form">
            <h2 className="bid-form__title">Place your bid</h2>
            <form className="bid-form__row" onSubmit={handleSubmit}>
                <label className="bid-form__input-wrap">
                    <span className="bid-form__prefix">$</span>
                    <input
                        className="bid-form__input"
                        type="number"
                        inputMode="decimal"
                        min={currentHighest + 1}
                        step="1"
                        placeholder={String(currentHighest + 1)}
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        aria-label="Bid amount in dollars"
                    />
                </label>
                <button className="bid-form__submit" type="submit">
                    Bid
                </button>
            </form>
            <p className="bid-form__hint">Every bid must beat ${currentHighest}</p>
        </section>
    );
}

export default BidForm;
