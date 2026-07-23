/*
The home screen
*/
import HighestBid from "../components/HighestBid";
import BidForm from "../components/BidForm";
import BidHistory from "../components/BidHistory";
import { logout } from "../firebase/auth.js";
import { useState, useEffect } from "react";
import { getAuctionData } from "../firebase/database.js";

//Hanldes logging out the user
async function handleLogout() {
    try {
        await logout();
    } catch (error) {
        console.error(error);
    }
}

function Home () {

    //The home component owns the bidding state 
    const [highestBid, setHighestBid] = useState(null);
    const [bids, setBids] = useState([]);

    //Load the auction info when the component is mounted
    async function loadAuction() {

        const auction = await getAuctionData();
    
        setHighestBid(auction.highestBid);
        setBids(auction.bids);
    
    }

    useEffect(() => {
        loadAuction();
    }, []);


    return (
        <>
            <HighestBid highestBid={highestBid}/>
            <BidForm highestBid={highestBid} loadAuction={loadAuction}/>
            <BidHistory bids={bids} />
            <button onClick={handleLogout}>Logout</button>
        </>
    ); 
}


export default Home