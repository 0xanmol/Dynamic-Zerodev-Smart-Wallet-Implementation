"use client";

import { useDynamicContext } from "@/lib/dynamic";
import { useMintTokens } from "@/lib/use-mint-tokens";
import { useShadowDom } from "@/lib/shadow-dom/shadow-context";
import { TransactionModal } from "./transaction-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getContractAddress } from "@/constants";

interface ClaimTokensCardProps {
  onTransactionStart?: () => void;
  onTransactionSuccess?: () => void;
  onTransactionEnd?: () => void;
}

export function ClaimTokensCard({
  onTransactionStart,
  onTransactionSuccess,
  onTransactionEnd,
}: ClaimTokensCardProps) {
  const { mintTokens, isPending } = useMintTokens();
  const { openOverlay, closeOverlay } = useShadowDom();
  const { network } = useDynamicContext();

  // Check if DUSD is available on current chain
  const dusdAddress = network ? getContractAddress(network, "USD") : null;
  const isDusdAvailable = dusdAddress !== null;

  const handleClick = async () => {
    if (isPending) return;
    if (!network) return;
    if (!isDusdAvailable) {
      alert("DUSD is not available on this network. Please switch to Base Sepolia to claim DUSD tokens.");
      return;
    }

    try {
      onTransactionStart?.();
      openOverlay(
        <TransactionModal isSuccess={false} onClose={() => closeOverlay()} />
      );
      const txHash = await mintTokens({ amountDollars: 100, network });
      
      // Emit transaction event for history tracking
      const transactionEvent = new CustomEvent("new-transaction", {
        detail: {
          hash: txHash,
          type: "mint",
          amount: "100",
          symbol: "DUSD",
          timestamp: Date.now(),
          status: "success"
        }
      });
      window.dispatchEvent(transactionEvent);
      
      onTransactionSuccess?.();
      openOverlay(
        <TransactionModal isSuccess={true} onClose={() => closeOverlay()} />
      );
    } catch (err) {
      closeOverlay();
    } finally {
      onTransactionEnd?.();
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full"></div>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <span className="text-green-600 text-lg">💰</span>
          </div>
          <div>
            <CardTitle className="text-lg">Claim DUSD</CardTitle>
            <CardDescription className="text-sm">
              {isDusdAvailable 
                ? "Get 100 DUSD tokens instantly" 
                : "Available only on Base Sepolia"
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">100</div>
          <div className="text-sm text-green-600 dark:text-green-400 font-medium">DUSD Tokens</div>
        </div>
        
        <Button
          className="w-full h-12 text-base font-medium"
          disabled={isPending || !network || !isDusdAvailable}
          onClick={handleClick}
          size="lg"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Claiming...
            </>
          ) : !network ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : !isDusdAvailable ? (
            <>
              <span className="mr-2">⚠️</span>
              Switch to Base Sepolia
            </>
          ) : (
            <>
              <span className="mr-2">💰</span>
              Claim 100 DUSD
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="font-medium">Free & Gasless</span>
          </div>
          <p>No gas fees, powered by ZeroDev paymaster</p>
        </div>
      </CardContent>
    </Card>
  );
}
