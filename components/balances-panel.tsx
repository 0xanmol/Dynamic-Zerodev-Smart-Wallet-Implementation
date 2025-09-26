"use client";

import { useDynamicContext, isEthereumWallet } from "@/lib/dynamic";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect, useCallback } from "react";
import { getContractAddress, NFT_ABI, getRpcUrl, getChainInfo } from "@/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { createPublicClient, http } from "viem";
import { baseSepolia, sepolia } from "viem/chains";

interface DemoBalance {
  symbol: string;
  balance: string;
  type: "token" | "nft" | "activity";
  icon: string;
}

export function BalancesPanel() {
  const { primaryWallet } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const [balances, setBalances] = useState<DemoBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDemoBalances = useCallback(async (retryCount = 0) => {
      if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
        setBalances([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Add a small delay for wallet initialization
        if (retryCount > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }

        const walletClient = await primaryWallet.getWalletClient();
        const publicClient = await primaryWallet.getPublicClient();
        
        if (!walletClient || !publicClient) {
          if (retryCount < 3) {
            console.log(`Wallet client not available, retrying... (${retryCount + 1}/3)`);
            return fetchDemoBalances(retryCount + 1);
          }
          setError("Wallet client not available after retries");
          return;
        }

            // Get current chain ID
            const chainId = walletClient.chain?.id || publicClient.chain?.id;
            if (!chainId) {
              setError("Could not determine chain ID");
              return;
            }

            // Create a separate public client for reading contract data (not ZeroDev bundler)
            const rpcUrl = getRpcUrl(chainId);
            const chainInfo = getChainInfo(chainId);
            
            let chainClient;
            if (chainId === 84532) {
              chainClient = createPublicClient({
                chain: baseSepolia,
                transport: http(rpcUrl),
              });
            } else if (chainId === 11155111) {
              chainClient = createPublicClient({
                chain: sepolia,
                transport: http(rpcUrl),
              });
            } else {
              setError(`Unsupported chain: ${chainInfo.name}`);
              return;
            }

        const demoBalances: DemoBalance[] = [];

        // Fetch ETH balance
        try {
          const ethBalance = await publicClient.getBalance({
            address: walletClient.account.address,
          });
          const ethBalanceFormatted = (Number(ethBalance) / Math.pow(10, 18)).toFixed(4);
          demoBalances.push({
            symbol: "ETH",
            balance: ethBalanceFormatted,
            type: "token",
            icon: "💎"
          });
        } catch (ethError) {
          console.error("Failed to fetch ETH balance:", ethError);
        }

        // Fetch DUSD balance
        try {
          const dusdContractAddress = getContractAddress(chainId.toString(), "USD");
          if (dusdContractAddress) {
            const dusdBalance = await chainClient.readContract({
              address: dusdContractAddress,
              abi: TOKEN_ABI,
              functionName: "balanceOf",
              args: [walletClient.account.address],
            });
            const dusdBalanceFormatted = (Number(dusdBalance) / Math.pow(10, 18)).toFixed(0);
            demoBalances.push({
              symbol: "DUSD",
              balance: dusdBalanceFormatted,
              type: "token",
              icon: "💵"
            });
          } else {
            console.log(`DUSD contract not found for chain ${chainId}`);
          }
        } catch (dusdError) {
          console.error("Failed to fetch DUSD balance:", dusdError);
        }

        // Fetch NFT balance using chain-specific client
            try {
              const nftContract = getContractAddress(chainId.toString(), "NFT");
              if (!nftContract) {
                console.log(`NFT contract not found for chain ${chainId}, using localStorage fallback`);
                const storedCount = localStorage.getItem(`nftCount_${chainId}`);
                const nftCountNumber = storedCount ? parseInt(storedCount, 10) : 0;
                
                demoBalances.push({
                  symbol: "NFTs",
                  balance: nftCountNumber.toString(),
                  type: "nft",
                  icon: "🖼️"
                });
              } else {
                const nftCount = await chainClient.readContract({
                  address: nftContract,
                  abi: NFT_ABI,
                  functionName: "balanceOf",
                  args: [walletClient.account.address],
                });
                
                const nftCountNumber = Number(nftCount);
                
                // Store in localStorage for persistence (chain-specific)
                localStorage.setItem(`nftCount_${chainId}`, nftCountNumber.toString());
                
                demoBalances.push({
                  symbol: "NFTs",
                  balance: nftCountNumber.toString(),
                  type: "nft",
                  icon: "🖼️"
                });
              }
            } catch (nftError) {
              console.error("Failed to fetch NFT balance:", nftError);
              // Use localStorage fallback
              const storedNftCount = localStorage.getItem(`nftCount_${chainId}`);
              if (storedNftCount) {
                demoBalances.push({
                  symbol: "NFTs",
                  balance: storedNftCount,
                  type: "nft",
                  icon: "🖼️"
                });
              }
            }

        // Add demo activity count
        const existingTxs = JSON.parse(localStorage.getItem("demo-transactions") || "[]");
        demoBalances.push({
          symbol: "Gasless Txs",
          balance: existingTxs.length.toString(),
          type: "activity",
          icon: "⚡"
        });

        setBalances(demoBalances);
      } catch (err) {
        console.error("Failed to fetch demo balances:", err);
        setError("Failed to fetch balances");
      } finally {
        setIsLoading(false);
      }
  }, [primaryWallet]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchDemoBalances();
    } else {
      setBalances([]);
    }
  }, [isLoggedIn, fetchDemoBalances]);

  const handleRefresh = () => {
    if (isLoggedIn) {
      fetchDemoBalances();
    }
  };

  if (!isLoggedIn) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Demo Assets</CardTitle>
          <CardDescription>Connect your wallet to view balances</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your wallet balances will appear here once connected.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Demo Assets
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription>
          Your wallet balances and activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded"></div>
            <div className="h-4 bg-muted animate-pulse rounded"></div>
            <div className="h-4 bg-muted animate-pulse rounded"></div>
          </div>
        ) : error ? (
          <div className="text-sm text-red-600">
            {error}
          </div>
        ) : (
          <div className="space-y-3">
            {balances.map((balance, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{balance.icon}</span>
                  <div>
                    <div className="font-medium">{balance.symbol}</div>
                    <div className="text-xs text-muted-foreground">
                      {balance.type === "token" && "Native Token"}
                      {balance.type === "nft" && "Minted NFTs"}
                      {balance.type === "activity" && "Completed Transactions"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">{balance.balance}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}