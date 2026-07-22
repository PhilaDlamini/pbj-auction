/* Component that displays the bid history for the current auction */

function BidHistory() {
    return (
        <div>
            <h3>Bid History</h3>
            <ul>
                {/* History of all bids, orderd by time */}
                <li>Bidder 1: $10, 1pm</li>
                <li>Bidder 2: $15, 10am</li>
                <li>Bidder 3: $20, 9:45am</li>
            </ul>
        </div>
    );
}

export default BidHistory;