# Complete Setup Guide

## Prerequisites

### Required Accounts & Services
- **Dynamic Account**: [app.dynamic.xyz](https://app.dynamic.xyz)
- **ZeroDev Account**: [dashboard.zerodev.app](https://dashboard.zerodev.app)
- **Base Sepolia ETH**: [Coinbase Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
- **Node.js**: Version 18 or higher
- **Git**: For cloning the repository

### Development Environment
- **Code Editor**: VS Code (recommended)
- **Browser**: Chrome or Firefox with developer tools
- **Terminal**: Command line access

## Step 1: Dynamic Dashboard Setup

### 1.1 Create Dynamic Environment
1. Go to [app.dynamic.xyz](https://app.dynamic.xyz)
2. Sign up or log in to your account
3. Click "Create Environment"
4. Choose "Development" environment
5. Name it "Gasless Demo" (or your preferred name)

### 1.2 Configure Authentication
1. In your environment, go to "Authentication"
2. Enable "Email" authentication
3. Optionally enable "Google" or "GitHub" for social login
4. Save the configuration

### 1.3 Set Up ZeroDev Integration
1. Go to "Smart Wallets" in your Dynamic environment
2. Click "Add Smart Wallet"
3. Select "ZeroDev"
4. Choose "EntryPoint v7"
5. Note down your ZeroDev Project ID

### 1.4 Configure Networks
1. In "Networks", add "Base Sepolia"
2. Chain ID: `84532`
3. RPC URL: `https://sepolia.base.org`
4. Enable "Auto-deploy smart wallets"
5. Save the configuration

### 1.5 Set Allowed Origins
1. Go to "Settings" → "Allowed Origins"
2. Add: `http://localhost:3000`
3. Add: `http://localhost:3001` (backup port)
4. Save the configuration

## Step 2: ZeroDev Dashboard Setup

### 2.1 Create ZeroDev Project
1. Go to [dashboard.zerodev.app](https://dashboard.zerodev.app)
2. Sign up or log in
3. Click "Create Project"
4. Name it "Dynamic Demo"
5. Select "EntryPoint v7"

### 2.2 Configure Networks
1. In your project, go to "Networks"
2. Add "Base Sepolia"
3. Chain ID: `84532`
4. RPC URL: `https://sepolia.base.org`
5. Save the configuration

### 2.3 Set Up Paymaster
1. Go to "Paymaster" in your ZeroDev project
2. Click "Create Paymaster"
3. Choose "ERC20 Paymaster" (for token sponsorship)
4. Configure sponsorship policy:
   - Max gas per user operation: `1000000`
   - Max gas per call: `500000`
   - Max fee per gas: `1000000000` (1 gwei)
5. Fund the paymaster with Base Sepolia ETH

### 2.4 Get Project ID
1. In your ZeroDev project, go to "Settings"
2. Copy your "Project ID"
3. This will be used in the Dynamic integration

## Step 3: Smart Contract Deployment

### 3.1 Deploy NFT Contract
1. Go to [Remix IDE](https://remix.ethereum.org)
2. Create a new file: `FinalNFT.sol`
3. Copy the contract code from `contracts/FinalNFT.sol`
4. Compile the contract
5. Deploy to Base Sepolia:
   - Network: Base Sepolia
   - Account: Your funded account
   - Constructor parameters: None
6. Copy the deployed contract address

### 3.2 Deploy DUSD Token Contract
1. In Remix, create a new file: `DUSDToken.sol`
2. Copy the contract code from `contracts/DUSDToken.sol`
3. Compile the contract
4. Deploy to Base Sepolia:
   - Network: Base Sepolia
   - Account: Your funded account
   - Constructor parameters: None
5. Copy the deployed contract address

### 3.3 Update Contract Addresses
1. Open `constants.ts` in your project
2. Update the contract addresses:
   ```typescript
   export const CONTRACTS = {
     "84532": { // Base Sepolia
       USD: "YOUR_DUSD_CONTRACT_ADDRESS",
       NFT: "YOUR_NFT_CONTRACT_ADDRESS",
     },
   };
   ```

## Step 4: Local Development Setup

### 4.1 Clone Repository
```bash
git clone <repository-url>
cd nextjs-evm-gasless-zerodev
```

### 4.2 Install Dependencies
```bash
npm install
```

### 4.3 Environment Configuration
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_DYNAMIC_ENV_ID=your-dynamic-environment-id
```

### 4.4 Start Development Server
```bash
npm run dev
```

### 4.5 Open Application
Navigate to [http://localhost:3000](http://localhost:3000)

## Step 5: Testing the Demo

### 5.1 Wallet Connection
1. Click "Connect Wallet" in the top right
2. Sign in with email or social login
3. Verify wallet connection in the Network Status card

### 5.2 Test Token Operations
1. Go to "Wallet" tab
2. Click "Claim 100 DUSD" - should be gasless
3. Verify balance updates in "Demo Assets"
4. Test "Send Money" functionality

### 5.3 Test NFT Minting
1. Click "Mint Free NFT" in the NFT Minting card
2. Verify transaction appears in history
3. Check BaseScan for transaction confirmation

### 5.4 Test Security Features
1. Go to "Security" tab
2. Explore MFA options
3. Review security dashboard

## Troubleshooting

### Common Issues

#### CORS Errors
- **Problem**: "CORS policy" errors in browser console
- **Solution**: Add your domain to Dynamic Dashboard allowed origins

#### Transaction Not Found
- **Problem**: Transaction hash not found on BaseScan
- **Solution**: Ensure you're using the real transaction hash from user operation receipt

#### Wallet Connection Issues
- **Problem**: Wallet not connecting
- **Solution**: 
  - Verify Dynamic environment ID
  - Check ZeroDev integration
  - Ensure Base Sepolia is enabled

#### Balance Loading Errors
- **Problem**: Balances showing as 0 or loading forever
- **Solution**: 
  - Wait for wallet initialization (1-2 seconds)
  - Check contract addresses in constants.ts
  - Verify RPC endpoints

#### Paymaster Errors
- **Problem**: "Paymaster not found" or gas sponsorship failures
- **Solution**:
  - Check ZeroDev paymaster balance
  - Verify paymaster configuration
  - Ensure sponsorship policies are correct

### Debug Mode
Enable debug logging by adding to `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

### Network Issues
If Base Sepolia is slow:
- Try alternative RPC: `https://base-sepolia.g.alchemy.com/v2/YOUR_KEY`
- Check network status: [Base Status](https://status.base.org)

## Production Deployment

### Environment Variables
```env
NEXT_PUBLIC_DYNAMIC_ENV_ID=your-production-environment-id
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Domain Configuration
1. Add production domain to Dynamic allowed origins
2. Update CORS settings
3. Configure SSL certificates

### Monitoring Setup
1. Set up error tracking (Sentry, LogRocket)
2. Configure performance monitoring
3. Set up transaction success rate tracking

## Support Resources

### Documentation
- [Dynamic Docs](https://docs.dynamic.xyz)
- [ZeroDev Docs](https://docs.zerodev.app)
- [Base Network Docs](https://docs.base.org)

### Community Support
- [Dynamic Discord](https://discord.gg/dynamic)
- [ZeroDev Discord](https://discord.gg/zerodev)
- [Base Discord](https://discord.gg/buildonbase)

### Technical Support
- Dynamic: [support@dynamic.xyz](mailto:support@dynamic.xyz)
- ZeroDev: [support@zerodev.app](mailto:support@zerodev.app)

## Next Steps

### For Development
1. Customize smart contracts for your use case
2. Add additional networks
3. Implement custom authentication flows
4. Add advanced security features

### For Production
1. Set up monitoring and alerting
2. Implement user analytics
3. Add compliance features
4. Plan scaling strategy

### For Enterprise
1. Contact Dynamic sales for enterprise features
2. Discuss custom integrations
3. Plan security audit
4. Design user onboarding flow
