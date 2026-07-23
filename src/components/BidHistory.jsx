/* Component that displays the bid history for the current auction */
import "./BidHistory.css";

// TODO: replace with live bids from the database, ordered by time
const PLACEHOLDER_BIDS = [
    { id: 1, bidder: "Bidder 3", amount: 20, time: "9:45 AM" },
    { id: 2, bidder: "Bidder 2", amount: 15, time: "10:00 AM" },
    { id: 3, bidder: "Bidder 1", amount: 10, time: "1:00 PM" },
];

function BidHistory() {
    return (
        <section className="bid-history">
            <h2 className="bid-history__title">Bid history</h2>
            <ul className="bid-history__list">
                {PLACEHOLDER_BIDS.map((bid) => (
                    <li className="bid-history__row" key={bid.id}>
                        <span className="bid-history__amount">${bid.amount}</span>
                        <span className="bid-history__bidder">{bid.bidder}</span>
                        <span className="bid-history__time">{bid.time}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default BidHistory;
