# Peanut Butter & Jelly Auction 🥜🍓

A fundraising auction platform built for **Imagine Scholar**.

The goal is to create a simple monthly online auction where supporters can bid on a sponsored peanut butter and jelly item. The highest bidder at the end of the month is notified and the funds support Imagine Scholar's initiatives.

---

## Tech Stack

### Frontend
- React
- JavaScript
- Vite

### Backend
- Firebase Authentication
- Firebase Realtime Database
- Firebase Cloud Functions (planned)

### Hosting
- Vercel
- GitHub

---

# Features

## Current Auction

Users can:

- View the current highest bid
- See the current highest bidder
- Submit a higher bid
- View bid history

Rules:
- A new bid must be higher than the current highest bid
- Users can place multiple bids during the month

---

## Monthly Auction Lifecycle

At the end of each month:

1. Determine the highest bidder
2. Notify the winner through email
3. Notify the auction coordinator
4. Reset the auction for the next month

---

## Automated Reminders

Twice per month:

- Send reminder emails to all users encouraging them to participate in the auction

---

# Database Structure

Firebase Realtime Database:

root
│
├── accounts
│   │
│   ├── uid1
│   │     name: "Phila"
│   │     email: "phila@email.com"
│   │     photoURL: "image-url"
│   │
│   └── uid2
│         name: "Wethu"
│         email: "wethu@email.com"
│         photoURL: "image-url"
│
└── bids
    │
    ├── bid1
    │     bidderId: "uid1"
    │     amount: 25
    │     timestamp: 1753212345
    │
    └── bid2
          bidderId: "uid2"
          amount: 50
          timestamp: 1753212500


---

# Data Models

## Account

Represents a registered user.

```js
{
    uid: "firebase-user-id",
    name: "Phila Dlamini",
    email: "phila@example.com",
    photoURL: "https://example.com/profile.jpg"
}
``` 

Stored at:
```accounts/{uid}```

## Bid
Represents an auction bid.
```js 
{
    bidderId: "firebase-user-id",
    bidderName: "Phila Dlamini",
    amount: 50,
    timestamp: 1753212345
}
```

Stored at:
```bids/{bidId}```
