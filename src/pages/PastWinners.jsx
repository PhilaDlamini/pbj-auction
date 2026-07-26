/*
The past winners page.
*/
import { useEffect, useState } from "react";
import {
    subscribeToPastWinners,
    updatePastWinnerPhotoById,
    uploadPastWinnerPhotoById
} from "../firebase/database.js";
import { formatDonationDate } from "../utils/formatDonationDate.js";
import "./PastWinners.css";

function PastWinners() {
    const [pastWinners, setPastWinners] = useState([]);
    const [uploadingWinnerId, setUploadingWinnerId] = useState(null);
    const [photoError, setPhotoError] = useState("");

    // Bind to previousWinners and listen for changes.
    useEffect(() => {
        const unsubscribe = subscribeToPastWinners(
            setPastWinners,
            (error) => {
                console.error(error);
            }
        );

        return unsubscribe;
    }, []);

    // Handles the photo change event for a specific past winner
    async function handlePhotoChange(monthId, event) {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        setPhotoError("");
        setUploadingWinnerId(monthId);
        try {
            const photoURL = await uploadPastWinnerPhotoById(monthId, file);

            await updatePastWinnerPhotoById(monthId, photoURL);
        } catch (error) {
            console.error(error);
            setPhotoError("Couldn't update the winner photo. Try again.");
        } finally {
            setUploadingWinnerId(null);
            event.target.value = "";
        }
    }

    return (
        <main className="auction-card">
            <section className="past-winners">
                <h1 className="past-winners__title">Past winners</h1>
                {photoError && <p className="past-winners__error">{photoError}</p>}
                {pastWinners.length === 0 ? (
                    <p className="past-winners__empty">Past winners will appear here after each auction closes.</p>
                ) : (
                    <ul className="past-winners__list">
                        {pastWinners.map((winner) => (
                            <li className="past-winners__row" key={winner.monthId}>
                                <div className="past-winners__photo-wrap">
                                    <label className="past-winners__photo-label" htmlFor={`winner-photo-${winner.monthId}`}>
                                        {winner.photoURL ? (
                                            <img
                                                className="past-winners__photo"
                                                src={winner.photoURL}
                                                alt={`PB&J donation for ${winner.month}`}
                                            />
                                        ) : (
                                            <span className="past-winners__photo-placeholder">
                                                PB&J
                                            </span>
                                        )}
                                        {uploadingWinnerId === winner.monthId && (
                                            <span className="past-winners__uploading">Uploading...</span>
                                        )}
                                    </label>
                                    <input
                                        className="past-winners__photo-input"
                                        id={`winner-photo-${winner.monthId}`}
                                        type="file"
                                        accept="image/*"
                                        disabled={uploadingWinnerId === winner.monthId}
                                        onChange={(event) => handlePhotoChange(winner.monthId, event)}
                                    />
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
