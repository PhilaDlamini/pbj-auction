const {onRequest} = require("firebase-functions/v2/https");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {logger} = require("firebase-functions");
const {defineSecret} = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");
const COORDINATOR_EMAIL = defineSecret("COORDINATOR_EMAIL");
const FROM_EMAIL = defineSecret("FROM_EMAIL");

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
 * Finds the highest bid from a Firebase bids object.
 *
 * @param {object} bids The bids object from Realtime Database.
 * @return {object} The highest bid with bidId attached.
 */
function getHighestBid(bids) {
  const bidList = Object.entries(bids).map(([bidId, bid]) => ({
    bidId,
    ...bid,
  }));

  return bidList.reduce((highest, current) => {
    if (current.amount > highest.amount) {
      return current;
    }

    return highest;
  });
}

/**
 * Sends one email through Resend.
 *
 * @param {object} email The email fields.
 * @param {string|string[]} email.to The recipient address.
 * @param {string} email.subject The email subject.
 * @param {string} email.text The plain text email body.
 * @return {Promise<object>} The Resend API response.
 */
async function sendEmail({to, subject, text}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY.value()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL.value(),
      to,
      subject,
      text,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Resend email failed: ${JSON.stringify(result)}`);
  }

  return result;
}

/**
 * Sends winner and coordinator emails for a closed auction.
 *
 * @param {object} closeData The closed auction details.
 * @param {object} closeData.highestBid The winning bid.
 * @param {object} closeData.winnerAccount The winning account.
 * @param {string} closeData.month The month label.
 * @return {Promise<void>}
 */
async function sendMonthlyCloseEmails({
  highestBid,
  winnerAccount,
  month,
}) {
  const winnerMessage = [
    `You won the PB&J auction for ${month}`,
    `with a bid of R${highestBid.amount}.`,
  ].join(" ");

  await sendEmail({
    to: winnerAccount.email,
    subject: `You won the PB&J auction for ${month}`,
    text: [
      `Hi ${winnerAccount.name},`,
      "",
      winnerMessage,
      "",
      "The coordinator will follow up with payment details.",
    ].join("\n"),
  });

  await sendEmail({
    to: COORDINATOR_EMAIL.value(),
    subject: `PB&J auction winner for ${month}`,
    text: [
      `Winner: ${winnerAccount.name}`,
      `Email: ${winnerAccount.email}`,
      `Amount: R${highestBid.amount}`,
      `Month: ${month}`,
      "",
      "Please invoice the winner and collect payment.",
    ].join("\n"),
  });
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

  // Find the highest bid and the corresponding winner account
  const highestBid = getHighestBid(bids);
  const accountSnapshot = await db
      .ref(`accounts/${highestBid.bidderId}`)
      .get();
  const winnerAccount = accountSnapshot.val();

  if (!winnerAccount) {
    throw new Error(`No account found for ${highestBid.bidderId}`);
  }

  const now = new Date();
  const monthParts = getAuctionMonthParts(now);
  const monthId = `${monthParts.year}-${monthParts.month}`;
  const month = MONTH_LABEL_FORMATTER.format(now);

  // Save the winner to the previousWinners path
  await db.ref(`previousWinners/${monthId}`).set({
    month,
    bidderId: highestBid.bidderId,
    photoURL: "",
    amount: highestBid.amount,
    timestamp: highestBid.timestamp,
  });

  // Clear the bids and save them to lastMonthBids for record-keeping
  await db.ref("lastMonthBids").set(bids);
  await db.ref("bids").remove();

  // Send emails to the winner and the coordinator
  await sendMonthlyCloseEmails({
    highestBid,
    winnerAccount,
    month,
  });

  logger.log(`Saved ${month} winner: ${highestBid.bidderId}`);

  return {
    status: "winner-saved",
    monthId,
    emailsSent: true,
    winner: {
      bidderId: highestBid.bidderId,
      amount: highestBid.amount,
      timestamp: highestBid.timestamp,
      email: winnerAccount.email,
    },
  };
}

// Temporary HTTP trigger for manual testing.
// Remove or protect this before production.
exports.testCloseMonthlyAuction = onRequest(
    {
      secrets: [RESEND_API_KEY, COORDINATOR_EMAIL, FROM_EMAIL],
    },
    async (req, res) => {
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
    },
);

exports.closeMonthlyAuction = onSchedule(
    {
      schedule: "59 23 28-31 * *",
      timeZone: TIME_ZONE,
      secrets: [RESEND_API_KEY, COORDINATOR_EMAIL, FROM_EMAIL],
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
