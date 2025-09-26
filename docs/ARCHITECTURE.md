# System Architecture & Technical Design

## Overview

This demo implements a complete Web3 application using Dynamic's embedded wallet technology with ZeroDev Account Abstraction. The architecture is designed to showcase enterprise-grade features while maintaining simplicity and ease of use.

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

#### State Management
- **React Hooks**: useState, useEffect, useCallback for local state
- **Dynamic Context**: useDynamicContext for wallet state
- **localStorage**: Persistence for NFT counts and transaction history
- **Custom Hooks**: useMintTokens, useShadowDom for reusable logic

### Smart Contract Layer

#### Contract Architecture
```
Smart Contracts/
├── FinalNFT.sol          # ERC721 NFT contract
├── DUSDToken.sol         # ERC20 token contract
└── (Deployed on both Base Sepolia and Ethereum Sepolia)
```

#### Contract Features
- **FinalNFT**: Free minting, 1000 max supply, Picsum image integration
- **DUSDToken**: 18 decimals (Ethereum), 6 decimals (Base Sepolia)
- **Standard Compliance**: ERC721 and ERC20 standards
- **Gas Optimization**: Efficient contract execution

### Integration Layer

#### Dynamic SDK Integration
```typescript
// Dynamic provider configuration
<DynamicContextProvider
  settings={{
    environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID,
    walletConnectors: [ZeroDevConnector],
    eventsCallbacks: {
      onAuthSuccess: handleAuthSuccess,
      onAuthFailure: handleAuthFailure,
    },
  }}
>
```

#### ZeroDev Integration
```typescript
// ZeroDev kernel client setup
const kernelClient = createEcdsaKernelAccountClientWith7702({
  account: kernelAccount,
  entryPoint: getEntryPoint(chainId),
  bundlerTransport: http(getBundlerRpcUrl(chainId)),
  middleware: {
    sponsorUserOperation: async ({ userOperation }) => {
      return {
        paymasterAndData: "0x",
        preVerificationGas: 0n,
        verificationGasLimit: 0n,
        callGasLimit: 0n,
      };
    },
  },
});
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

### Balance Fetching Flow
```
1. Component mounts and wallet connects
2. Frontend creates separate public client
3. Calls smart contract balanceOf functions
4. Formats balances with correct decimals
5. Updates UI with real-time data
6. Caches results in localStorage
```

## Security Architecture

### Authentication Security
- **Email/Social Login**: Standard OAuth flows
- **Embedded Wallets**: No private key exposure
- **Smart Account Security**: Contract-based security rules
- **Session Management**: Secure token handling

### Transaction Security
- **User Operation Validation**: ZeroDev validates all operations
- **Paymaster Policies**: Configurable sponsorship rules
- **Gas Limit Protection**: Prevents excessive gas usage
- **Address Validation**: Input sanitization and validation

### Smart Contract Security
- **Access Controls**: Proper ownership management
- **Input Validation**: All parameters validated
- **Reentrancy Protection**: Standard security patterns
- **Gas Optimization**: Efficient execution

## Multi-Chain Architecture

### Network Support
```typescript
export const CONTRACTS = {
  "84532": { // Base Sepolia
    USD: "0x678d798938bd326d76e5db814457841d055560d0",
    NFT: "0xCea441b6fB0695fC1DADC79Dd9A59Cf6a619f49f",
  },
  "11155111": { // Ethereum Sepolia
    USD: "0x1F7daF8B1989A949c5f2d70340C234eF63aEE6F5",
    NFT: "0xC949C74C0644B4ED7b9bBCF4560A46e01E3B8B5d",
  },
};
```

### Chain-Specific Logic
- **Contract Addresses**: Different addresses per chain
- **RPC Endpoints**: Chain-specific RPC URLs
- **Explorer URLs**: Different block explorers
- **Token Decimals**: Chain-specific decimal handling

## Performance Architecture

### Optimization Strategies
- **Lazy Loading**: Components loaded on demand
- **Memoization**: useCallback for expensive operations
- **Caching**: localStorage for persistent data
- **Parallel Requests**: Multiple balance fetches simultaneously

### Error Handling Architecture
```
Error Boundary
├── Network Errors (RPC failures)
├── Contract Errors (transaction failures)
├── User Errors (insufficient balance)
└── System Errors (wallet connection issues)
```

## Scalability Considerations

### Horizontal Scaling
- **Stateless Frontend**: No server-side state
- **CDN Distribution**: Static asset delivery
- **Load Balancing**: Multiple RPC endpoints
- **Caching Strategy**: Client-side and CDN caching

### Vertical Scaling
- **Component Optimization**: Efficient React patterns
- **Bundle Optimization**: Code splitting and tree shaking
- **Image Optimization**: Next.js image optimization
- **API Optimization**: Efficient contract calls

## Monitoring & Observability

### Application Monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Monitoring**: Transaction success rates
- **User Analytics**: Usage patterns and conversion
- **Health Checks**: System status monitoring

### Blockchain Monitoring
- **Transaction Tracking**: Real-time transaction status
- **Balance Monitoring**: Wallet balance changes
- **Contract Events**: Smart contract event logging
- **Network Status**: Blockchain network health

## Development Architecture

### Code Organization
```
src/
├── app/                  # Next.js app directory
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   └── [feature].tsx    # Feature-specific components
├── lib/                 # Utilities and configurations
│   ├── dynamic.ts       # Dynamic SDK setup
│   ├── providers.tsx    # React providers
│   └── utils.ts         # Utility functions
├── constants.ts         # Application constants
└── types/               # TypeScript type definitions
```

### Build Architecture
- **Next.js Build**: Optimized production builds
- **TypeScript Compilation**: Type checking and compilation
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint/Prettier**: Code quality and formatting

## Deployment Architecture

### Environment Configuration
```typescript
// Environment-specific settings
const config = {
  development: {
    dynamicEnvId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID,
    rpcUrl: "https://sepolia.base.org",
    explorerUrl: "https://sepolia.basescan.org",
  },
  production: {
    dynamicEnvId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID,
    rpcUrl: "https://mainnet.base.org",
    explorerUrl: "https://basescan.org",
  },
};
```

### CI/CD Pipeline
```
1. Code Commit → GitHub
2. Automated Testing → Jest/Playwright
3. Build Process → Next.js Build
4. Deployment → Vercel/Netlify
5. Health Check → Application Monitoring
```

## Future Architecture Considerations

### Planned Enhancements
- **Microservices**: Backend service separation
- **Database Integration**: User data persistence
- **Advanced Analytics**: User behavior tracking
- **Multi-tenant Support**: Enterprise customer isolation

### Technical Debt
- **ZeroDev v2 Migration**: When Dynamic updates
- **Hardhat Integration**: Proper development environment
- **Automated Testing**: Comprehensive test coverage
- **Documentation**: API documentation generation

## Security Considerations

### Threat Model
- **Frontend Attacks**: XSS, CSRF protection
- **Smart Contract Attacks**: Reentrancy, overflow protection
- **Network Attacks**: RPC endpoint security
- **User Attacks**: Phishing, social engineering

### Mitigation Strategies
- **Input Validation**: All user inputs sanitized
- **Error Handling**: No sensitive information exposure
- **Access Controls**: Proper permission management
- **Monitoring**: Real-time threat detection

This architecture provides a solid foundation for enterprise Web3 applications while maintaining the simplicity and user experience that makes Dynamic's embedded wallet technology compelling.
