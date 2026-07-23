/* Component that displays the bid history for the current auction */

function BidHistory({ bids }) {

    return (
        <div>
            <h3>Bid History</h3>

            <ul>
                {
                    bids.map((bid) => (
                        <li key={bid.bidId}>

                            <img src={bid.bidder.photoURL} alt="profile" />

                            {" "}
                            {bid.bidder.name}

                            {" "}
                            R{bid.amount}

                            {" "}
                            {new Date(
                                bid.timestamp
                            ).toLocaleString()}

                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

export default BidHistory;