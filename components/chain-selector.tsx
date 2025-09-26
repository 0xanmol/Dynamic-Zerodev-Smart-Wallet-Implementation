"use client";

import { useDynamicContext, isEthereumWallet } from "@/lib/dynamic";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getChainInfo } from "@/constants";
import { ChevronDown, Check } from "lucide-react";

const SUPPORTED_CHAINS = [
  { id: 84532, name: "Base Sepolia", icon: "🔵" },
  { id: 11155111, name: "Ethereum Sepolia", icon: "🔷" },
];

export function ChainSelector() {
  const { primaryWallet } = useDynamicContext();
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    async function getCurrentChain() {
      if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
        setCurrentChainId(null);
        return;
      }

      try {
        const walletClient = await primaryWallet.getWalletClient();
        const chainId = walletClient?.chain?.id;
        setCurrentChainId(chainId || null);
      } catch (error) {
        console.error("Failed to get current chain:", error);
        setCurrentChainId(null);
      }
    }

    getCurrentChain();
  }, [primaryWallet]);

  const handleChainSwitch = async (targetChainId: number) => {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
      alert("Please connect your wallet first");
      return;
    }

    if (targetChainId === currentChainId) {
      setIsOpen(false);
      return;
    }

    setIsSwitching(true);

    try {
      const walletClient = await primaryWallet.getWalletClient();
      
      // Get chain info for the target chain
      const chainInfo = getChainInfo(targetChainId);
      
      // Switch to the target chain
      await walletClient.switchChain({ id: targetChainId });
      
      setCurrentChainId(targetChainId);
      setIsOpen(false);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('chainSwitched', { 
        detail: { chainId: targetChainId } 
      }));
      
      // Small delay before refresh to allow event to propagate
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Failed to switch chain:", error);
      alert(`Failed to switch to ${getChainInfo(targetChainId).name}. Please try again.`);
    } finally {
      setIsSwitching(false);
    }
  };

  const currentChain = currentChainId ? getChainInfo(currentChainId) : null;

  if (!currentChain) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Network</CardTitle>
          <CardDescription>Connect your wallet to see network info</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-2">
              <span className="text-muted-foreground">🔌</span>
            </div>
            <p className="text-sm text-muted-foreground">Wallet not connected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Network</CardTitle>
        <CardDescription>Switch between supported networks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setIsOpen(!isOpen)}
            disabled={isSwitching}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentChain.icon}</span>
              <span>{currentChain.name}</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10">
              {SUPPORTED_CHAINS.map((chain) => (
                <button
                  key={chain.id}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
                  onClick={() => handleChainSwitch(chain.id)}
                  disabled={isSwitching}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{chain.icon}</span>
                    <span>{chain.name}</span>
                  </div>
                  {chain.id === currentChainId && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {isSwitching && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Switching network...
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="font-medium">Gasless Ready</span>
          </div>
          <p>ZeroDev paymaster active for sponsored transactions</p>
        </div>
      </CardContent>
    </Card>
  );
}
