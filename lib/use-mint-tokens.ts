import { useState } from "react";

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

      // Use writeContract for ERC-20 transfers
      // Different contracts have different implementations:
      // - Base Sepolia: expects raw dollar amounts (no scaling)
      // - Ethereum Sepolia: expects raw token units (with scaling)
      const chainId = Number(mintOptions.network);
      const amount = chainId === 84532 
        ? BigInt(amountDollars)  // Base Sepolia: raw dollars
        : BigInt(amountDollars) * BigInt(10 ** 18); // Ethereum Sepolia: scaled units
      
      const hash = await walletClient.writeContract({
        address: tokenAddress,
        abi: TOKEN_ABI,
        functionName: "mint",
        args: [amount],
      });

      setTxHash(hash);

      await kernelClient.waitForUserOperationReceipt({ hash });
      
      return hash;
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
