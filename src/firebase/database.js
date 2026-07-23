/* Handles all database calls to Firebase */

import {
    getDatabase,
    ref,
    set,
    get,
    push,
    remove,
    query,
    orderByChild,
    limitToLast
} from "firebase/database";

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
export async function getAccount(uid) {

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


// Returns the current highest bid
export async function getHighestBid() {

    const highestBidQuery = query(
        ref(database, "bids"),
        orderByChild("amount"),
        limitToLast(1) //Get highest bid
    );

    const snapshot = await get(highestBidQuery);

    return snapshot.val();

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