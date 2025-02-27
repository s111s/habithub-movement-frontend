Movement Chain Campaign Demo App
This project is a demo of using the Movement Chain for creating campaigns where users can participate, validate data, and earn rewards. The app is built with Next.js and shadcn/ui for a seamless user experience and wallet integration through the Aptos Wallet Adapter.

A live version of the demo app is hosted at:
https://aptos-labs.github.io/aptos-wallet-adapter

How it works:
Create Campaigns: Admin users can create campaigns with various settings, including a reward pool and participant limit.
Participate in Campaigns: Users can participate by submitting data that contributes to the campaign.
Validate Data: Data submitted by participants is validated based on predefined rules.
Reward Distribution: Validated participants can claim rewards for their contributions.
Steps to use the Movement Chain Wallet Selector
If you want to add the shadcn/ui Aptos wallet selector and use it with your Movement Chain-based app, follow these steps:

Install shadcn/ui: If you haven't already installed it, follow the shadcn/ui installation instructions.

Install wallet selector dependencies:
Run the following command to install all the shadcn/ui components that the wallet selector depends on:

npx shadcn@latest add button collapsible dialog dropdown-menu toast
Copy Wallet Selector and Provider:

Copy the wallet-selector.tsx file from this repository into your src/components/ directory.
If you haven't configured the AptosWalletAdapterProvider for your app, copy the wallet-provider.tsx file from this repo as well. Make sure you have installed @aptos-labs/wallet-adapter-react and any wallet adapter plugins for the wallets you plan to support.
Wrap your app with the WalletProvider component:
Make sure your app is wrapped with the WalletProvider component to allow wallet connections. You can check out layout.tsx for an example.

Render <WalletSelector />:
Place the <WalletSelector /> component in your app where you want users to see the "Connect Wallet" button. See page.tsx for an example of how to do this.

Run the Demo App Locally
To run the demo app locally:

Clone the repository:

git clone https://github.com/alizindy/habithub-movement-frontend.git
cd habithub-movement-frontend
Install dependencies:

yarn install
Start the development server:

yarn dev
# or
npm run dev
Open your browser and go to https://localhost:3000 to view the app.

You can start editing the page by modifying app/page.tsx, and the page will auto-update as you make changes.

Campaign Features
Campaign Creation: Admin users can define a campaign with a reward pool, participant limit, and deadline.
Participation: Users can join campaigns by submitting their data.
Data Validation: Submitted data is validated to ensure it meets the campaign's criteria.
Reward Claim: Validated participants can claim rewards based on their submissions.
Learn More
To learn more about Next.js and shadcn/ui, refer to the following resources:

Next.js Documentation - Learn about Next.js features and API.
Learn Next.js - An interactive Next.js tutorial.
shadcn/ui Documentation - Learn about shadcn/ui components and features.
