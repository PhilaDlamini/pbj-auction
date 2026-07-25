/*
The home screen
*/
import { useEffect, useState } from "react";
import HighestBid from "../components/HighestBid";
import BidForm from "../components/BidForm";
import BidHistory from "../components/BidHistory";
import AcaciaDivider from "../components/AcaciaDivider";
import { subscribeToAuctionData } from "../firebase/database.js";
import { AUTH_PAGES } from "../constants/pages.js";
import "./Home.css";

function Home ({ onNavigate }) {
    const [highestBid, setHighestBid] = useState(null);
    const [bids, setBids] = useState([]);

    // Home binds to the Firebase 'bids' path and listens for changes.
    // When bids change, it updates state shared with HighestBid, BidForm, and BidHistory.
    useEffect(() => {
        const unsubscribe = subscribeToAuctionData(
            (auction) => {
                setHighestBid(auction.highestBid);
                setBids(auction.bids);
            },
            (error) => {
                console.error(error);
            }
        );

        return unsubscribe;
    }, []);

    return (
        <main className="auction-card">
            <HighestBid highestBid={highestBid} />
            <AcaciaDivider />
            <BidForm highestBid={highestBid} onLoginRequired={() => onNavigate(AUTH_PAGES.LOGIN)} />
            <BidHistory bids={bids} />
        </main>
    );
}

export default Home;
