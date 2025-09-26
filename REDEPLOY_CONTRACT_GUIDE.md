# Redeploy ETH Transfer Contract with Fund Function

## Step 1: Deploy the Updated Contract

1. **Go to Remix IDE**: Open [Remix Ethereum IDE](https://remix.ethereum.org/)

2. **Create New File**: 
   - Create a new file called `ETHTransfer.sol`
   - Copy the entire content from `contracts/ETHTransfer.sol` in this project

3. **Compile the Contract**:
   - Go to "Solidity Compiler" tab
   - Set compiler version to `0.8.19` or higher
   - Click "Compile ETHTransfer.sol"

4. **Deploy to Base Sepolia**:
   - Go to "Deploy & Run Transactions" tab
   - Select "Injected Provider - MetaMask"
   - Make sure you're on Base Sepolia Testnet
   - Click "Deploy"
   - Copy the new contract address

## Step 2: Fund the Contract

1. **In the Deployed Contract section**:
   - Find your newly deployed contract
   - Look for the `fund` function
   - **No amount parameter needed!**
   - Set the value to `0.01` ETH in the "Value" field
   - Click "fund" and confirm the transaction

2. **Verify Funding**:
   - Call `getBalance` function
   - Should return the amount you sent (e.g., `10000000000000000` for 0.01 ETH)

## Step 3: Update Frontend

1. **Update Contract Address**:
   - Open `components/send-money.tsx`
   - Replace the `ETH_TRANSFER_CONTRACT` address with your new address
   - Save the file

2. **Test the Function**:
   - Try sending money gaslessly
   - Should work now!

## Contract Functions

- **`fund(uint256 amount)`**: Fund the contract with specified amount
- **`transferETH(address to, string message)`**: Send ETH to recipient (gasless)
- **`getBalance()`**: Check contract balance
- **`receive()`**: Accept direct ETH transfers

## Example Usage in Remix

1. **Fund with 0.01 ETH**:
   - `fund` function
   - **No amount parameter needed**
   - Value: `0.01` ETH

2. **Check Balance**:
   - `getBalance` function
   - Should return `10000000000000000` (0.01 ETH in wei)

3. **Send ETH** (from frontend):
   - `transferETH` function
   - To: recipient address
   - Message: "Gasless transfer"
   - Value: amount to send

## Wei Conversion

- 1 ETH = 1000000000000000000 wei
- 0.1 ETH = 100000000000000000 wei
- 0.01 ETH = 10000000000000000 wei
