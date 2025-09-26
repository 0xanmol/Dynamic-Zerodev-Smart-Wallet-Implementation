# USDC Paymaster Setup Guide

## The Issue

USDC transfers are failing because **ZeroDev paymasters require special configuration for ERC20 tokens**. The standard paymaster only supports native ETH transfers, not ERC20 token transfers.

## Error Details

```
POST https://rpc.zerodev.app/api/v2/paymaster/ea75317f-44f8-44f5-a494-3984fcbcc631?paymasterProvider=PIMLICO 400 (Bad Request)
```

This error occurs because:
1. USDC is an ERC20 token, not native ETH
2. ZeroDev paymaster needs to be configured to support USDC specifically
3. ERC20 transfers require token approval for the paymaster

## Solution: Configure ERC20 Paymaster

### Step 1: ZeroDev Dashboard Configuration

1. Go to your [ZeroDev Dashboard](https://dashboard.zerodev.app/)
2. Navigate to your project (ID: `ea75317f-44f8-44f5-a494-3984fcbcc631`)
3. Go to **Paymaster Settings**
4. Add **USDC** as a supported ERC20 token:
   - Token Address: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
   - Token Symbol: `USDC`
   - Decimals: `6`

### Step 2: Update Code Implementation

The current implementation needs to be updated to use the ERC20 paymaster approach:

```typescript
// Instead of direct USDC transfers, use ERC20 paymaster
import { getERC20PaymasterApproveCall } from '@zerodev/sdk';
import { createZeroDevPaymasterClient } from '@zerodev/sdk/clients';

// Create ERC20 paymaster client
const paymasterClient = createZeroDevPaymasterClient({
  chain: baseSepolia,
  transport: http(`https://rpc.zerodev.app/api/v2/paymaster/${projectId}`),
});

// Batch approval + transfer
const callData = await kernelClient.account.encodeCalls([
  // ERC20 approval for paymaster
  await getERC20PaymasterApproveCall(paymasterClient, {
    approveAmount: parseUnits('0.1', 6), // USDC has 6 decimals
    entryPoint,
    gasToken: USDC_CONTRACT,
  }),
  // USDC transfer
  {
    data: encodeFunctionData({
      abi: USDC_ABI,
      functionName: 'transfer',
      args: [recipientAddress, amountWei],
    }),
    to: USDC_CONTRACT,
    value: 0n,
  },
]);
```

### Step 3: Prerequisites

- Your wallet must have sufficient USDC tokens to pay for gas
- USDC token must be configured in ZeroDev paymaster settings
- Need to implement ERC20 approval flow

## Current Workaround

For now, the app only supports **ETH transfers** using the custom smart contract approach. This works because:

1. ETH is native currency (not ERC20)
2. ZeroDev paymaster can sponsor native ETH transfers
3. Custom contract handles the transfer logic

## Testing ETH Transfers

1. Get ETH from [Circle Faucet](https://faucet.circle.com/)
2. Select "ETH (Contract Transfer)" in the app
3. Enter recipient address and amount
4. The transfer will be gasless via ZeroDev paymaster

## Next Steps

To enable USDC transfers:

1. Configure USDC in ZeroDev dashboard
2. Implement ERC20 paymaster code
3. Add token approval flow
4. Test with small amounts

## References

- [Dynamic ERC20 Paymaster Docs](https://www.dynamic.xyz/docs/smart-wallets/smart-wallet-providers/zerodev)
- [ZeroDev Dashboard](https://dashboard.zerodev.app/)
- [Circle Faucet](https://faucet.circle.com/)
