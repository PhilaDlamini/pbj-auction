/* Component that displays the bid history for the current auction */
import "./BidHistory.css";

function BidHistory({ bids }) {

    return (
        <section className="bid-history">
            <h2 className="bid-history__title">Bid history</h2>
            <ul className="bid-history__list">
                {
                    bids.map((bid) => (
                        <li className="bid-history__row" key={bid.bidId}>
                            <img
                                className="bid-history__avatar"
                                src={bid.bidder.photoURL}
                                alt={bid.bidder.name}
                            />
                            <span className="bid-history__bidder">{bid.bidder.name}</span>
                            <span className="bid-history__amount">R{bid.amount}</span>
                            <span className="bid-history__time">
                                {new Date(bid.timestamp).toLocaleString()}
                            </span>
                        </li>
                    ))
                }
            </ul>
        </section>
    );
}

export default BidHistory;
