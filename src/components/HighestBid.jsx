/* Displays the current highest bid for the auction */
import "./HighestBid.css";

function HighestBid({ highestBid }) {
    if (!highestBid) {
        return (
            <section className="hero">
                <p className="hero__eyebrow">This month's jar</p>
                <p className="hero__amount">$0</p>
                <p className="hero__label">current highest bid</p>
                <p className="hero__bidder">No bids yet</p>
            </section>
        );
    }

    return (
        <section className="hero">
            <p className="hero__eyebrow">This month's jar</p>
            <p className="hero__amount">${highestBid.amount}</p>
            <p className="hero__label">current highest bid</p>
            <p className="hero__bidder">held by {highestBid.bidder.name}</p>
        </section>
    );
}

export default HighestBid;
