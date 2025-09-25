"use client";

import { useDynamicContext, isEthereumWallet } from "@/lib/dynamic";
import { useState, useEffect } from "react";

interface NetworkInfo {
  chainId: number | null;
  chainName: string | null;
  isConnected: boolean;
}

export function NetworkIndicator() {
  const { primaryWallet } = useDynamicContext();
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    chainId: null,
    chainName: null,
    isConnected: false,
  });

  useEffect(() => {
    async function fetchNetworkInfo() {
      if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
        setNetworkInfo({ chainId: null, chainName: null, isConnected: false });
        return;
      }

      try {
        const walletClient = await primaryWallet.getWalletClient();
        if (walletClient) {
          const chainId = walletClient.chain?.id;
          const chainName = walletClient.chain?.name;
          
          setNetworkInfo({
            chainId: chainId || null,
            chainName: chainName || null,
            isConnected: true,
          });
        } else {
          setNetworkInfo({ chainId: null, chainName: null, isConnected: false });
        }
      } catch (error) {
        console.log("Network info not available yet, will retry");
        setNetworkInfo({ chainId: null, chainName: null, isConnected: false });
      }
    }

    fetchNetworkInfo();
  }, [primaryWallet]);

  if (!networkInfo.isConnected) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
        <span className="text-muted-foreground">Not connected</span>
      </div>
    );
  }

  const getChainColor = (chainId: number) => {
    switch (chainId) {
      case 84532: // Base Sepolia
        return "bg-blue-500";
      case 8453: // Base Mainnet
        return "bg-blue-600";
      case 11155111: // Sepolia
        return "bg-purple-500";
      case 1: // Ethereum Mainnet
        return "bg-gray-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
      <div className={`h-2 w-2 rounded-full ${getChainColor(networkInfo.chainId!)}`}></div>
      <span className="font-medium">{networkInfo.chainName}</span>
      <span className="text-muted-foreground">({networkInfo.chainId})</span>
    </div>
  );
}
