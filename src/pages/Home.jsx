/*
The home screen
*/
import { useEffect, useState } from "react";
import HighestBid from "../components/HighestBid";
import BidForm from "../components/BidForm";
import BidHistory from "../components/BidHistory";
import AcaciaDivider from "../components/AcaciaDivider";
import Header from "../components/Header";
import { logout } from "../firebase/auth.js";
import { subscribeToAuctionData } from "../firebase/database.js";
import "./Home.css";

function Home ({ onNavigate }) {
    const [highestBid, setHighestBid] = useState(null);
    const [bids, setBids] = useState([]);

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error(error);
        }
    }

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
        <div className="page">
            <Header onLogout={handleLogout} activePage="home" onNavigate={onNavigate} />
            <main className="auction-card">
                <HighestBid highestBid={highestBid} />
                <AcaciaDivider />
                <BidForm highestBid={highestBid} />
                <BidHistory bids={bids} />
            </main>
        </div>
    );
}

export default Home;
