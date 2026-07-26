/* Handles all database calls to Firebase */

import {
    getDatabase,
    ref,
    set,
    get,
    push,
    remove,
    onValue} from "firebase/database";

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

export async function updateAccountPhotoById(uid, photoURL) {

    await set(
        ref(database, `accounts/${uid}/photoURL`),
        photoURL
    );

}

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


/*
Subscribes to live bid changes and sends Home the full auction state.

onAuctionData is a callback that receives an object with the following properties:
- bids: all bids ordered by date (newest first),
- highestBid: the bid with the highest amount, or null if there are no bids
Note that boths 'bids' and 'highestBid' are enriched with the bidder's account information:
Eg:
    {   bidderId: "uid1"
        amount: 25
        timestamp: 1753212345,
        bidder: { name: "Alice", email: "...", photoURL: "..." } }

onError is an optional callback that accepts an error, and runs if Firebase cannot read the bids path

subscribeToAuctionData return onValue, which is a function that unsubscribes from the live bid changes when called.
This is useful for cleaning up the subscription when Home unmounts.
*/

export function subscribeToAuctionData(onAuctionData, onError) {
    // Maps each account id (bidder id) to the account information
    const accountsById = new Map();
    const bidsRef = ref(database, "bids");

    // Listen once immediately, then again whenever bids change.
    return onValue(
        bidsRef,
        async (snapshot) => {
            // Read the current bids object from Firebase.
            const bids = snapshot.val();

            // Send empty auction state if no bids exist yet.
            if (!bids) {
                onAuctionData({
                    bids: [],
                    highestBid: null
                });
                return;
            }

            // Convert Firebase's bid object into an array.
            const bidList = Object.entries(bids).map(([bidId, bid]) => ({
                bidId,
                ...bid
            }));

            // Create a list of unique bidder ids from the bid list.
            const uniqueBidderIds = [
                ...new Set(
                    bidList.map((bid) => bid.bidderId)
                )
            ];

            // Fetch any bidder accounts not already in the cache.
            await Promise.all(
                uniqueBidderIds.map(async (bidderId) => {
                    if (!accountsById.has(bidderId)) {
                        const account = await getAccountById(bidderId);
                        accountsById.set(bidderId, account);
                    }
                })
            );

            // Attach each bidder account to its bid.
            const enrichedBids = bidList.map((bid) => ({
                ...bid,
                bidder: accountsById.get(bid.bidderId)
            }));

            // Find the bid with the highest amount.
            const highestBid = enrichedBids.reduce(
                (highest, current) => (
                    current.amount > highest.amount
                        ? current
                        : highest
                )
            );

            // Sort bid history newest-first.
            const bidsByTimestamp = [...enrichedBids].sort(
                (a, b) => b.timestamp - a.timestamp
            );

            // Send the final auction state back to Home.
            onAuctionData({
                bids: bidsByTimestamp,
                highestBid
            });
        },
        (error) => {
            // Let Home handle the error if it provided an error handler.
            if (onError) {
                onError(error);
                return;
            }

            // Otherwise, log the Firebase read error.
            console.error(error);
        }
    );
}

/*
Subscribes to previous winners and attaches each winner's account information.

onPastWinners receives an array of winner records ordered by newest first.
Each winner includes a bidder field with the account information for bidderId.
*/
export function subscribeToPastWinners(onPastWinners, onError) {
    const previousWinnersRef = ref(database, "previousWinners");

    return onValue(
        previousWinnersRef,
        async (snapshot) => {
            const previousWinners = snapshot.val();

            if (!previousWinners) {
                onPastWinners([]);
                return;
            }

            const winnerList = Object.entries(previousWinners).map(([monthId, winner]) => ({
                monthId,
                ...winner
            }));

            const enrichedWinners = await Promise.all(
                winnerList.map(async (winner) => {
                    const account = await getAccountById(winner.bidderId);

                    return {
                        ...winner,
                        bidder: account
                    };
                })
            );

            const winnersByTimestamp = [...enrichedWinners].sort(
                (a, b) => b.timestamp - a.timestamp
            );

            onPastWinners(winnersByTimestamp);
        },
        (error) => {
            if (onError) {
                onError(error);
                return;
            }

            console.error(error);
        }
    );
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
