# Architecture Overview

## What I Built

This demo tackles Jeff's team's concerns with a clean, functional Web3 app. I used Dynamic's embedded wallets with ZeroDev Account Abstraction to create this demo.

## The Stack

**Frontend**: Next.js with React components
**Wallets**: Dynamic SDK for embedded wallet management  
**Gasless**: ZeroDev for Account Abstraction and paymaster sponsorship
**Blockchains**: Base Sepolia and Ethereum Sepolia testnets
**Contracts**: Simple ERC721 (NFTs) and ERC20 (DUSD tokens)

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Dynamic SDK   │    │   ZeroDev       │
│   (Next.js)     │◄──►│   (Embedded     │◄──►│   (Account      │
│                 │    │    Wallets)     │    │    Abstraction) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Smart         │    │   Base Sepolia  │    │   Ethereum      │
│   Contracts     │    │   Network       │    │   Sepolia       │
│   (ERC721/20)   │    │   (Testnet)     │    │   (Testnet)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Component Architecture

### Frontend Layer (Next.js 15)

#### App Structure
```
app/
├── page.tsx              # Main application entry point
├── layout.tsx            # Root layout with providers
└── globals.css           # Global styles and Tailwind imports
```

#### Component Hierarchy
```
Dashboard
├── NetworkIndicator      # Network status and connection info
├── BalancesPanel         # Wallet balances and activity
├── ClaimTokensCard       # DUSD token claiming
├── NFTMinting           # NFT minting functionality
├── SendMoney            # ETH transfer functionality
├── TransactionHistory   # Transaction tracking
├── AAExplanation        # Account Abstraction education
└── SecurityFeatures     # MFA and security management
```

### Smart Contract Layer

#### Contract Architecture
```
Smart Contracts/
├── FinalNFT.sol          # ERC721 NFT contract
├── DUSDToken.sol         # ERC20 token contract
└── (Deployed on both Base Sepolia and Ethereum Sepolia)
```

## Data Flow Architecture

### User Authentication Flow
```
1. User clicks "Connect Wallet"
2. Dynamic SDK presents authentication options
3. User signs in with email/social login
4. Dynamic creates embedded wallet
5. ZeroDev deploys smart account
6. User is connected and ready to transact
```

### Transaction Flow (Gasless)
```
1. User initiates transaction (mint, send, etc.)
2. Frontend calls Dynamic SDK
3. Dynamic SDK creates UserOperation
4. ZeroDev paymaster sponsors gas fees
5. Transaction executes on blockchain
6. Frontend receives confirmation
7. UI updates with new balances/status
```

## How It Works

### User Flow
1. User connects with email (no seed phrases needed)
2. Dynamic creates an embedded wallet automatically
3. ZeroDev deploys a smart account for gasless transactions
4. User can mint NFTs, claim tokens, and send ETH - all gasless

### The Magic Behind Gasless Transactions
Instead of regular transactions, everything uses UserOperations. ZeroDev's paymaster picks up the gas tab, so users never see gas fees. This is the core value prop for Jeff's team.

## Key Components

**Dashboard**: Main interface with wallet connection and balances

**NFT Minting**: Free ERC721 minting with real blockchain transactions

**Token Claiming**: DUSD token distribution (100 tokens per claim)

**Send Money**: ETH transfers between addresses

**Transaction History**: Real-time tracking with block explorer links

**Security Features**: MFA setup with passkeys and authenticator apps

## Multi-Chain Setup

I deployed the same contracts on both Base Sepolia and Ethereum Sepolia. The app automatically detects the current network and uses the right contract addresses. This addresses Jeff's concern about supporting multiple chains.

