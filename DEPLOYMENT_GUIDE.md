# NFT Contract Deployment Guide

## ✅ Contract Successfully Deployed!

**Contract Address**: `0x275068e0610DefC70459cA40d45C95e3DCF50A10`  
**Network**: Base Sepolia  
**Status**: Live and ready for free minting

## Deployment Steps (Completed)

### 1. Deploy Using Remix IDE (Recommended)

1. **Go to Remix**: Visit [remix.ethereum.org](https://remix.ethereum.org)

2. **Create New File**: 
   - Create a new file called `SimpleNFT.sol`
   - Copy the contract code from `contracts/SimpleNFT.sol`

3. **Compile Contract**:
   - Select Solidity compiler version 0.8.19
   - Click "Compile SimpleNFT.sol"

4. **Deploy to Base Sepolia**:
   - Go to "Deploy & Run Transactions" tab
   - Select "Injected Provider" (MetaMask)
   - Make sure you're on Base Sepolia network
   - Click "Deploy" button
   - Confirm transaction in MetaMask

5. **Copy Contract Address**:
   - After deployment, copy the contract address
   - Update `NFT_CONTRACT_ADDRESS` in `components/nft-minting.tsx`

### 2. Alternative: Use Base Sepolia Faucet

1. **Get Test ETH**: Visit [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. **Connect Wallet**: Connect your wallet and request test ETH
3. **Deploy Contract**: Use Remix or your preferred deployment method

### 3. Update Frontend

After deployment, update the contract address:

```typescript
// In components/nft-minting.tsx
const NFT_CONTRACT_ADDRESS = "0xYourDeployedContractAddress"; // Replace with actual address
```

## Contract Features

The `SimpleNFT.sol` contract includes:

- **Minting**: `mint(address to)` - Mints NFT to specified address
- **Price**: `mintPrice()` - Returns mint price (0.001 ETH)
- **Balance**: `balanceOf(address owner)` - Returns NFT balance
- **Supply**: `totalSupply()` - Returns total minted NFTs
- **Withdraw**: `withdraw()` - Owner can withdraw contract balance

## Testing

Once deployed:

1. **Connect Wallet**: Use Dynamic embedded wallet
2. **Check Price**: Should show 0.001 ETH mint price
3. **Mint NFT**: Click "Mint NFT" button
4. **Verify**: Check transaction on [BaseScan](https://sepolia.basescan.org)

## Gas Sponsorship

The NFT minting will be sponsored by ZeroDev paymaster, so users won't pay gas fees for the transaction (only the 0.001 ETH mint price).
