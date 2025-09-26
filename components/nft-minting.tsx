"use client";

import { useDynamicContext, isEthereumWallet, isZeroDevConnector } from "@/lib/dynamic";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Loader2, Image, ExternalLink } from "lucide-react";
import { parseEther, formatEther } from "viem";
import { getContractAddress, NFT_ABI } from "@/constants";

// Free NFT contract address on Base Sepolia
const NFT_CONTRACT_ADDRESS = getContractAddress("84532", "NFT") || "0x275068e0610DefC70459cA40d45C95e3DCF50A10";

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
          chainId: walletClient.chain?.id || publicClient.chain?.id,
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
            const nftCount = Number(balance);
            setUserNFTBalance(nftCount);
            
            // Store NFT count in localStorage for persistence
            localStorage.setItem("nftCount", nftCount.toString());
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
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Image className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">NFT Minting</CardTitle>
            <CardDescription className="text-sm">
              Mint free NFTs with gasless transactions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">{mintPrice}</div>
            <div className="text-xs text-muted-foreground">ETH Cost</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">{userNFTBalance}</div>
            <div className="text-xs text-muted-foreground">Your NFTs</div>
          </div>
        </div>
        
        <Button 
          onClick={handleMintNFT} 
          disabled={isMinting}
          className="w-full h-12 text-base font-medium"
          size="lg"
        >
          {isMinting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Minting NFT...
            </>
          ) : (
            <>
              <Image className="mr-2 h-5 w-5" />
              Mint Free NFT
            </>
          )}
        </Button>

        {lastMintedTokenId && (
          <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <p className="font-medium text-green-800 dark:text-green-200">
                NFT #{lastMintedTokenId} minted!
              </p>
            </div>
            <p className="text-sm text-green-600 dark:text-green-300">
              Total NFTs: {userNFTBalance}
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="font-medium">Gasless & Free</span>
          </div>
          <p>Powered by ZeroDev paymaster on Base Sepolia</p>
        </div>
      </CardContent>
    </Card>
  );
}
