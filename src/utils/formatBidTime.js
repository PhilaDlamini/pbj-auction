// Formats a bid timestamp into compact relative text for bid lists.
export function formatBidTime(timestamp, nowTimestamp = Date.now()) {
    const date = new Date(timestamp);
    const now = new Date(nowTimestamp);
    const seconds = Math.max(
        Math.floor((now - date) / 1000),
        0
    );

    if (seconds < 60) {
        return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h`;
    }

    const days = Math.floor(hours / 24);

    if (days <= 2) {
        return `${days}d`;
    }

    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString([], {
            month: "short",
            day: "numeric"
        });
    }

    return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}
