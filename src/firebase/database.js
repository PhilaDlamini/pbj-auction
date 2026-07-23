/* Handles all database calls to Firebase */

import {
    getDatabase,
    ref,
    set,
    get,
    push,
    remove} from "firebase/database";

import { getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL } from "firebase/storage";

import { app } from "./config";

const database = getDatabase(app);
const storage = getStorage(app);


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

    // Sort bids by timestamp in descending order
    const bidsByTimestamp = [...bids].sort(
        (a, b) => b.timestamp - a.timestamp
    );

    return {
        bids: bidsByTimestamp,
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


// ====================
// Storage
// ====================

//Uploads a user profile pic and returns the url
export async function uploadPhotoById(uid, photoFile) {
    const photoRef = storageRef(storage, `photos/${uid}`);

    await uploadBytes(photoRef, photoFile, {
        contentType: photoFile.type
    });

    return getDownloadURL(photoRef);
}

//Gets the user profile url
export async function downloadPhotoById(uid) {
    const photoRef = storageRef(storage, `photos/${uid}`);

    return getDownloadURL(photoRef);
}
