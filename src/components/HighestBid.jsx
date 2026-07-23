/* Displays the current highest bid for the auction */
import "./HighestBid.css";

function HighestBid({ highestBid }) {
    if (!highestBid) {
        return (
            <section className="hero">
                <p className="hero__eyebrow">This month's jar</p>
                <p className="hero__amount">R0</p>
                <p className="hero__label">current highest bid</p>
                <p className="hero__bidder">No bids yet</p>
            </section>
        );
    }

    return (
        <section className="hero">
            <p className="hero__eyebrow">This month's jar</p>
            <p className="hero__amount">R{highestBid.amount}</p>
            <p className="hero__label">current highest bid</p>
            <div className="hero__bidder-row">
                <img
                    className="hero__avatar"
                    src={highestBid.bidder.photoURL}
                    alt={highestBid.bidder.name}
                />
                <p className="hero__bidder">held by {highestBid.bidder.name}</p>
            </div>
        </section>
    );
}

export default HighestBid;
