/* Allows a user to submit a new higher bid */

import { useState } from "react";
import { createBid } from "../firebase/database.js";
import { useAuth } from "../context/AuthContext.jsx";


function BidForm({ highestBid, loadAuction }) {
    const [amount, setAmount] = useState("");
    const { currentUser } = useAuth();

    async function handleSubmit(event) {

        // Prevent the form from refreshing the page
        event.preventDefault();
        const bidAmount = Number(amount);

        // Get current highest amount
        const currentHighest = highestBid
            ? highestBid.amount
            : 0;

        // Reject lower/equal bids
        if (bidAmount <= currentHighest) {
            alert("Your bid must be higher than the current highest bid.");
            return;
        }

        // Create a new bid in the database
        try {

            await createBid(
                currentUser.uid,
                bidAmount
            );

            // Refresh Home state
            await loadAuction();
            setAmount("");

        } catch (error) {
            console.error(error);
        }

    }

    return (
        <div>

            <h3>Submit a New Bid</h3>

            <form onSubmit={handleSubmit}>
                <input type="number" placeholder="Enter bid amount" value={amount} onChange={(event) => setAmount(event.target.value)}/>
                <button type="submit"> Submit Bid </button>

            </form>

        </div>
    );
}


export default BidForm;