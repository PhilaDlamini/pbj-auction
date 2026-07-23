/* Component that displays the bid history for the current auction */
import "./BidHistory.css";

//Formats a timestamp into a human-readable string
function formatBidTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) {
        return `${Math.max(seconds, 0)}s`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (
        date.getFullYear() === yesterday.getFullYear() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getDate() === yesterday.getDate()
    ) {
        return "Yesterday";
    }

    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString([], {
            month: "short",
            day: "numeric"
        });
    }

    return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

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
                                {formatBidTime(bid.timestamp)}
                            </span>
                        </li>
                    ))
                }
            </ul>
        </section>
    );
}

export default BidHistory;
