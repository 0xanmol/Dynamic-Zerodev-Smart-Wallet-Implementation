"use client";

import { useDynamicContext, isEthereumWallet } from "@/lib/dynamic";
import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

interface Transaction {
  hash: string;
  type: "mint" | "transfer" | "other";
  amount?: string;
  symbol?: string;
  timestamp: number;
  status: "pending" | "success" | "failed";
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

  const getExplorerUrl = (hash: string) => {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) return "";
    
    // This would need to be dynamic based on the current chain
    // For Base Sepolia
    return `https://sepolia.basescan.org/tx/${hash}`;
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
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Recent Transactions</h3>
        <p className="text-sm text-muted-foreground">Connect wallet to view transactions</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">Recent Transactions</h3>
      
      {transactions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No transactions yet</p>
      ) : (
        <div className="space-y-3">
          {transactions.slice(0, 5).map((tx, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{getTransactionIcon(tx.type)}</span>
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
                <span className={`text-xs font-medium ${getStatusColor(tx.status)}`}>
                  {tx.status}
                </span>
                <a
                  href={getExplorerUrl(tx.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
