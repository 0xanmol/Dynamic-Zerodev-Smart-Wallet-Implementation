"use client";

import { useDynamicContext, isEthereumWallet } from "@/lib/dynamic";
import { useState, useEffect } from "react";
import { getContractAddress, TOKEN_ABI } from "@/constants";

interface DemoBalance {
  symbol: string;
  balance: string;
  type: "token" | "nft" | "activity";
  icon: string;
}

export function BalancesPanel() {
  const { primaryWallet } = useDynamicContext();
  const [balances, setBalances] = useState<DemoBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDemoBalances() {
      if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
        setBalances([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const walletClient = await primaryWallet.getWalletClient();
        const publicClient = await primaryWallet.getPublicClient();
        
        if (!walletClient || !publicClient) {
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

        const newBalances: DemoBalance[] = [];

        // Fetch DUSD balance (demo token)
        try {
          const dusdAddress = getContractAddress(chainId, "USD");
          if (dusdAddress) {
            const dusdBalance = await publicClient.readContract({
              address: dusdAddress,
              abi: TOKEN_ABI,
              functionName: "balanceOf",
              args: [userAddress],
            });
            newBalances.push({
              symbol: "DUSD",
              balance: Number(dusdBalance).toString(),
              type: "token",
              icon: "💰",
            });
          }
        } catch (err) {
          console.log("Failed to fetch DUSD balance:", err);
          // Add fallback
          newBalances.push({
            symbol: "DUSD",
            balance: "0",
            type: "token",
            icon: "💰",
          });
        }

        // Fetch NFT balance
        try {
          const nftAddress = "0x275068e0610DefC70459cA40d45C95e3DCF50A10";
          const nftBalance = await publicClient.readContract({
            address: nftAddress as `0x${string}`,
            abi: [
              {
                inputs: [{ internalType: "address", name: "owner", type: "address" }],
                name: "balanceOf",
                outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                stateMutability: "view",
                type: "function",
              },
            ],
            functionName: "balanceOf",
            args: [userAddress],
          });
          newBalances.push({
            symbol: "NFTs",
            balance: Number(nftBalance).toString(),
            type: "nft",
            icon: "🖼️",
          });
        } catch (err) {
          console.log("Failed to fetch NFT balance:", err);
          // Add fallback
          newBalances.push({
            symbol: "NFTs",
            balance: "0",
            type: "nft",
            icon: "🖼️",
          });
        }

        // Get transaction count from localStorage
        try {
          const transactions = JSON.parse(localStorage.getItem("demo-transactions") || "[]");
          const successfulTxs = transactions.filter((tx: any) => tx.status === "success");
          newBalances.push({
            symbol: "Gasless Txs",
            balance: successfulTxs.length.toString(),
            type: "activity",
            icon: "⚡",
          });
        } catch (err) {
          newBalances.push({
            symbol: "Gasless Txs",
            balance: "0",
            type: "activity",
            icon: "⚡",
          });
        }

        setBalances(newBalances);
      } catch (err) {
        console.error("Failed to fetch demo balances:", err);
        setError("Failed to load demo balances");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDemoBalances();
  }, [primaryWallet]);

  if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Demo Assets</h3>
        <p className="text-sm text-muted-foreground">Connect wallet to view your gasless demo assets</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">Demo Assets</h3>
      
      {isLoading && (
        <div className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {!isLoading && !error && balances.length === 0 && (
        <p className="text-sm text-muted-foreground">No demo assets found</p>
      )}

      {!isLoading && !error && balances.length > 0 && (
        <div className="space-y-3">
          {balances.map((balance, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{balance.icon}</span>
                <span className="text-sm font-medium">{balance.symbol}</span>
              </div>
              <span className="text-sm font-bold text-primary">
                {balance.balance}
              </span>
            </div>
          ))}
          
          <div className="mt-3 pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              💡 All transactions are gasless thanks to ZeroDev sponsorship
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
