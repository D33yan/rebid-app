# Rebid - Codebase Scan & Refactoring Adjustments

This document outlines the results of a comprehensive code audit performed on the Rebid React Native/Expo codebase. It details the **critical runtime bugs**, **navigation logic errors**, and **UI style upgrades** applied to modernize the app and achieve production readiness.

---

## 🚨 Section 1: Critical Code & Logic Adjustments (Fixed)

Here is a summary of the critical bugs that were identified during the codebase scan and successfully resolved in this refactor:

### 1. Infinite Render Loop in `app-context.js`
* **Issue**: The `useEffect` hook in `app-context.js` lacked a dependency array entirely:
  ```javascript
  useEffect(() => { isLoggedIn() })
  ```
  This executed `isLoggedIn()` on every render lifecycle. `isLoggedIn` called `setUserToken` (updating state), which triggered a re-render, creating a severe infinite render loop that crashed the app and locked state updates.
* **Resolution**: Replaced manual AsyncStorage polling with a reactive Firebase `onAuthStateChanged` auth listener inside a properly controlled `useEffect` with an empty dependency array `[]`. When a user logs in or out in Firebase, the state syncs instantly and cleanly once, removing the loop.

### 2. Async Storage Promise Misuse & Token Shadowing
* **Issue**: `AsyncStorage.getItem('userToken', userToken)` was called without `await` and passing incorrect parameters (AsyncStorage only takes one parameter `key` for retrieval). Since it returned a Promise instead of a string, calling `setUserToken` passed a truthy Promise object. This trickled down and incorrectly authorized root navigation containers even with a null token.
* **Resolution**: Fully rewrote state retrieval using `async/await`:
  ```javascript
  const token = await AsyncStorage.getItem('userToken');
  setUserToken(token);
  ```

### 3. Infinite Render Loops in `Auctions.js` & `Profile.js`
* **Issue**: Both screen files executed database-querying state-updating functions (`getAuctions()` and `getUser()`) directly within their main render bodies. Every render triggered a network request to Firestore and updated the component state, which re-rendered the screen, leading to thousands of recursive database reads per minute.
* **Resolution**: Moved the initial state loaders inside standard `useEffect` hooks with an empty dependency array `[]` so they trigger only when the component mounts.
  ```javascript
  React.useEffect(() => {
      getAuctions();
  }, []);
  ```

### 4. Crash due to Undefined Variable (`onSnap`) in `Profile.js`
* **Issue**: The profile loading query attempted to set a state using a variable (`onSnap`) that had never been initialized or defined:
  ```javascript
  const getUser = async () => {
      await getDoc(doc(db,'users',userUID))
      setUser(onSnap.data()) // onSnap is undefined, causing a runtime crash!
  }
  ```
* **Resolution**: Refactored the code to assign the result of `getDoc` to `onSnap` and safely checked if the record existed:
  ```javascript
  const userDocRef = doc(db, 'users', activeUID);
  const onSnap = await getDoc(userDocRef);
  if (onSnap.exists()) {
      setUser(onSnap.data());
  }
  ```

### 5. Username Field Capitalization Bug
* **Issue**: In `Profile.js`, username fields were accessed via `user.firstname` and `user.lastname`. However, in `CreateAccount.js`, user details were saved to Firestore using `firstName` and `lastName` (CamelCase 'N'). This led to usernames rendering as `undefined undefined` on the profile page.
* **Resolution**: Standardized naming conventions and added fallbacks to resolve both CamelCase and lowercase properties seamlessly:
  ```javascript
  const fullName = `${user.firstName || user.firstname || ''} ${user.lastName || user.lastname || ''}`;
  ```

### 6. Sign In Button Bypassing Form Validation & Authentication
* **Issue**: The submit button in `Signin.js` was linked directly to `onPress={login}` from the custom AppContext context provider. This set a dummy `'Trigger'` token, allowing access to the main dashboard instantly with any credentials, completely bypassing Formik's validation schemas and Firebase Authentication (`signInWithEmailAndPassword`).
* **Resolution**: Changed the action handler to `onPress={handleSubmit}`. Clicking the button now triggers Formik's validator, running Yup checks, and executing Firebase authentication. Successful logins trigger the global `onAuthStateChanged` hook to securely grant tab access.

---

## 🎨 Section 2: Premium UI Design Upgrades (Applied)

The user experience has been elevated with a high-end, responsive design system consistent with modern mobile standards:

1. **Refined Core Theme (`config/theme.js`)**:
   * Replaced generic hex values with a curated, professional color palette: Deep Midnight Navy, Slate Grays for text, Vibrant Coral for CTAs, and soft ice-blue canvas backgrounds.
   * Established standardized design tokens for corner roundness (buttons, cards, badges) and layout spacings.
   * Integrated smooth drop shadows to build depth in UI components.
   * **Expo SDK & Dependency Ecosystem Upgrade**: Fully upgraded the core framework from **Expo SDK 49** to **Expo SDK 51** and React Native from `0.72.4` to `0.74.5`. Aligned all native mobile plugins (AsyncStorage, Screens, Safe Area, Gesture Handler, SVG, and Babel) to their expected stable versions to ensure full runtime stability, modern toolchain support, and eliminate outdated security warnings.
2. **Modernized Feed Cards (`Auctions.js`)**:
   * Removed dark-navy cards and replaced them with elegant white container cards, soft margins, and fine border separations.
   * Added beautiful "Time Remaining" badges utilizing soft red tints.
   * Cleaned up layouts to support fluid vertical scrolling and full-screen pull-to-refresh.
3. **Optimized Profile Page (`Profile.js`)**:
   * Replaced duplicate rows with a premium unified stats card displaying key auction records (Total Earned, Bids Placed).
   * Refined header banner styling, avatar overlays, and created an elegant Sign-Out button.
4. **Cohesive Form Styles (`Signin.js`, `CreateAccount.js`, `Sell.js`)**:
   * Grouped text fields inside centered, modern paper-styled card blocks with responsive shadow parameters.
   * Standardized custom buttons with rich accent colors and bold text parameters.

---

## 💡 Section 3: Future Recommendations

To take the Rebid mobile application to the next level, we suggest focusing on these roadmap elements:

* **Complete `MyBids.js` implementation**: Currently, this file acts as a second item-upload page. It should be refactored to fetch bids placed by the authenticated user from a nested Firestore collection or filter.
* **Dynamic Photo Uploads**: Integrate Expo Image Picker in `Sell.js` so that sellers can upload images from their device library directly to Firebase Cloud Storage, returning a URL to save to Firestore.
* **Active Countdown Timers**: Use temporary intervals (`setInterval`) or dynamic date formats (like `date-fns` or `moment`) on cards to display real-time counting down clocks for expiring auctions.
