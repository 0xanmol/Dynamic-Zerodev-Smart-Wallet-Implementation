# Dynamic + ZeroDev Smart Wallet Implementation

**Repository**: [https://github.com/0xanmol/Dynamic-Zerodev-Smart-Wallet-Implementation](https://github.com/0xanmol/Dynamic-Zerodev-Smart-Wallet-Implementation)

Built this to show how Dynamic's embedded wallets work with ZeroDev Account Abstraction for gasless transactions on Base Sepolia and Ethereum Sepolia.

## Features

Addresses all the concerns Jeff's team raised:

1. **NFT Minting with Embedded Wallets** - Complete gasless NFT minting functionality
2. **Multi-chain Support** - Works on Base Sepolia and Ethereum Sepolia (expandable to all Dynamic-supported chains)
3. **Account Abstraction Explained** - Clear explanation of how gas fees are handled
4. **Enhanced Security Features** - MFA, passkeys, and social recovery options
5. **Clear Money Transfer** - Simple, intuitive interface for sending ETH between users

### Technical Implementation
- **Dynamic Embedded Wallets**: Seamless wallet connection and management
- **ZeroDev Account Abstraction**: Gasless transactions with sponsored gas fees
- **NFT Minting**: Free NFT minting with real blockchain transactions
- **Token Operations**: Claim DUSD tokens and send money
- **Real-time Balance Tracking**: Live balance updates and transaction history
- **Modern UI**: Clean, responsive interface with dark/light theme support

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Blockchain**: Dynamic SDK, ZeroDev, Viem
- **Network**: Base Sepolia testnet
- **Smart Contracts**: Solidity (ERC721 NFT contract)

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Base Sepolia ETH (for testing)
- Dynamic account with ZeroDev integration

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/0xanmol/Dynamic-Zerodev-Smart-Wallet-Implementation.git
   cd Dynamic-Zerodev-Smart-Wallet-Implementation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Dynamic environment ID:
   ```env
   NEXT_PUBLIC_DYNAMIC_ENV_ID=your-environment-id-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Features

### Wallet Connection
- Connect using Dynamic's embedded wallet
- Automatic smart account deployment via ZeroDev
- Seamless user experience with no gas fees

### NFT Minting
- **Contract**: FreeNFT deployed on Base Sepolia
- **Address**: `0x275068e0610DefC70459cA40d45C95e3DCF50A10`
- **Features**: Free minting, gasless transactions
- **Verification**: Real transactions on [BaseScan](https://sepolia.basescan.org)

### Token Operations
- **Claim USDC**: Mint test USDC tokens (100 tokens)
- **Send Money**: Transfer tokens between addresses
- **Balance Tracking**: Real-time balance updates

### Transaction History
- Live transaction tracking
- BaseScan integration for verification
- Success/failure status indicators

## Architecture

### Smart Contracts
- **FreeNFT.sol**: ERC721 NFT contract for free minting
- **Deployed on**: Base Sepolia testnet
- **Features**: Free minting, 1000 max supply

### Frontend Components
- **Dashboard**: Main interface with tabbed navigation
- **NetworkIndicator**: Shows current network and connection status
- **BalancesPanel**: Displays wallet balances
- **NFTMinting**: NFT minting interface with real blockchain integration
- **TransactionHistory**: Live transaction tracking

### ZeroDev Integration
- **Account Abstraction**: Smart wallet implementation
- **Gasless Transactions**: Sponsored gas fees
- **User Operations**: Proper handling of user operation receipts
- **Real Transaction Hashes**: Extraction from user operation receipts

## Configuration

### Dynamic Dashboard Setup
1. Create a Dynamic account at [app.dynamic.xyz](https://app.dynamic.xyz)
2. Set up your environment with ZeroDev integration
3. Enable Base Sepolia (Chain ID: 84532)
4. Configure auto-deploy for smart accounts
5. Add your domain to allowed origins

### ZeroDev Configuration
1. Set up ZeroDev project at [dashboard.zerodev.app](https://dashboard.zerodev.app)
2. Enable Base Sepolia network
3. Configure paymaster with sufficient balance
4. Set up sponsorship policies

## Project Structure

```
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── dashboard.tsx      # Main dashboard
│   ├── nft-minting.tsx    # NFT minting component
│   ├── balances-panel.tsx # Balance display
│   └── ui/                # shadcn/ui components
├── contracts/             # Smart contracts
│   └── FreeNFT.sol        # NFT contract
├── lib/                   # Utilities and configurations
│   ├── dynamic.ts         # Dynamic SDK setup
│   └── providers.tsx      # React providers
└── public/                # Static assets
```

## Testing

### Manual Testing
1. **Connect Wallet**: Test wallet connection flow
2. **Claim Tokens**: Verify USDC token minting
3. **Mint NFT**: Test NFT minting with real blockchain transactions
4. **Send Money**: Test token transfers
5. **Check BaseScan**: Verify transactions on blockchain explorer

### Transaction Verification
- All transactions appear on [Base Sepolia BaseScan](https://sepolia.basescan.org)
- Real transaction hashes are extracted from ZeroDev user operations
- Gas fees are sponsored by ZeroDev paymaster

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Add your domain to Dynamic dashboard allowed origins
   - Include both `http://localhost:3000` and `http://localhost:3001`

2. **Transaction Not Found on BaseScan**
   - Ensure you're using the real transaction hash from user operation receipt
   - Check ZeroDev paymaster balance and configuration

3. **Wallet Connection Issues**
   - Verify Dynamic environment ID is correct
   - Check ZeroDev integration in Dynamic dashboard
   - Ensure Base Sepolia is enabled

4. **Balance Loading Errors**
   - These are normal during initial connection
   - Balances will load once wallet is fully connected

## Resources

- [Dynamic Documentation](https://docs.dynamic.xyz)
- [ZeroDev Documentation](https://docs.zerodev.app)
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
- [BaseScan Explorer](https://sepolia.basescan.org)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Success Metrics

- Gasless transactions via ZeroDev sponsorship
- Working NFT minting with contract interaction
- Live transaction tracking and verification

---

**Built with Dynamic + ZeroDev + Next.js**