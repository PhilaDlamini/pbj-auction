/*
The past winners page.
*/
import { useEffect, useState } from "react";
import { subscribeToPastWinners } from "../firebase/database.js";
import { formatDonationDate } from "../utils/formatDonationDate.js";
import "./PastWinners.css";

function PastWinners() {
    const [pastWinners, setPastWinners] = useState([]);

    useEffect(() => {
        const unsubscribe = subscribeToPastWinners(
            setPastWinners,
            (error) => {
                console.error(error);
            }
        );

        return unsubscribe;
    }, []);

    return (
        <main className="auction-card">
            <section className="past-winners">
                <h1 className="past-winners__title">Past winners</h1>
                {pastWinners.length === 0 ? (
                    <p className="past-winners__empty">Past winners will appear here after each auction closes.</p>
                ) : (
                    <ul className="past-winners__list">
                        {pastWinners.map((winner) => (
                            <li className="past-winners__row" key={winner.monthId}>
                                <div className="past-winners__photo-wrap">
                                    {winner.photoURL ? (
                                        <img
                                            className="past-winners__photo"
                                            src={winner.photoURL}
                                            alt={`PB&J donation for ${winner.month}`}
                                        />
                                    ) : (
                                        <div className="past-winners__photo-placeholder">
                                            PB&J
                                        </div>
                                    )}
                                </div>
                                <div className="past-winners__details">
                                    <div className="past-winners__topline">
                                        <h2 className="past-winners__month">{winner.month}</h2>
                                        <span className="past-winners__amount">R{winner.amount}</span>
                                    </div>
                                    <p className="past-winners__winner">
                                        Won by {winner.bidder?.name ?? "Unknown bidder"}
                                    </p>
                                    <p className="past-winners__date">
                                        Donated {formatDonationDate(winner.timestamp)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}

export default PastWinners;
