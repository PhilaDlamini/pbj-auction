/* Allows a user to submit a new higher bid */
import { useState } from "react";
import "./BidForm.css";

const CURRENT_HIGH_BID = 20; // TODO: read from live auction data

function BidForm() {

    const [amount, setAmount] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        // TODO: submit bid to the database once the auction data layer is wired up
        console.log("Bid submitted:", amount);
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
                        min={CURRENT_HIGH_BID + 1}
                        step="1"
                        placeholder={String(CURRENT_HIGH_BID + 1)}
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        aria-label="Bid amount in dollars"
                    />
                </label>
                <button className="bid-form__submit" type="submit">
                    Bid&nbsp;→
                </button>
            </form>
            <p className="bid-form__hint">Every bid must beat ${CURRENT_HIGH_BID}</p>
        </section>
    );
}

export default BidForm;
