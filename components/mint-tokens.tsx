"use client";

import { useDynamicContext } from "@/lib/dynamic";
import { useMintTokens } from "@/lib/use-mint-tokens";
import { useShadowDom } from "@/lib/shadow-dom/shadow-context";
import { TransactionModal } from "./transaction-modal";

interface MintTokensProps {
  className?: string;
  onTransactionStart?: () => void;
  onTransactionSuccess?: () => void;
  onTransactionEnd?: () => void;
}
export function MintTokens({
  className,
  onTransactionStart,
  onTransactionSuccess,
  onTransactionEnd,
}: MintTokensProps) {
  const { mintTokens, isPending } = useMintTokens();
  const { openOverlay, closeOverlay } = useShadowDom();
  const { network } = useDynamicContext();

  const handleClick = async () => {
    if (isPending) return;
    if (!network) return;

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
          symbol: "ETH",
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
    <button
      className={className}
      disabled={isPending || !network}
      onClick={handleClick}
    >
      <div className="typography-button__content">
        <span className="typography typography--button-primary typography--primary">
          {isPending ? "Minting..." : !network ? "Loading..." : "Get Test ETH"}
        </span>
      </div>
    </button>
  );
}
