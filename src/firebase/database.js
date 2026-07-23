/* Handles all database calls to Firebase */

import {
    getDatabase,
    ref,
    set,
    get,
    push,
    remove} from "firebase/database";

import { app } from "./config";

const database = getDatabase(app);


// ====================
// Accounts
// ====================

// Creates a new account
export async function createAccount(uid, accountInfo) {

    await set(
        ref(database, `accounts/${uid}`),
        accountInfo
    );

}


// Returns an account by uid
export async function getAccountById(uid) {

    const snapshot = await get(
        ref(database, `accounts/${uid}`)
    );

    return snapshot.val();
}


//TODO: TEST ALL BELOW
// ====================
// Bids
// ====================

// Creates a new bid
export async function createBid(uid, amount) {

    const bidRef = push(ref(database, "bids"));

    await set(bidRef, {
        bidderId: uid,
        amount: amount,
        timestamp: Date.now()
    });

}


// Returns every bid
export async function getBids() {

    const snapshot = await get(
        ref(database, "bids")
    );

    return snapshot.val();

}

/* 
Returns the list of bids enriched with the bidder's account info

Example:
[{
        bidId: "-abc123",
        amount: 50,
        timestamp: 1753212500,
        bidder: {
            name: "Phila",
            photoURL: "https://..."
        }
}]
*/
export async function getBidsWithAccounts() {

    const bids = await getBids();

    if (!bids) {
        return [];
    }

    const enrichedBids = await Promise.all(
        Object.entries(bids).map(
            async ([bidId, bid]) => {

                const account = await getAccountById(
                    bid.bidderId
                );

                return {
                    bidId,
                    ...bid,
                    bidder: account
                };
            }
        )
    );

    return enrichedBids;
}

/*
Returns all auction data needed by Home.

Example:

{
    bids: [
        {
            bidId: "-abc123",
            amount: 50,
            timestamp: 1753212500,
            bidder: {
                name: "Phila",
                photoURL: "..."
            }
        }
    ],

    highestBid: {
        bidId: "-abc123",
        amount: 50,
        timestamp: 1753212500,
        bidder: {
            name: "Phila",
            photoURL: "..."
        }
    }
}
*/
export async function getAuctionData() {

    const bids = await getBidsWithAccounts();

    if (bids.length === 0) {
        return {
            bids: [],
            highestBid: null
        };
    }


    const highestBid = bids.reduce(
        (highest, current) => {

            return current.amount > highest.amount
                ? current
                : highest;

        }
    );


    return {
        bids,
        highestBid
    };
}

// ====================
// Monthly Reset
// ====================

// Deletes every bid
export async function deleteAllBids() {

    await remove(
        ref(database, "bids")
    );

}