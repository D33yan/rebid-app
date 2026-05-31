# Rebid - Mobile Bidding & Auction Platform

Rebid is a premium mobile auction application built with React Native and Expo. It allows users to bid on expiring products, view recent auctions, create custom auctions, and manage their profiles in real-time.

---

## 🚀 Getting Started

Follow these instructions to get your development environment set up and run the Rebid app.

### Prerequisites

Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [Expo Go](https://expo.dev/client) app on your mobile device (iOS/Android) or an emulator configured (Android Studio / Xcode)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/D33yan/rebid-app.git
   cd rebid-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run start
   ```

4. **Run on target platforms**:
   * Press `a` in the terminal to run on an **Android emulator**.
   * Press `i` to run on an **iOS simulator**.
   * Scan the **QR Code** displayed in the terminal with your phone's camera (iOS) or Expo Go app (Android) to test on a physical device.

---

## 🛠️ Technology Stack

Rebid leverages a modern mobile architecture to provide rich features and fluid interactions:

* **Framework**: [React Native](https://reactnative.dev/) with [Expo SDK 51](https://docs.expo.dev/)
* **UI & Styling**: Custom Premium Design System built with Vanilla `StyleSheet` & [React Native Paper](https://reactnativepaper.com/)
* **Navigation**: [React Navigation](https://reactnavigation.org/) (Bottom Tabs + Native Stack)
* **Form Management**: [Formik](https://formik.org/) and [Yup](https://github.com/jquense/yup) for schema-based validation
* **Backend Database & Auth**: [Firebase v10](https://firebase.google.com/docs/web/setup) (Authentication & Firestore Cloud Database)
* **Icons**: [FontAwesome Vector Icons](https://fontawesome.com/) & [Ionicons](https://ionicons.com/)

---

## 📂 Codebase Structure

Here is a map of the `rebid-app` project files and directories:

```text
rebid-app/
├── assets/                  # Images, background backdrops, and static assets
│   ├── demo-products.js     # Fallback mock products data
│   └── categories.js        # Active categories structure with FontAwesome icons
├── config/                  # App configurations
│   ├── app-context.js       # Global state provider (Auth, UIDs, and session sync)
│   ├── firebase.config.js   # Firebase Client configuration and connection pool
│   └── theme.js             # High-end unified UI design system tokens
├── screens/                 # Application Screens
│   ├── AppNav.js            # Core Root Navigator switcher (Auth vs Main core)
│   ├── stack-navigation.js  # Stack Navigator tree for auth and loading flows
│   ├── Starter.js           # Onboarding splash/introduction screen
│   ├── Signin.js            # User Sign In form with Firebase auth
│   ├── CreateAccount.js     # User Registration form with Firestore doc creation
│   ├── Home.js              # Home screen (contains bottom-tab layout & dashboards)
│   ├── Auctions.js          # All Auctions feed loaded from Firestore
│   ├── Sell.js              # Auction creator form
│   ├── MyBids.js            # Bids creation page
│   └── Profile.js           # User profile screen with stats and logs
├── utilities/               # Reusable utility scripts & indicators
│   ├── comma-sep-num.js     # Number formatting utility (Currency format)
│   └── screen-loader-indicator.js # Clean full-screen loading spinner
├── App.js                   # Main application entry point
├── app.json                 # Expo configurations
├── babel.config.js          # Babel transpiler configuration
└── package.json             # NPM package manifest
```

---

## 🔐 Firebase Database Design

The application links to a Firebase project using the configuration details found in [firebase.config.js](file:///c:/Users/DEVINE/Documents/rebid-app/config/firebase.config.js).

### Firestore Collections Layout:
1. **`users` Collection**: Stores user profile details.
   * Document ID: User's Auth `uid`
   * Fields: `firstName` (string), `lastName` (string), `email` (string), `createdAt` (timestamp).
2. **`auctions` Collection**: Stores listed auction items.
   * Document ID: Auto-generated string
   * Fields: `title` (string), `description` (string), `initialPrice` (number/string), `bidIncrement` (string), `photoUrl` (string), `endDate` (string), `createdAt` (timestamp).
