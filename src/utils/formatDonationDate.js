export function formatDonationDate(timestamp) {
    return new Date(timestamp).toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}
