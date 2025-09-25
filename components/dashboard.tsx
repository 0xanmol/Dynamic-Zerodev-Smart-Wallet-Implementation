"use client";

import { useDynamicContext, isEthereumWallet } from "@/lib/dynamic";
import { NetworkIndicator } from "./network-indicator";
import { BalancesPanel } from "./balances-panel";
import { TransactionHistory } from "./transaction-history";
import { MintTokens } from "./mint-tokens";
import { NFTMinting } from "./nft-minting";
import { SendMoney } from "./send-money";
import { AAExplanation } from "./aa-explanation";
import { SecurityFeatures } from "./security-features";
import { RefreshCw, Wallet, Shield, Info } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export function Dashboard() {
  const { primaryWallet } = useDynamicContext();
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<"wallet" | "info" | "security">("wallet");

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
    return (
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Dynamic Gasless Demo</h2>
          <p className="text-muted-foreground">
            Connect your wallet to access the dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dynamic Gasless Demo</h1>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <Button
          variant={activeTab === "wallet" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("wallet")}
          className="flex-1"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Wallet
        </Button>
        <Button
          variant={activeTab === "info" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("info")}
          className="flex-1"
        >
          <Info className="mr-2 h-4 w-4" />
          How It Works
        </Button>
        <Button
          variant={activeTab === "security" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("security")}
          className="flex-1"
        >
          <Shield className="mr-2 h-4 w-4" />
          Security
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === "wallet" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NetworkIndicator />
            <BalancesPanel key={refreshKey} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MintTokens 
              onTransactionStart={() => console.log("Transaction started")}
              onTransactionSuccess={() => {
                console.log("Transaction successful");
                handleRefresh();
              }}
              onTransactionEnd={() => console.log("Transaction ended")}
            />
            <NFTMinting 
              onTransactionStart={() => console.log("NFT minting started")}
              onTransactionSuccess={() => {
                console.log("NFT minting successful");
                handleRefresh();
              }}
              onTransactionEnd={() => console.log("NFT minting ended")}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SendMoney 
              onTransactionStart={() => console.log("Send money started")}
              onTransactionSuccess={() => {
                console.log("Send money successful");
                handleRefresh();
              }}
              onTransactionEnd={() => console.log("Send money ended")}
            />
            <TransactionHistory key={refreshKey} />
          </div>
        </div>
      )}

      {activeTab === "info" && (
        <AAExplanation />
      )}

      {activeTab === "security" && (
        <SecurityFeatures />
      )}
    </div>
  );
}