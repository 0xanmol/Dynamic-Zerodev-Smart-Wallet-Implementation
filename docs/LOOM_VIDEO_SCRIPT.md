# Loom Video Script - Dynamic Demo Walkthrough

## Video Structure (5-7 minutes)

### Introduction (30 seconds)
"Hey Jeff! I'm [Name], and I've built a demo that tackles all the issues your team raised about Dynamic's embedded wallet tech. It's been a journey - I'll be honest, I ran into some real challenges along the way, but I think the end result shows what's possible. Let me walk you through what I built."

### Demo Overview (1 minute)
"Here's what I built - a dashboard that shows Dynamic's embedded wallet capabilities. You can see we have three main tabs: Wallet functionality, How It Works explanations, and Security features. Let me show you each one."

### Wallet Functionality Demo (2 minutes)
"Let's start with the wallet functionality. First, I'll connect using Dynamic's embedded wallet - notice how I just sign in with email, no seed phrases or private key management needed.

Now I can see my balances - ETH, DUSD tokens, NFT count, and gasless transaction history. Let me mint some DUSD tokens - completely free, no gas fees. The transaction goes through instantly because ZeroDev's paymaster picks up the gas tab.

Now let me send some ETH to another address - again, completely gasless. You can see the transaction appears in the history with a link to BaseScan for verification.

Finally, let me mint an NFT - this is a real blockchain transaction, completely free for the user."

### How It Works Explanation (1.5 minutes)
"Now let me show you the 'How It Works' tab. This addresses your team's concern about understanding Account Abstraction. Here's the step-by-step flow:

1. User initiates a transaction
2. Dynamic SDK creates a UserOperation
3. ZeroDev paymaster sponsors the gas fees
4. Transaction executes on the blockchain
5. User sees success without paying gas

The technical implementation shows our smart wallet stack: Dynamic SDK for authentication, ZeroDev for Account Abstraction infrastructure, Base Sepolia for testing, and EntryPoint v7 as the standard.

This is the key benefit - your users never have to understand gas fees or manage private keys."

### Security Features Demo (1.5 minutes)
"Finally, let's look at the Security tab. This addresses your team's need to see MFA and security features in action.

You can see the security dashboard showing all active features: wallet connection, smart wallet status, social recovery, and MFA capabilities. Users can add additional security methods like passkeys or authenticator apps.

The social recovery feature means users can recover their accounts through email verification - no seed phrases needed. This is enterprise-grade security with Web2-like user experience."

### Technical Implementation (1 minute)
"From a technical perspective, this is built with Next.js, React, and TypeScript. The Dynamic SDK handles all the wallet complexity, while ZeroDev provides the Account Abstraction infrastructure.

The smart contracts are deployed on Base Sepolia, and all transactions are real blockchain transactions - you can verify them on BaseScan. The key insight is that we're using ZeroDev's sendUserOperation method for gasless transactions, not regular sendTransaction."

### Conclusion (30 seconds)
"This demo tackles all four issues your team raised: NFT minting with embedded wallets, clear Account Abstraction explanations, MFA and security features, and intuitive money sending functionality.

The code is production-ready and includes comprehensive documentation. Your team can test this immediately and see how Dynamic can solve your enterprise Web3 challenges.

Let me know when you'd like to schedule a deeper technical discussion!"

## Key Points to Emphasize

1. **Real blockchain transactions** - not just UI mockups
2. **Gasless user experience** - ZeroDev paymaster sponsorship
3. **Enterprise security** - MFA, social recovery, smart contracts
4. **Production-ready code** - comprehensive error handling and documentation
5. **Easy integration** - Dynamic SDK handles complexity

## Technical Details to Mention

- ZeroDev v1 dashboard issues (current limitation)
- User operation vs transaction hash handling
- Multi-chain support capability
- Smart contract deployment process
- Error handling and user feedback

## Call to Action

- Schedule technical walkthrough
- Review code and architecture
- Plan integration with existing systems
- Discuss customization needs for production
