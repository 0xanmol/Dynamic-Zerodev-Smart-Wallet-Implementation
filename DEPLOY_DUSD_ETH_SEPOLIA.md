# Deploy DUSD Token on Ethereum Sepolia

## Contract Details
- **Contract Name**: DUSDToken
- **Symbol**: DUSD
- **Decimals**: 18
- **Features**: 
  - Public minting (anyone can mint)
  - Standard ERC20 functions
  - Owner controls

## Deployment Steps

### 1. Copy the Contract
Copy the entire contents of `contracts/DUSDToken.sol` into Remix IDE.

### 2. Compile
- Select Solidity version `0.8.19` or higher
- Compile the contract
- Should compile without errors

### 3. Deploy
- Go to "Deploy & Run Transactions" tab
- Select "Injected Provider" (MetaMask)
- Make sure you're on **Ethereum Sepolia** network
- Click "Deploy"
- Confirm the transaction in MetaMask

### 4. Get Contract Address
- After deployment, copy the contract address
- It will look like: `0x...`

### 5. Update Frontend
Once you have the contract address, I'll update the frontend to use it.

## Contract Functions

### Public Functions (Anyone can call)
- `mint(uint256 amount)` - Mint DUSD tokens to your address
- `transfer(address to, uint256 amount)` - Transfer DUSD to another address
- `approve(address spender, uint256 amount)` - Approve spending
- `transferFrom(address from, address to, uint256 amount)` - Transfer from approved address
- `burn(uint256 amount)` - Burn your DUSD tokens

### View Functions
- `name()` - Returns "Dynamic USD"
- `symbol()` - Returns "DUSD"
- `decimals()` - Returns 18
- `totalSupply()` - Returns total supply
- `balanceOf(address account)` - Returns balance of account
- `allowance(address owner, address spender)` - Returns allowance

## Testing
After deployment, you can test by:
1. Calling `mint(100000000000000000000)` to mint 100 DUSD (with 18 decimals)
2. Checking your balance with `balanceOf(your_address)`
3. Transferring to another address

## Next Steps
Once deployed, give me the contract address and I'll update the frontend to support DUSD on Ethereum Sepolia!
