"use client";

import { useDynamicContext, isEthereumWallet } from "@/lib/dynamic";
import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getExplorerUrl } from "@/constants";

interface Transaction {
  hash: string;
  type: "mint" | "transfer" | "other";
  amount?: string;
  symbol?: string;
  timestamp: number;
  status: "pending" | "success" | "failed";
  chainId?: number;
}

export function TransactionHistory() {
  const { primaryWallet } = useDynamicContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // For demo purposes, we'll store transactions in localStorage
    // In a real app, you'd fetch from an API or indexer
    const storedTxs = localStorage.getItem("demo-transactions");
    if (storedTxs) {
      try {
        setTransactions(JSON.parse(storedTxs));
      } catch (err) {
        console.error("Failed to parse stored transactions:", err);
      }
    }
  }, []);

  // Listen for new transactions (this would be called from the mint component)
  useEffect(() => {
    const handleNewTransaction = (event: CustomEvent) => {
      const newTx: Transaction = event.detail;
      setTransactions(prev => [newTx, ...prev]);
      localStorage.setItem("demo-transactions", JSON.stringify([newTx, ...transactions]));
    };

    window.addEventListener("new-transaction", handleNewTransaction as EventListener);
    return () => {
      window.removeEventListener("new-transaction", handleNewTransaction as EventListener);
    };
  }, [transactions]);

  const getExplorerUrlForTx = (tx: Transaction) => {
    if (!tx.hash) return "";
    
    // Use chainId from transaction if available, otherwise try to get from wallet
    let chainId = tx.chainId;
    
    if (!chainId && primaryWallet && isEthereumWallet(primaryWallet)) {
      // Try to get current chain ID from wallet
      primaryWallet.getWalletClient().then(client => {
        chainId = client?.chain?.id;
      }).catch(() => {
        // Fallback to Base Sepolia if we can't determine chain
        chainId = 84532;
      });
    }
    
    // Default to Base Sepolia if no chain ID available
    if (!chainId) {
      chainId = 84532;
    }
    
    return getExplorerUrl(chainId, tx.hash);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "mint":
        return "🪙";
      case "transfer":
        return "↔️";
      default:
        return "📄";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full"></div>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <span className="text-orange-600 text-lg">📋</span>
            </div>
            <div>
              <CardTitle className="text-lg">Transaction History</CardTitle>
              <CardDescription className="text-sm">
                Connect wallet to view transactions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-2">
              <span className="text-muted-foreground">📊</span>
            </div>
            <p className="text-sm text-muted-foreground">Connect your wallet to see transaction history</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full"></div>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <span className="text-orange-600 text-lg">📋</span>
          </div>
          <div>
            <CardTitle className="text-lg">Transaction History</CardTitle>
            <CardDescription className="text-sm">
              Your gasless transaction records
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
      
        {transactions.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-2">
              <span className="text-muted-foreground">📄</span>
            </div>
            <p className="text-sm text-muted-foreground">No transactions yet</p>
            <p className="text-xs text-muted-foreground mt-1">Start by minting tokens or NFTs</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-lg">
                    {getTransactionIcon(tx.type)}
                  </div>
                <div>
                  <div className="text-sm font-medium capitalize">
                    {tx.type}
                    {tx.amount && tx.symbol && (
                      <span className="ml-1 text-muted-foreground">
                        {tx.amount} {tx.symbol}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      tx.status === 'success' ? 'bg-green-500' : 
                      tx.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className={`text-xs font-medium ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </div>
                  <a
                    href={getExplorerUrlForTx(tx)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
            </div>
            ))}
            
            {transactions.length > 5 && (
              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">
                  Showing 5 of {transactions.length} transactions
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
