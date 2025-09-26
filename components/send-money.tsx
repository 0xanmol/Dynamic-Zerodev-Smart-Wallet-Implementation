"use client";

import { useDynamicContext, isEthereumWallet, isZeroDevConnector } from "@/lib/dynamic";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Loader2, Send, ExternalLink } from "lucide-react";
import { parseEther } from "viem";


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
  const [chainId, setChainId] = useState<number | null>(null);

  // Update chainId when wallet changes
  useEffect(() => {
    const updateChainId = async () => {
      if (primaryWallet && isEthereumWallet(primaryWallet)) {
        // Add a small delay to ensure wallet is fully initialized
        setTimeout(async () => {
          try {
            const walletClient = await primaryWallet.getWalletClient();
            if (walletClient?.chain?.id) {
              setChainId(walletClient.chain.id);
            }
          } catch (error) {
            console.log("Failed to get chain ID:", error);
          }
        }, 1000);
      } else {
        setChainId(null);
      }
    };

    updateChainId();
  }, [primaryWallet]);

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
      
      // Update chainId for this transaction
      const currentChainId = walletClient?.chain?.id;
      if (currentChainId) {
        setChainId(currentChainId);
      }

      if (!walletClient || !publicClient) {
        throw new Error("Failed to get wallet or public client");
      }

      // Convert amount to wei for ETH
      const amountWei = parseEther(amount);

      // Check user's ETH balance first
      const userBalance = await publicClient.getBalance({
        address: walletClient.account.address,
      });
      const userBalanceFormatted = (Number(userBalance) / Math.pow(10, 18)).toFixed(6);
      
      console.log("User ETH Balance:", userBalanceFormatted, "ETH");
      console.log("Trying to send:", amount, "ETH");
      
      if (userBalance < amountWei) {
        throw new Error(`Insufficient ETH balance. You have ${userBalanceFormatted} ETH but trying to send ${amount} ETH`);
      }

      // Check if this is a ZeroDev connector
      const connector = primaryWallet.connector;
      if (!connector || !isZeroDevConnector(connector)) {
        throw new Error("Connector is not a ZeroDev connector");
      }

      const kernelClient = connector.getAccountAbstractionProvider();
      if (!kernelClient) {
        throw new Error("Kernel client not found");
      }

      console.log("ETH Transfer Details:", {
        recipient: recipientAddress,
        amount: amount,
        amountWei: amountWei.toString(),
        userBalance: userBalanceFormatted,
        decimals: "18 (ETH)"
      });

      // Gotcha: Must use sendUserOperation for gasless, not sendTransaction
      console.log("Sending ETH using ZeroDev kernel client...");
      const hash = await kernelClient.sendUserOperation({
        calls: [{
          to: recipientAddress as `0x${string}`,
          value: amountWei,
          data: "0x" as `0x${string}`,
        }],
      });
      console.log("ZeroDev gasless ETH transfer successful, hash:", hash);

      console.log("Gasless ETH transfer hash:", hash);

      // Wait for user operation to be processed and get actual transaction hash
      console.log("Waiting for user operation to be processed...");
      const userOpReceipt = await kernelClient.waitForUserOperationReceipt({
        hash: hash as `0x${string}`,
        timeout: 120000, // 2 minutes timeout
      });
      
      console.log("User operation receipt:", userOpReceipt);
      
      // Get the actual transaction hash from the user operation receipt
      const actualTxHash = userOpReceipt.receipt.transactionHash;
      console.log("Actual transaction hash:", actualTxHash);
      
      // Wait for the actual transaction to be confirmed
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash: actualTxHash,
        timeout: 60000, // 1 minute for the actual transaction
        pollingInterval: 2000
      });

      console.log("Transaction receipt:", receipt);
      
      // Check if the transaction was successful
      if (receipt.status === "success") {
        setLastTransactionHash(actualTxHash);
        
        // Store transaction in localStorage for demo
        const txData = {
          hash: actualTxHash,
          type: "send_money",
          amount: amount,
          symbol: "ETH",
          recipient: recipientAddress,
          timestamp: Date.now(),
          status: "success" as const,
          chainId: walletClient.chain?.id || publicClient.chain?.id,
        };
        
        const existingTxs = JSON.parse(localStorage.getItem("demo-transactions") || "[]");
        existingTxs.unshift(txData);
        localStorage.setItem("demo-transactions", JSON.stringify(existingTxs));
        
        onTransactionSuccess?.();
        // Get the correct explorer URL based on chain
        const explorerUrl = chainId === 84532 
          ? `https://sepolia.basescan.org/tx/${actualTxHash}`
          : `https://sepolia.etherscan.io/tx/${actualTxHash}`;
        alert(`🎉 Gasless ETH transfer successful!\n\nTransaction Hash: ${actualTxHash}\n\nView on Explorer: ${explorerUrl}`);
        
        // Clear form
        setRecipientAddress("");
        setAmount("");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Send ETH failed:", error);
      
      // Check for specific errors
      if (error instanceof Error) {
        if (error.message.includes("WaitForTransactionReceiptTimeoutError")) {
          // Transaction was submitted but timed out waiting for confirmation
          const txHash = error.message.match(/hash "([^"]+)"/)?.[1] || "unknown";
          // Get the correct explorer URL based on chain
          const explorerUrl = chainId === 84532 
            ? `https://sepolia.basescan.org/tx/${txHash}`
            : `https://sepolia.etherscan.io/tx/${txHash}`;
          alert(`⏰ Transaction submitted but confirmation timed out.\n\nTransaction Hash: ${txHash}\n\nThis usually means:\n• Transaction is still processing (gasless transactions can take longer)\n• Check the transaction on Explorer: ${explorerUrl}\n• The transaction might still succeed despite the timeout\n\nYou can check the transaction status manually.`);
          
          // Store the transaction hash even if we timed out
          setLastTransactionHash(txHash);
        } else if (error.message.includes("Insufficient ETH balance")) {
          alert(`❌ ${error.message}\n\nPlease get more ETH from a faucet or reduce the amount you're trying to send.`);
        } else if (error.message.includes("Cannot destructure property 'authorization'")) {
          alert("❌ ZeroDev paymaster error: Please check your paymaster configuration in the ZeroDev dashboard.");
        } else if (error.message.includes("User rejected the request")) {
          alert("❌ Transaction was rejected by user.");
        } else if (error.message.includes("Transaction expected to fail")) {
          alert("❌ Transaction expected to fail. This usually means:\n• You don't have enough ETH\n• Invalid recipient address\n\nCheck your balances and try again.");
        } else if (error.message.includes("execution reverted")) {
          alert(`❌ Transaction failed: ${error.message}\n\nCheck the console for more details.`);
        } else {
          alert(`❌ Send ETH failed: ${error.message}\n\nCheck the console for more details.`);
        }
      } else {
        alert("❌ Send ETH failed: Unknown error occurred\n\nCheck the console for more details.");
      }
    } finally {
      setIsSending(false);
      onTransactionEnd?.();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send ETH
        </CardTitle>
        <CardDescription>
          Send ETH to any address using gasless transactions
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
            disabled={isSending}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Amount (ETH)
          </label>
          <input
            id="amount"
            type="number"
            step="any"
            placeholder="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            disabled={isSending}
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
            "Send ETH"
          )}
        </Button>
        {lastTransactionHash && (
          <div className="text-sm text-muted-foreground mt-4">
            <p className="font-medium text-green-800">
              💰 ETH sent successfully!
            </p>
            <a 
              href={chainId === 84532 
                ? `https://sepolia.basescan.org/tx/${lastTransactionHash}`
                : `https://sepolia.etherscan.io/tx/${lastTransactionHash}`
              } 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 text-blue-500 hover:underline"
            >
              View on {chainId === 84532 ? 'BaseScan' : 'Etherscan'} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="font-medium">Gasless ETH Transfer</span>
          </div>
          <p>Send ETH with zero gas fees - sponsored by ZeroDev paymaster</p>
        </div>
      </CardContent>
    </Card>
  );
}