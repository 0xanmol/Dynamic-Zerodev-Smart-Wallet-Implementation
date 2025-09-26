"use client";

import { useDynamicContext, isEthereumWallet } from "@/lib/dynamic";
import { NetworkIndicator } from "./network-indicator";
import { BalancesPanel } from "./balances-panel";
import { TransactionHistory } from "./transaction-history";
import { ClaimTokensCard } from "./claim-tokens-card";
import { NFTMinting } from "./nft-minting";
import { SendMoney } from "./send-money";
import { AAExplanation } from "./aa-explanation";
import { SecurityFeatures } from "./security-features";
import { ChainSelector } from "./chain-selector";
import { RefreshCw, Wallet, Shield, Info } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface DashboardProps {
  activeTab: "wallet" | "info" | "security";
  onTabChange: (tab: "wallet" | "info" | "security") => void;
}

export function Dashboard({ activeTab, onTabChange }: DashboardProps) {
  const { primaryWallet } = useDynamicContext();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
    return (
      <div className="w-full space-y-6">
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
    <div className="w-full space-y-8">
      {/* Status Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Gasless Demo Dashboard
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            Experience the future of Web3 with embedded wallets and gasless transactions powered by Dynamic + ZeroDev
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Gasless Transactions Active
          </div>
        </div>
      </div>


      {/* Tab Content */}
      {activeTab === "wallet" && (
        <div className="space-y-8">
              {/* Status Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="w-full">
                  <NetworkIndicator />
                </div>
                <div className="w-full">
                  <ChainSelector />
                </div>
                <div className="w-full">
                  <BalancesPanel key={refreshKey} />
                </div>
              </div>


              {/* Action Cards */}
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2">Gasless Actions</h2>
                  <p className="text-muted-foreground">Try these features with zero gas fees</p>
                </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClaimTokensCard 
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

            <div className="w-full">
              <SendMoney 
                onTransactionStart={() => console.log("Send money started")}
                onTransactionSuccess={() => {
                  console.log("Send money successful");
                  handleRefresh();
                }}
                onTransactionEnd={() => console.log("Send money ended")}
              />
            </div>
          </div>

          {/* Transaction History */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Transaction History</h2>
              <p className="text-muted-foreground">Track your gasless transactions</p>
            </div>
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