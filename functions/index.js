const {onRequest} = require("firebase-functions/v2/https");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {logger} = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const TIME_ZONE = "Africa/Johannesburg";
const MONTH_ID_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
});
const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "long",
});

/**
 * Returns the year and month for a date in the auction time zone.
 *
 * @param {Date} date The date to format.
 * @return {{year: string, month: string}} The formatted date parts.
 */
function getAuctionMonthParts(date) {
  const parts = MONTH_ID_FORMATTER.formatToParts(date);

  return {
    year: parts.find((part) => part.type === "year").value,
    month: parts.find((part) => part.type === "month").value,
  };
}

/**
 * Checks if the given date is the last day of its month.
 *
 * @param {Date} date The date to check.
 * @return {boolean} True when tomorrow is in a different month.
 */
function isLastDayOfAuctionMonth(date) {
  const today = getAuctionMonthParts(date);
  const tomorrow = getAuctionMonthParts(
      new Date(date.getTime() + 24 * 60 * 60 * 1000),
  );

  return today.year !== tomorrow.year || today.month !== tomorrow.month;
}

/**
 * Closes the current monthly auction by saving the highest bid as the winner.
 *
 * @return {Promise<object>} The result of the close operation.
 */
async function closeMonthlyAuction() {
  const db = admin.database();

  const bidsSnapshot = await db.ref("bids").get();
  const bids = bidsSnapshot.val();

  if (!bids) {
    logger.log("No bids found. Skipping monthly close.");

    return {
      status: "no-bids",
    };
  }

  const bidList = Object.entries(bids).map(([bidId, bid]) => ({
    bidId,
    ...bid,
  }));

  const highestBid = bidList.reduce((highest, current) => {
    if (current.amount > highest.amount) {
      return current;
    }

    return highest;
  });

  const now = new Date();
  const monthParts = getAuctionMonthParts(now);
  const monthId = `${monthParts.year}-${monthParts.month}`;
  const month = MONTH_LABEL_FORMATTER.format(now);

  await db.ref(`previousWinners/${monthId}`).set({
    month,
    bidderId: highestBid.bidderId,
    photoURL: "",
    amount: highestBid.amount,
    timestamp: Date.now(),
  });

  // Uncomment this after confirming the winner record is written correctly.
  // await db.ref("bids").remove();

  logger.log(`Saved ${month} winner: ${highestBid.bidderId}`);

  return {
    status: "winner-saved",
    monthId,
    winner: {
      bidderId: highestBid.bidderId,
      amount: highestBid.amount,
      timestamp: highestBid.timestamp,
    },
  };
}

// Temporary HTTP trigger for manual testing.
// Remove or protect this before production.
exports.testCloseMonthlyAuction = onRequest(async (req, res) => {
  try {
    const result = await closeMonthlyAuction();

    res.status(200).json(result);
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

exports.closeMonthlyAuction = onSchedule(
    {
      schedule: "59 23 28-31 * *",
      timeZone: TIME_ZONE,
    },
    async () => {
      const now = new Date();

      if (!isLastDayOfAuctionMonth(now)) {
        logger.log("Not the last day of the month. Skipping monthly close.");
        return;
      }

      await closeMonthlyAuction();
    },
);
