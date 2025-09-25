"use client";

import { useDynamicContext, isEthereumWallet } from "@/lib/dynamic";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Loader2, Send, ExternalLink } from "lucide-react";
import { parseEther, formatEther } from "viem";

interface SendMoneyProps {
  onTransactionStart?: () => void;
  onTransactionSuccess?: () => void;
  onTransactionEnd?: () => void;
}

export function SendMoney({ 
  onTransactionStart, 
  onTransactionSuccess, 
  onTransactionEnd 
}: SendMoneyProps) {
  const { primaryWallet } = useDynamicContext();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [lastTransactionHash, setLastTransactionHash] = useState<string | null>(null);

  const handleSendMoney = async () => {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
      alert("Please connect your wallet first");
      return;
    }

    if (!recipientAddress || !amount) {
      alert("Please enter recipient address and amount");
      return;
    }

    // Basic address validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
      alert("Please enter a valid Ethereum address");
      return;
    }

    // Basic amount validation
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsSending(true);
    onTransactionStart?.();

    try {
      const walletClient = await primaryWallet.getWalletClient();
      const publicClient = await primaryWallet.getPublicClient();
      
      if (!walletClient || !publicClient) {
        throw new Error("Failed to get wallet or public client");
      }

      // Check balance
      const balance = await publicClient.getBalance({
        address: walletClient.account.address,
      });

      const amountWei = parseEther(amount);
      if (balance < amountWei) {
        throw new Error("Insufficient balance");
      }

      // Send transaction
      const hash = await walletClient.sendTransaction({
        to: recipientAddress as `0x${string}`,
        value: amountWei,
      });

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      if (receipt.status === "success") {
        setLastTransactionHash(hash);
        
        // Store transaction in localStorage for demo
        const txData = {
          hash,
          type: "send_money",
          amount: amount,
          symbol: "ETH",
          recipient: recipientAddress,
          timestamp: Date.now(),
          status: "success" as const,
        };
        
        const existingTxs = JSON.parse(localStorage.getItem("demo-transactions") || "[]");
        existingTxs.unshift(txData);
        localStorage.setItem("demo-transactions", JSON.stringify(existingTxs));
        
        onTransactionSuccess?.();
        alert(`Money sent successfully! Transaction: ${hash}`);
        
        // Clear form
        setRecipientAddress("");
        setAmount("");
      }
    } catch (error) {
      console.error("Send money failed:", error);
      alert(`Send money failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSending(false);
      onTransactionEnd?.();
    }
  };

  if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Money
          </CardTitle>
          <CardDescription>
            Connect your wallet to send money
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please connect your Dynamic embedded wallet to send money.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send Money
        </CardTitle>
        <CardDescription>
          Send ETH to any address using your embedded wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="recipient" className="text-sm font-medium">
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            placeholder="0x..."
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Amount (ETH)
          </label>
          <input
            id="amount"
            type="number"
            step="0.001"
            placeholder="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        
        <Button 
          onClick={handleSendMoney} 
          disabled={isSending || !recipientAddress || !amount}
          className="w-full"
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send {amount || "0"} ETH
            </>
          )}
        </Button>

        {lastTransactionHash && (
          <div className="rounded-lg bg-green-50 p-3 text-sm">
            <p className="font-medium text-green-800">
              💸 Money sent successfully!
            </p>
            <p className="text-green-600">
              Transaction: {lastTransactionHash.slice(0, 10)}...{lastTransactionHash.slice(-8)}
            </p>
            <a
              href={`https://sepolia.basescan.org/tx/${lastTransactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              View on BaseScan <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>
            <strong>Note:</strong> This sends real ETH from your embedded wallet. 
            Make sure you have sufficient balance and the recipient address is correct.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
