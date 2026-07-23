/*
The home screen
*/
import HighestBid from "../components/HighestBid";
import BidForm from "../components/BidForm";
import BidHistory from "../components/BidHistory";
import { logout } from "../firebase/auth.js";

function Home () {

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <HighestBid />
            <BidForm /> 
            <BidHistory />
            
            <button onClick={handleLogout}>Logout</button>
        </>
    ); 
}


export default Home