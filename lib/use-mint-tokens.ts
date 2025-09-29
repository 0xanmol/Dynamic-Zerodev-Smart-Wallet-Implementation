import { useState } from "react";
import { encodeFunctionData } from "viem";

import {
  useDynamicContext,
  isEthereumWallet,
  isZeroDevConnector,
} from "@/lib/dynamic";
import { getContractAddress, TOKEN_ABI } from "../constants";

export interface MintOptions {
  amountDollars: number;
  network: string | number;
}

export function useMintTokens() {
  const { primaryWallet } = useDynamicContext();

  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const mintTokens = async (mintOptions: MintOptions): Promise<string> => {
    if (!mintOptions.network) throw new Error("Network not found");
    const tokenAddress = getContractAddress(mintOptions.network, "USD");
    if (!tokenAddress) throw new Error("Token address not found");
    const { amountDollars } = mintOptions;

    try {
      setIsLoading(true);

      if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
        throw new Error("Wallet not connected or not EVM compatible");
      }
      const connector = primaryWallet.connector;
      if (!connector || !isZeroDevConnector(connector)) {
        throw new Error("Connector is not a ZeroDev connector");
      }
      const kernelClient = connector.getAccountAbstractionProvider();
      if (!kernelClient) throw new Error("Kernel client not found");

      // Use the same approach as the original Dynamic example
      const walletClient = await primaryWallet.getWalletClient();

      // Use sendUserOperation for gasless ERC-20 minting
      // Different contracts have different implementations:
      // - Base Sepolia: expects raw dollar amounts (no scaling)
      // - Ethereum Sepolia: expects raw token units (with scaling)
      const chainId = Number(mintOptions.network);
      const amount = chainId === 84532 
        ? BigInt(amountDollars)  // Base Sepolia: raw dollars
        : BigInt(amountDollars) * BigInt(10 ** 18); // Ethereum Sepolia: scaled units
      
      // Encode the mint function call
      const mintData = encodeFunctionData({
        abi: TOKEN_ABI,
        functionName: "mint",
        args: [amount],
      });

      console.log("DUSD Mint Debug:", {
        chainId,
        tokenAddress,
        amount: amount.toString(),
        mintData,
        amountDollars
      });

      console.log("Sending DUSD mint using ZeroDev kernel client...");
      const userOpHash = await kernelClient.sendUserOperation({
        callData: await kernelClient.account.encodeCalls([
          {
            to: tokenAddress as `0x${string}`,
            value: BigInt(0),
            data: mintData,
          },
        ]),
      });
      console.log("ZeroDev gasless DUSD mint successful, userOpHash:", userOpHash);

      // Wait for user operation to be processed and get actual transaction hash
      console.log("Waiting for user operation to be processed...");
      const userOpReceipt = await kernelClient.waitForUserOperationReceipt({
        hash: userOpHash as `0x${string}`,
        timeout: 120000, // 2 minutes timeout
      });
      
      console.log("User operation receipt:", userOpReceipt);
      
      // Get the actual transaction hash from the user operation receipt
      const actualTxHash = userOpReceipt.receipt.transactionHash;
      console.log("Actual transaction hash:", actualTxHash);
      
      setTxHash(actualTxHash);
      
      return actualTxHash;
    } catch (e: unknown) {
      console.log("Transaction failed:", e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const resetMint = () => {
    setTxHash(null);
    setIsLoading(false);
  };

  return {
    isPending: isLoading,
    txHash,
    mintTokens,
    resetMint,
  };
}
