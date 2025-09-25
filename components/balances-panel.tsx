"use client";

import { useDynamicContext, isEthereumWallet } from "@/lib/dynamic";
import { useState, useEffect } from "react";
import { formatEther } from "viem";

interface Balance {
  symbol: string;
  balance: string;
  decimals: number;
  isNative: boolean;
}

export function BalancesPanel() {
  const { primaryWallet } = useDynamicContext();
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBalances() {
      if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
        setBalances([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const walletClient = await primaryWallet.getWalletClient();
        if (!walletClient) {
          setError("Wallet client not available");
          return;
        }

        const address = await walletClient.getAddresses();
        const userAddress = address[0];

        if (!userAddress) {
          setError("No wallet address found");
          return;
        }

        const chainId = walletClient.chain?.id;
        if (!chainId) {
          setError("No chain ID found");
          return;
        }

        const newBalances: Balance[] = [];

        // Fetch native token balance
        try {
          const nativeBalance = await walletClient.getBalance({
            address: userAddress,
          });
          newBalances.push({
            symbol: "ETH",
            balance: formatEther(nativeBalance),
            decimals: 18,
            isNative: true,
          });
        } catch (err) {
          console.log("Failed to fetch native balance, will retry");
        }

        // Note: USD token contract not available, only showing native ETH balance
        // In a real implementation, you would deploy an ERC-20 token contract

        setBalances(newBalances);
      } catch (err) {
        console.error("Failed to fetch balances:", err);
        setError("Failed to load balances");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBalances();
  }, [primaryWallet]);

  if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Balances</h3>
        <p className="text-sm text-muted-foreground">Connect wallet to view balances</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">Balances</h3>
      
      {isLoading && (
        <div className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {!isLoading && !error && balances.length === 0 && (
        <p className="text-sm text-muted-foreground">No balances found</p>
      )}

      {!isLoading && !error && balances.length > 0 && (
        <div className="space-y-2">
          {balances.map((balance, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${balance.isNative ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                <span className="text-sm font-medium">{balance.symbol}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {parseFloat(balance.balance).toFixed(4)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
