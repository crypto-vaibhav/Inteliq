# Web3 AI Wallet

An AI-powered Web3 wallet that allows users to interact with the Solana blockchain using natural language.

## Features

- Connect your Phantom wallet
- Use natural language to perform token swaps
- AI-powered interface using GPT-4
- Real-time token swaps via Jupiter Aggregator
- Clean UI built with Next.js, Tailwind CSS and ShadCN UI

## Getting Started

1. Create a `.env.local` file from `.env.local.example` and add your OpenAI API key

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Connect your Phantom wallet using the "Connect Wallet" button
2. Type natural language commands in the chat interface like:
   - "Swap 2 SOL to USDC"
   - "Convert 5 USDC to SOL"
3. Confirm the transaction when prompted

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS & ShadCN UI
- Solana Web3.js
- @solana/wallet-adapter for wallet connections
- Jupiter Aggregator for token swaps
- OpenAI GPT-4 for natural language processing

## Deployment

This project is deployed on Render. The deployment is configured to automatically build and deploy from the main branch.

### Environment Variables Required:
- NEXT_PUBLIC_SOLANA_RPC_URL
- NEXT_PUBLIC_TWITTER_API_KEY
- NEXT_PUBLIC_TWITTER_API_SECRET
- NEXT_PUBLIC_TWITTER_ACCESS_TOKEN
- NEXT_PUBLIC_TWITTER_ACCESS_TOKEN_SECRET
- NEXT_PUBLIC_OPENAI_API_KEY

### Build Commands:
- Build: `npm install && npm run build`
- Start: `npm start`

## Environment Setup

1.  Copy `.env.example` to `.env.local`
    ```bash
    cp .env.example .env.local
    ```
2.  Add your API keys to `.env.local`.  **Important**: Never commit `.env.local` file.
3.  The following environment variables are required:
    -   `OPENAI_API_KEY`: Your OpenAI API key.
    -   `NEXT_PUBLIC_SOLANA_RPC_URL`: Solana RPC URL (e.g., Helius).
    -   `TWITTER_BEARER_TOKEN`: Twitter Bearer Token.
    -   `TWITTER_API_KEY`: Twitter API Key.
    -   `TWITTER_API_SECRET`: Twitter API Secret.
    -   `TWITTER_ACCESS_TOKEN`: Twitter Access Token.
    -   `TWITTER_ACCESS_TOKEN_SECRET`: Twitter Access Token Secret.
    -   `COINMARKETCAP_API_KEY`: CoinMarketCap API Key.