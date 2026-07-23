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
import { getAuctionData } from "../firebase/database.js";
import "./Home.css";

function Home () {
    const [highestBid, setHighestBid] = useState(null);
    const [bids, setBids] = useState([]);

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error(error);
        }
    }

    async function loadAuction() {
        const auction = await getAuctionData();

        setHighestBid(auction.highestBid);
        setBids(auction.bids);
    }

    useEffect(() => {
        loadAuction();
    }, []);

    return (
        <div className="page">
            <Header onLogout={handleLogout} />
            <main className="auction-card">
                <HighestBid highestBid={highestBid} />
                <AcaciaDivider />
                <BidForm highestBid={highestBid} loadAuction={loadAuction} />
                <BidHistory bids={bids} />
            </main>
        </div>
    );
}

export default Home;
