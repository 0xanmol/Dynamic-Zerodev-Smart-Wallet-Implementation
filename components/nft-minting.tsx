"use client";

import { useDynamicContext, isEthereumWallet, isZeroDevConnector } from "@/lib/dynamic";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Loader2, Image, ExternalLink } from "lucide-react";
import { parseEther, formatEther } from "viem";

// Simple NFT contract ABI for minting
const NFT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "mint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Free NFT contract address on Base Sepolia
const NFT_CONTRACT_ADDRESS = "0x275068e0610DefC70459cA40d45C95e3DCF50A10";

interface NFTMintingProps {
  onTransactionStart?: () => void;
  onTransactionSuccess?: () => void;
  onTransactionEnd?: () => void;
}

export function NFTMinting({ 
  onTransactionStart, 
  onTransactionSuccess, 
  onTransactionEnd 
}: NFTMintingProps) {
  const { primaryWallet } = useDynamicContext();
  const [isMinting, setIsMinting] = useState(false);
  const [mintPrice, setMintPrice] = useState<string>("0");
  const [userNFTBalance, setUserNFTBalance] = useState<number>(0);
  const [lastMintedTokenId, setLastMintedTokenId] = useState<number | null>(null);

  const handleMintNFT = async () => {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
      alert("Please connect your wallet first");
      return;
    }


    setIsMinting(true);
    onTransactionStart?.();

    try {
      const walletClient = await primaryWallet.getWalletClient();
      
      if (!walletClient) {
        throw new Error("Failed to get wallet client");
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

      // Mint NFT using ZeroDev (free minting - no value required)
      const hash = await walletClient.writeContract({
        address: NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT_ABI,
        functionName: "mint",
        args: [walletClient.account.address],
      });

      // Wait for user operation receipt (ZeroDev way)
      try {
        const userOpReceipt = await kernelClient.waitForUserOperationReceipt({ hash });
        
        // The actual transaction hash is in the receipt
        const actualTxHash = userOpReceipt.receipt.transactionHash;
        
        // Get the minted token ID (this is a simplified approach)
        // In a real contract, you'd parse the Transfer event
        const publicClient = await primaryWallet.getPublicClient();
        if (publicClient) {
          const newBalance = await publicClient.readContract({
            address: NFT_CONTRACT_ADDRESS as `0x${string}`,
            abi: NFT_ABI,
            functionName: "balanceOf",
            args: [walletClient.account.address],
          });
          
          setUserNFTBalance(Number(newBalance));
          setLastMintedTokenId(Number(newBalance)); // Simplified
        }
        
        // Store transaction in localStorage for demo
        const txData = {
          hash: actualTxHash, // Use the actual transaction hash
          type: "nft_mint",
          amount: "0",
          symbol: "ETH",
          timestamp: Date.now(),
          status: "success" as const,
        };
        
        const existingTxs = JSON.parse(localStorage.getItem("demo-transactions") || "[]");
        existingTxs.unshift(txData);
        localStorage.setItem("demo-transactions", JSON.stringify(existingTxs));
        
        // Emit transaction event for other components
        const transactionEvent = new CustomEvent("new-transaction", {
          detail: txData
        });
        window.dispatchEvent(transactionEvent);
        
        const baseScanUrl = `https://sepolia.basescan.org/tx/${actualTxHash}`;
        alert(`🎉 NFT Minted Successfully!\n\nUser Operation Hash: ${hash}\nTransaction Hash: ${actualTxHash}\n\n✅ Your NFT has been minted and confirmed on the blockchain\n🔗 View on BaseScan: ${baseScanUrl}\n\nYour NFT balance: ${userNFTBalance + 1}`);
        
        // Only call success after we have the real transaction hash
        onTransactionSuccess?.();
      } catch (timeoutError) {
        // Transaction was submitted but confirmation timed out
        // This is common with network conditions
        console.log("Transaction submitted but confirmation timed out:", timeoutError);
        
        // Store as pending transaction (use user op hash for now)
        const txData = {
          hash, // This is the user operation hash
          type: "nft_mint",
          amount: "0",
          symbol: "ETH",
          timestamp: Date.now(),
          status: "pending" as const,
        };
        
        const existingTxs = JSON.parse(localStorage.getItem("demo-transactions") || "[]");
        existingTxs.unshift(txData);
        localStorage.setItem("demo-transactions", JSON.stringify(existingTxs));
        
        // Emit transaction event for other components
        const transactionEvent = new CustomEvent("new-transaction", {
          detail: txData
        });
        window.dispatchEvent(transactionEvent);
        
        // Show pending message - DO NOT call success since transaction isn't confirmed
        alert(`⏳ NFT Mint Transaction Submitted (Pending)\n\nUser Operation Hash: ${hash}\n\n🔄 Your transaction has been submitted but is still processing\n⏳ It may take a few minutes to confirm due to network conditions\n\nNote: The transaction will appear on BaseScan once confirmed.`);
      }
    } catch (error) {
      console.error("NFT minting failed:", error);
      alert(`NFT minting failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsMinting(false);
      onTransactionEnd?.();
    }
  };

  const fetchNFTData = async () => {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) return;

    try {
      // Set fallback values first
      setMintPrice("0");
      setUserNFTBalance(0);

      // Try to get contract data, but don't fail if it doesn't work
      try {
        const publicClient = await primaryWallet.getPublicClient();
        if (publicClient) {
          // Get mint price from contract (should be 0 for free minting)
          const price = await publicClient.readContract({
            address: NFT_CONTRACT_ADDRESS as `0x${string}`,
            abi: NFT_ABI,
            functionName: "mintPrice",
          });
          setMintPrice(formatEther(price as bigint));

          // Get user's NFT balance
          const walletClient = await primaryWallet.getWalletClient();
          if (walletClient) {
            const balance = await publicClient.readContract({
              address: NFT_CONTRACT_ADDRESS as `0x${string}`,
              abi: NFT_ABI,
              functionName: "balanceOf",
              args: [walletClient.account.address],
            });
            setUserNFTBalance(Number(balance));
          }
        }
      } catch (contractError) {
        console.log("Contract not accessible, using fallback values");
        // Keep fallback values
      }
    } catch (error) {
      console.error("Failed to fetch NFT data:", error);
      // Set fallback values
      setMintPrice("0");
      setUserNFTBalance(0);
    }
  };

  // Fetch NFT data when wallet connects
  useState(() => {
    if (primaryWallet && isEthereumWallet(primaryWallet)) {
      fetchNFTData();
    }
  });

  if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            NFT Minting
          </CardTitle>
          <CardDescription>
            Connect your wallet to mint NFTs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please connect your Dynamic embedded wallet to mint NFTs.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          NFT Minting
        </CardTitle>
        <CardDescription>
          Mint free NFTs using your embedded wallet with gasless transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Mint Price:</span>
            <p className="text-muted-foreground">{mintPrice} ETH</p>
          </div>
          <div>
            <span className="font-medium">Your NFTs:</span>
            <p className="text-muted-foreground">{userNFTBalance}</p>
          </div>
        </div>
        
        <Button 
          onClick={handleMintNFT} 
          disabled={isMinting}
          className="w-full"
        >
          {isMinting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Minting NFT...
            </>
          ) : (
            <>
              <Image className="mr-2 h-4 w-4" />
              Mint Free NFT
            </>
          )}
        </Button>

        {lastMintedTokenId && (
          <div className="rounded-lg bg-green-50 p-3 text-sm">
            <p className="font-medium text-green-800">
              🎉 NFT #{lastMintedTokenId} minted successfully!
            </p>
            <p className="text-green-600">
              Your NFT balance: {userNFTBalance}
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>
            <strong>Free NFT Contract:</strong> FreeNFT contract is live on Base Sepolia. 
            Mint price: 0 ETH. Gas fees are sponsored by ZeroDev paymaster.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
