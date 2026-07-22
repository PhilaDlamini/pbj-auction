/*
The home screen
*/
import HighestBid from "../components/HighestBid";
import BidForm from "../components/BidForm";
import BidHistory from "../components/BidHistory";

function Home () {
    return (
        <>
            <HighestBid />
            <BidForm /> 
            <BidHistory />
        </>
    ); 
}


export default Home