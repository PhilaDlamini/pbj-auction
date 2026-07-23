/* Displays the current highest bid for the auction */
import { useEffect, useState } from "react";
import { getAccountById } from "../firebase/database";

function HighestBid({ highestBid }) {

    if (!highestBid) {
        return (
            <div>
                <h3>Current Highest Bid</h3>
                <p>No bids yet.</p>
            </div>
        );
    }


    return (
        <div>

            <h3>Current Highest Bid</h3>
            <img src={highestBid.bidder.photoURL} alt="Profile" />
            <p> {highestBid.bidder.name} </p>
            <p> ${highestBid.amount} </p>

        </div>
    );
}


export default HighestBid;