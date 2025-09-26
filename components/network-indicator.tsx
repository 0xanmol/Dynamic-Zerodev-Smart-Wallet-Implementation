"use client";

import { useDynamicContext, isEthereumWallet } from "@/lib/dynamic";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getChainInfo } from "@/constants";

interface NetworkInfo {
  chainId: number | null;
  chainName: string | null;
  isConnected: boolean;
}

export function NetworkIndicator() {
  const { primaryWallet } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    chainId: null,
    chainName: null,
    isConnected: false,
  });

  useEffect(() => {
    async function fetchNetworkInfo(retryCount = 0) {
      if (!isLoggedIn || !primaryWallet || !isEthereumWallet(primaryWallet)) {
        setNetworkInfo({ chainId: null, chainName: null, isConnected: false });
        return;
      }

      // Add a small delay for wallet initialization
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }

      try {
        const walletClient = await primaryWallet.getWalletClient();
        const publicClient = await primaryWallet.getPublicClient();
        
        if (walletClient && publicClient) {
          let chainId = walletClient.chain?.id;
          let chainName = walletClient.chain?.name;
          
          // Fallback: try to get chain info from public client
          if (!chainId) {
            try {
              chainId = publicClient.chain?.id;
              chainName = publicClient.chain?.name;
            } catch (e) {
              console.log("Could not get chain info from public client");
            }
          }
          
          console.log("Network Info Debug:", { 
            walletChainId: walletClient.chain?.id, 
            publicChainId: publicClient.chain?.id,
            finalChainId: chainId,
            chainName 
          });
          
          // Use the centralized chain info function
          const chainInfo = getChainInfo(chainId || 0);
          
          setNetworkInfo({
            chainId: chainId || null,
            chainName: chainInfo.name,
            isConnected: true,
          });
        } else {
          if (retryCount < 3) {
            console.log(`Wallet or public client not available, retrying... (${retryCount + 1}/3)`);
            return fetchNetworkInfo(retryCount + 1);
          }
          console.log("Wallet or public client not available after retries");
          setNetworkInfo({ chainId: null, chainName: null, isConnected: false });
        }
      } catch (error) {
        console.log("Network info error:", error);
        
        // If it's a wallet client error and we haven't retried yet, try again
        if (error instanceof Error && error.message.includes("Unable to retrieve WalletClient") && retryCount < 3) {
          console.log(`Wallet client error, retrying... (${retryCount + 1}/3)`);
          return fetchNetworkInfo(retryCount + 1);
        }
        
        setNetworkInfo({ chainId: null, chainName: null, isConnected: false });
      }
    }

    fetchNetworkInfo();

    // Add a listener for chain changes
    const handleChainChange = () => {
      console.log("Chain change detected, refreshing network info...");
      fetchNetworkInfo();
    };

    // Listen for chain change events
    window.addEventListener('chainChanged', handleChainChange);
    
    // Also listen for custom chain change events from our chain selector
    window.addEventListener('chainSwitched', handleChainChange);

    return () => {
      window.removeEventListener('chainChanged', handleChainChange);
      window.removeEventListener('chainSwitched', handleChainChange);
    };
  }, [primaryWallet, isLoggedIn]);

  if (!networkInfo.isConnected) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-500/20 to-transparent rounded-bl-full"></div>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-gray-400"></div>
            </div>
            <div>
              <CardTitle className="text-lg">Network Status</CardTitle>
              <CardDescription className="text-sm">
                Wallet not connected
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-2">
              <span className="text-muted-foreground">🔌</span>
            </div>
            <p className="text-sm text-muted-foreground">Connect your wallet to see network info</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getChainColor = (chainId: number) => {
    const chainInfo = getChainInfo(chainId);
    switch (chainId) {
      case 84532: // Base Sepolia
        return "bg-blue-500";
      case 8453: // Base Mainnet
        return "bg-blue-600";
      case 11155111: // Ethereum Sepolia
        return "bg-purple-500";
      case 1: // Ethereum Mainnet
        return "bg-gray-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full"></div>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <div className={`h-3 w-3 rounded-full ${getChainColor(networkInfo.chainId!)}`}></div>
          </div>
          <div>
            <CardTitle className="text-lg">Network Status</CardTitle>
            <CardDescription className="text-sm">
              Connected to blockchain
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
                <div className={`h-2 w-2 rounded-full ${getChainColor(networkInfo.chainId!)}`}></div>
              </div>
              <div>
                <span className="text-sm font-medium">{networkInfo.chainName}</span>
                <div className="text-xs text-muted-foreground">
                  Chain ID: {networkInfo.chainId}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="font-medium">Gasless Ready</span>
          </div>
          <p>ZeroDev paymaster active for sponsored transactions</p>
        </div>
      </CardContent>
    </Card>
  );
}
