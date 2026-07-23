/*
The home screen
*/
import HighestBid from "../components/HighestBid";
import BidForm from "../components/BidForm";
import BidHistory from "../components/BidHistory";
import AcaciaDivider from "../components/AcaciaDivider";
import Header from "../components/Header";
import { logout } from "../firebase/auth.js";
import "./Home.css";

function Home () {

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="page">
            <Header onLogout={handleLogout} />
            <main className="auction-card">
                <HighestBid />
                <AcaciaDivider />
                <BidForm />
                <BidHistory />
            </main>
        </div>
    );
}


export default Home
