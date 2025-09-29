# Loom Video Script - Dynamic Demo Walkthrough

## Video Structure (8-9 minutes)

### Introduction (30 seconds)
"Hey Jeff! I'm [Name], and I've built a comprehensive demo that tackles all the issues your team raised about Dynamic's embedded wallet tech. This isn't just a UI mockup - it's a fully functional application with real blockchain transactions. Let me walk you through what I built."

### Demo Overview (45 seconds)
"Here's what I built - a complete dashboard with three main sections: Wallet functionality, How It Works explanations, and Security features. The key differentiator is that every transaction you'll see is a real blockchain transaction, completely gasless for the user thanks to ZeroDev's paymaster infrastructure.

Notice the clean, professional UI - no emojis, enterprise-ready design. Let me show you each section in detail."

### Wallet Functionality Demo (3 minutes)

#### Part 1: Connection & Balances (45 seconds)
"First, let me connect using Dynamic's embedded wallet. I'll sign in with email - no seed phrases, no private key management needed. 

Now I can see my real-time balances: ETH, DUSD tokens, NFT count, and gasless transaction history. Everything updates automatically as I perform actions."

#### Part 2: Multi-Chain Demonstration (1.5 minutes)
"Here's something important - this demo works on both Base Sepolia and Ethereum Sepolia. Let me show you by switching networks.

[Switch to Base Sepolia]
On Base Sepolia, I can claim 100 DUSD tokens completely gasless. Watch the transaction go through - it's instant because ZeroDev's paymaster picks up the gas tab.

[Switch to Ethereum Sepolia] 
Now on Ethereum Sepolia, I can do the same thing. Notice how the UI adapts to the different chain - different contract addresses, different explorer links, but the same seamless experience.

Let me show you the block explorer to prove these are real transactions. [Open BaseScan/Etherscan] You can see the actual transaction hash, the gas fees paid by the paymaster, and the smart contract interactions."

#### Part 3: NFT Minting & ETH Transfer (1 minute)
"Now let me mint an NFT - this is a real ERC721 transaction, completely free for the user. The NFT gets minted to my wallet address.

Finally, let me send some ETH to another address. Again, completely gasless. You can see the transaction appears in the history with the correct block explorer link for the current chain."

### How It Works Explanation (1.5 minutes)
"Now let me show you the 'How It Works' tab. This addresses your team's concern about understanding Account Abstraction.

Here's the step-by-step flow:
1. User initiates a transaction through our UI
2. Dynamic SDK creates a UserOperation (not a regular transaction)
3. ZeroDev paymaster sponsors the gas fees
4. The UserOperation gets bundled and executed on the blockchain
5. User sees success without ever touching gas fees

The technical implementation shows our complete stack: Dynamic SDK for authentication and wallet management, ZeroDev for Account Abstraction infrastructure, smart contracts deployed on both testnets, and EntryPoint v7 as the standard.

This is the key benefit - your users get Web3 functionality with Web2 user experience."

### Security Features Demo (1.5 minutes)
"Finally, let's look at the Security tab. This addresses your team's need to see enterprise-grade security features.

You can see the security dashboard showing all active features: wallet connection status, smart wallet capabilities, and MFA options. Users can add additional security methods like passkeys or authenticator apps.

The passkey registration works with biometric authentication - Face ID, Touch ID, or Windows Hello. The social recovery feature means users can recover their accounts through email verification - no seed phrases needed.

This is enterprise-grade security with consumer-friendly UX."

### Technical Implementation & Block Explorer Proof (1 minute)
"From a technical perspective, this is built with Next.js, React, and TypeScript. The Dynamic SDK handles all the wallet complexity, while ZeroDev provides the Account Abstraction infrastructure.

Let me show you the block explorer again to prove these are real transactions. [Open transaction on BaseScan/Etherscan] You can see:
- The actual transaction hash
- Gas fees paid by the paymaster (not the user)
- Smart contract interactions
- Transaction status and confirmations

The key insight is that we're using ZeroDev's sendUserOperation method for gasless transactions, not regular sendTransaction. This is what makes the magic happen."

### Conclusion (30 seconds)
"This demo tackles all four issues your team raised: NFT minting with embedded wallets, clear Account Abstraction explanations, comprehensive MFA and security features, and intuitive money sending functionality.

The code is production-ready, includes comprehensive documentation, and works across multiple chains. Your team can test this immediately and see how Dynamic can solve your enterprise Web3 challenges.

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
