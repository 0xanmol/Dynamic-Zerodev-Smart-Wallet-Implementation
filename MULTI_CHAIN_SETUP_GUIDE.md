# Multi-Chain Setup Guide: Adding Ethereum Sepolia

## Current Setup Analysis
Your current setup only supports Base Sepolia (chain ID: 84532). To add Ethereum Sepolia (chain ID: 11155111), you'll need to make several configuration changes.

## Step-by-Step Implementation Plan

### 1. Dynamic Dashboard Configuration

#### Enable Ethereum Sepolia in Dynamic
1. Go to your Dynamic Dashboard
2. Navigate to **Embedded Wallets** → **Chains**
3. Enable **Ethereum Sepolia** (Chain ID: 11155111)
4. Note: You'll need to add this to your existing environment

#### Add ZeroDev Project for Ethereum Sepolia
1. In Dynamic Dashboard, go to **Smart Wallets** → **ZeroDev**
2. Add a new ZeroDev project ID for Ethereum Sepolia
3. This will be different from your Base Sepolia project ID

### 2. ZeroDev Dashboard Setup

#### Create New ZeroDev Project
1. Go to [ZeroDev Dashboard](https://dashboard.zerodev.app)
2. Create a new project for **Ethereum Sepolia**
3. Configure the project settings:
   - Network: Ethereum Sepolia
   - Chain ID: 11155111
   - RPC URL: `https://sepolia.infura.io/v3/YOUR_INFURA_KEY` or `https://ethereum-sepolia.publicnode.com`

#### Deploy and Fund Paymaster
1. Deploy a new paymaster for Ethereum Sepolia
2. Fund it with Sepolia ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))
3. Note the paymaster address for configuration

### 3. Code Changes Required

#### Update Constants
```typescript
// constants.ts
export const CONTRACTS = {
  "84532": { // Base Sepolia
    USD: "0x678d798938bd326d76e5db814457841d055560d0",
    NFT: "0x275068e0610DefC70459cA40d45C95e3DCF50A10",
  },
  "11155111": { // Ethereum Sepolia
    USD: "0x...", // Deploy new USD token contract
    NFT: "0x...", // Deploy new NFT contract
  },
} as const;
```

#### Deploy Contracts on Ethereum Sepolia
You'll need to deploy new instances of:
1. **USD Token Contract** - Same as your Base Sepolia USD contract
2. **NFT Contract** - Same as your Base Sepolia NFT contract

#### Update Network Detection
```typescript
// components/network-indicator.tsx
const getNetworkInfo = (chainId: number) => {
  switch (chainId) {
    case 84532:
      return { name: "Base Sepolia", explorer: "https://sepolia.basescan.org" };
    case 11155111:
      return { name: "Ethereum Sepolia", explorer: "https://sepolia.etherscan.io" };
    default:
      return { name: "Unknown Network", explorer: "" };
  }
};
```

#### Update RPC Clients
```typescript
// components/balances-panel.tsx
const getRpcUrl = (chainId: number) => {
  switch (chainId) {
    case 84532:
      return "https://sepolia.base.org";
    case 11155111:
      return "https://ethereum-sepolia.publicnode.com";
    default:
      return "";
  }
};
```

### 4. Environment Variables

Add to your `.env.local`:
```bash
# Existing
NEXT_PUBLIC_DYNAMIC_ENV_ID=your_dynamic_env_id

# New for Ethereum Sepolia
NEXT_PUBLIC_ZERODEV_PROJECT_ID_ETH_SEPOLIA=your_eth_sepolia_project_id
NEXT_PUBLIC_INFURA_KEY=your_infura_key  # Optional, for better RPC
```

### 5. ZeroDev Configuration

#### Update ZeroDev Connectors
```typescript
// lib/providers.tsx
import { ZeroDevSmartWalletConnectors } from "@/lib/dynamic";

// The ZeroDevSmartWalletConnectors should automatically detect
// the project IDs from environment variables
```

#### Environment Variable Naming Convention
ZeroDev expects environment variables in this format:
- `NEXT_PUBLIC_ZERODEV_PROJECT_ID_84532` (Base Sepolia)
- `NEXT_PUBLIC_ZERODEV_PROJECT_ID_11155111` (Ethereum Sepolia)

### 6. UI Updates

#### Add Chain Selector
```typescript
// components/chain-selector.tsx
const supportedChains = [
  { id: 84532, name: "Base Sepolia", icon: "🔵" },
  { id: 11155111, name: "Ethereum Sepolia", icon: "🔷" },
];
```

#### Update Transaction History
```typescript
// components/transaction-history.tsx
const getExplorerUrl = (chainId: number, txHash: string) => {
  switch (chainId) {
    case 84532:
      return `https://sepolia.basescan.org/tx/${txHash}`;
    case 11155111:
      return `https://sepolia.etherscan.io/tx/${txHash}`;
    default:
      return "";
  }
};
```

### 7. Testing Checklist

- [ ] Dynamic Dashboard shows both chains enabled
- [ ] ZeroDev projects created for both chains
- [ ] Paymasters deployed and funded on both chains
- [ ] Contracts deployed on Ethereum Sepolia
- [ ] Chain switching works in UI
- [ ] Gasless transactions work on both chains
- [ ] Balance fetching works on both chains
- [ ] Transaction history shows correct explorer links

### 8. Common Issues & Solutions

#### Issue: "Chain not supported"
- **Solution**: Ensure chain is enabled in Dynamic Dashboard and ZeroDev project exists

#### Issue: "Paymaster not found"
- **Solution**: Verify paymaster is deployed and funded on the target chain

#### Issue: "Contract not found"
- **Solution**: Deploy contracts on the new chain and update constants.ts

#### Issue: "RPC errors"
- **Solution**: Use reliable RPC providers (Infura, Alchemy, or public nodes)

### 9. Cost Considerations

- **Contract Deployment**: ~0.01-0.02 ETH per contract on Ethereum Sepolia
- **Paymaster Funding**: ~0.1-0.5 ETH for testing (refundable)
- **Gas Costs**: Ethereum Sepolia gas is higher than Base Sepolia

### 10. Next Steps After Implementation

1. **Test thoroughly** on both chains
2. **Update documentation** with multi-chain instructions
3. **Consider adding more chains** (Polygon, Arbitrum, etc.)
4. **Implement chain-specific features** if needed
5. **Monitor paymaster balances** on both chains

## Summary

Adding Ethereum Sepolia requires:
1. ✅ Dynamic Dashboard configuration (enable chain)
2. ✅ ZeroDev project creation and paymaster deployment
3. ✅ Contract deployment on new chain
4. ✅ Code updates for multi-chain support
5. ✅ UI updates for chain selection
6. ✅ Testing and validation

The most time-consuming part will be deploying and funding the contracts on Ethereum Sepolia, but the code changes are relatively straightforward.
