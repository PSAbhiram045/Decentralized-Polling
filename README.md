# Decentralized-Polling
# Decentralized-Polling
# DecentraPoll DApp - Changes Overview

This document outlines the key changes and improvements made between the two versions of the **DecentraPoll DApp**.

## Version 1: Basic Poll Display

**Features:**
1. **Wallet Connection:**
   - Connects the user's wallet using MetaMask.
   - Displays the user's wallet address.

2. **Poll Display:**
   - Fetches existing polls from the smart contract.
   - Displays poll question, options, vote counts, total votes, and poll status.

3. **Poll Data Structure:**
   - Polls are fetched and displayed with basic details: question, options, vote counts, and active status.
   - No functionality for creating or voting on polls.

**Key Code Changes:**
- Introduced the `loadBlockchainData` function to fetch and display existing polls.
- Integrated MetaMask's `eth_requestAccounts` to connect the user's wallet.
- Displayed poll data such as options, vote counts, total votes, and poll status.

---

## Version 2: Enhanced Poll Creation and Voting

**Features Added:**
1. **Wallet Connection:**
   - The app now allows users to manually connect their wallet by clicking a button (`Connect Wallet`).
   - Tracks the user's wallet address and updates when the address changes using `accountsChanged` event.

2. **Poll Creation:**
   - Users can now create a new poll by specifying a question, adding multiple options, and setting a duration.
   - The poll creation process involves:
     - `addOption` function for adding options to the poll.
     - `createPoll` function to submit the poll to the smart contract.
     - Validations for the poll question, options, and duration before creating the poll.

3. **Poll Voting:**
   - Users can vote on active polls. Each option in a poll displays a "Vote" button if the poll is still active.
   - Voting is done through the `vote` function, which sends the vote to the smart contract.

4. **Poll Data Structure Update:**
   - Poll data now includes additional information: `createdAt` timestamp, `expiryTime`, and the ability to track poll expiry and status (Active, Closed, Expired).
   - Poll expiry is handled by comparing the current timestamp with the `expiryTime`.

5. **Improved User Interface:**
   - The app now includes a section to create new polls with input fields for the poll question, options, and duration.
   - The app lists existing polls with the option to vote and shows the status of each poll (Active, Closed, Expired).

**Key Code Changes:**
- Added state variables like `question`, `options`, `newOption`, `duration`, and `loading` to manage poll creation.
- Added functions: `addOption`, `createPoll`, `vote`, `fetchPolls`, and `formatTimestamp` to handle poll creation, voting, and fetching.
- Integrated the handling of poll expiry and display of poll status (Active, Expired, Closed).
- Improved the UI for creating polls, listing polls, and voting on options.

---

## Differences in Core Functionality:

| **Feature**                 | **Version 1**                                  | **Version 2**                                  |
|-----------------------------|------------------------------------------------|------------------------------------------------|
| **Wallet Connection**        | Automatic on page load                         | Manual connection button with wallet address update |
| **Poll Creation**            | Not available                                  | Users can create polls with options and duration |
| **Poll Voting**              | Not available                                  | Users can vote on active polls |
| **Poll Expiry**              | Not handled                                    | Polls have expiry dates, and the status changes to "Expired" after expiry |
| **Poll Data Display**        | Displays question, options, and vote counts    | Displays question, options, vote counts, and status with option to vote |
| **User Interface**           | Simple display of polls                        | Includes poll creation form, options, and voting buttons |

---

## Conclusion

The transition from Version 1 to Version 2 enhances the functionality significantly. In Version 2, users can now interact with the smart contract by creating and voting on polls. The UI is more interactive, and the handling of poll expiry adds a time-sensitive element to the polls. Version 1 served as a simple display of data from the blockchain, whereas Version 2 transforms the DApp into a fully interactive decentralized polling system.
