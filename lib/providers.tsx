"use client";

import { ThemeProvider } from "@/components/theme-provider";
import {
  DynamicContextProvider,
  EthereumWalletConnectors,
  ZeroDevSmartWalletConnectors,
} from "@/lib/dynamic";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DynamicContextProvider
        theme="light"
        settings={{
          environmentId:
            // replace with your own environment ID
            process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID ||
            "3de0b009-6d3e-4706-9ccc-98d42bb68454",
          walletConnectors: [
            EthereumWalletConnectors,
            ZeroDevSmartWalletConnectors,
          ],
        }}
      >
        {children}
      </DynamicContextProvider>
    </ThemeProvider>
  );
}
