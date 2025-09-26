"use client";

import { DynamicWidget, useDynamicContext, useIsLoggedIn } from "@/lib/dynamic";
import { Dashboard } from "@/components/dashboard";
import { ModeToggle } from "@/components/mode-toggle";
import DynamicLogo from "@/components/dynamic/logo";
import { Button } from "@/components/ui/button";
import { Wallet, Shield, Info } from "lucide-react";
import { useState } from "react";

function DynamicDebug() {
  const isLoggedIn = useIsLoggedIn();
  const { primaryWallet, sdkHasLoaded, user } = useDynamicContext();
  
  // Only render on client side to avoid hydration mismatch
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Log wallet extension conflicts (these are harmless)
  if (typeof window !== 'undefined' && window.ethereum) {
    console.log("Note: Wallet extension conflicts are normal and harmless. Multiple extensions trying to override window.ethereum is expected behavior.");
  }
  
  console.log("Dynamic Debug:", {
    isLoggedIn,
    primaryWallet: !!primaryWallet,
    sdkHasLoaded,
    user: !!user,
    userEmail: user?.email,
    walletAddress: primaryWallet?.address
  });
  
  return (
    <div className="text-xs text-muted-foreground flex-shrink-0">
      Debug: {isLoggedIn ? "Logged In" : "Logged Out"} | SDK: {sdkHasLoaded ? "Loaded" : "Loading"} | User: {user ? "Yes" : "No"} | Wallet: {primaryWallet ? "Yes" : "No"}
    </div>
  );
}

export default function Main() {
  const [activeTab, setActiveTab] = useState<"wallet" | "info" | "security">("wallet");

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Profile Button */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="w-full max-w-6xl mx-auto px-4">
          {/* Top Row */}
          <div className="flex h-16 items-center justify-between">
            {/* Left: Dynamic Logo */}
            <div className="flex items-center flex-shrink-0">
              <DynamicLogo width={120} height={24} />
            </div>
            
            {/* Center: Gasless Demo Title */}
            <div className="flex items-center justify-center flex-1">
              <h1 className="text-xl font-bold text-center">Gasless Demo</h1>
            </div>
            
            {/* Right: Debug Info + Theme Toggle + Dynamic Widget */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="hidden sm:block">
                <DynamicDebug />
              </div>
              <ModeToggle />
              <div className="flex-shrink-0">
                <DynamicWidget 
                  variant="modal"
                />
              </div>
            </div>
          </div>
          
          {/* Bottom Row: Tab Navigation */}
          <div className="flex justify-center pb-4">
            <div className="inline-flex items-center space-x-1 bg-muted/50 p-1 rounded-xl border">
              <Button
                variant={activeTab === "wallet" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("wallet")}
                className="flex-1 min-w-[120px] transition-all duration-200"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Wallet
              </Button>
              <Button
                variant={activeTab === "info" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("info")}
                className="flex-1 min-w-[120px] transition-all duration-200"
              >
                <Info className="mr-2 h-4 w-4" />
                How It Works
              </Button>
              <Button
                variant={activeTab === "security" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("security")}
                className="flex-1 min-w-[120px] transition-all duration-200"
              >
                <Shield className="mr-2 h-4 w-4" />
                Security
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl mx-auto px-4 py-8">
        <Dashboard activeTab={activeTab} onTabChange={setActiveTab} />
      </main>
    </div>
  );
}
