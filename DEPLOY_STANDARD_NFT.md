# Deploy Standard ERC721 NFT Contract

## Contract Details
- **Name**: StandardNFT
- **Symbol**: DDNFT
- **Features**: 
  - Free minting (mintPrice = 0)
  - Standard ERC721 functions (balanceOf, ownerOf, etc.)
  - Metadata support
  - Owner controls

## Deployment Instructions

### 1. Deploy on Base Sepolia

1. Go to [Remix IDE](https://remix.ethereum.org)
2. Create a new file called `StandardNFT.sol`
3. Copy the contract code from `contracts/StandardNFT.sol`
4. Compile the contract (Solidity 0.8.19+)
5. Deploy to Base Sepolia:
   - **Network**: Base Sepolia
   - **RPC**: https://sepolia.base.org
   - **Chain ID**: 84532
6. **No constructor parameters needed** - just deploy
7. Copy the deployed contract address

### 2. Deploy on Ethereum Sepolia

1. Use the same contract code
2. Deploy to Ethereum Sepolia:
   - **Network**: Ethereum Sepolia
   - **RPC**: https://ethereum-sepolia.publicnode.com
   - **Chain ID**: 11155111
3. **No constructor parameters needed** - just deploy
4. Copy the deployed contract address

### 3. Update Frontend

Once you have both contract addresses, update `constants.ts`:

```typescript
export const CONTRACTS = {
  "84532": { // Base Sepolia
    USD: "0x678d798938bd326d76e5db814457841d055560d0", // DUSD token
    NFT: "YOUR_BASE_SEPOLIA_NFT_ADDRESS", // Replace with actual address
  },
  "11155111": { // Ethereum Sepolia
    USD: null, // No DUSD token deployed on Ethereum Sepolia
    NFT: "YOUR_ETH_SEPOLIA_NFT_ADDRESS", // Replace with actual address
  },
} as const;
```

## Contract Functions

### Public Functions
- `mint(address to)` - Mint NFT to address (free)
- `balanceOf(address owner)` - Get NFT balance
- `ownerOf(uint256 tokenId)` - Get owner of token
- `tokenURI(uint256 tokenId)` - Get metadata URI
- `totalSupply()` - Get total minted NFTs
- `nextTokenId()` - Get next token ID to be minted

### Owner Functions
- `setMintPrice(uint256 _price)` - Set mint price
- `setBaseURI(string baseURI)` - Set metadata base URI
- `withdraw()` - Withdraw contract funds

## Testing

After deployment, test these functions:

1. **Mint NFT**: Call `mint(your_address)` with 0 ETH
2. **Check Balance**: Call `balanceOf(your_address)` - should return 1
3. **Get Token URI**: Call `tokenURI(0)` - should return metadata URL
4. **Check Total Supply**: Call `totalSupply()` - should return 1

## Gas Costs

- **Deployment**: ~0.01-0.02 ETH per chain
- **Minting**: Free (0 ETH)
- **Reading**: Free (view functions)

## Verification

After deployment, verify the contracts on:
- **Base Sepolia**: https://sepolia.basescan.org
- **Ethereum Sepolia**: https://sepolia.etherscan.io

This will make the contract source code public and allow interaction through the block explorers.
