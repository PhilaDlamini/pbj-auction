/* Displays the current Highest Bid for the auction */
import "./HighestBid.css";

function HighestBid() {
    return (
        <section className="hero">
            <p className="hero__eyebrow">This month&rsquo;s jar</p>
            <p className="hero__amount">$20</p>
            <p className="hero__label">current highest bid</p>
            <p className="hero__bidder">held by Bidder 3</p>
        </section>
    );
}

export default HighestBid;
