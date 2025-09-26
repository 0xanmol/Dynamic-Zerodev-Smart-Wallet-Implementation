"use client";

import { DynamicWidget } from "@/lib/dynamic";
import { Dashboard } from "@/components/dashboard";
import { ModeToggle } from "@/components/mode-toggle";
import DynamicLogo from "@/components/dynamic/logo";
import { Button } from "@/components/ui/button";
import { Wallet, Shield, Info } from "lucide-react";
import { useState } from "react";


export default function Main() {
  const [activeTab, setActiveTab] = useState<"wallet" | "info" | "security">("wallet");

  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="w-full max-w-6xl mx-auto px-4">
          {/* Main Header Row */}
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-4">
              <DynamicLogo width={100} height={20} />
              <div className="hidden sm:block h-6 w-px bg-border"></div>
              <h1 className="hidden sm:block text-lg font-semibold text-muted-foreground">
                Gasless Demo
              </h1>
            </div>
            
            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <ModeToggle />
              <DynamicWidget variant="modal" />
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex justify-center pb-3">
            <nav className="inline-flex items-center bg-muted/30 p-1 rounded-lg">
              <Button
                variant={activeTab === "wallet" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("wallet")}
                className="px-4 py-2 transition-all duration-200"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Wallet
              </Button>
              <Button
                variant={activeTab === "info" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("info")}
                className="px-4 py-2 transition-all duration-200"
              >
                <Info className="mr-2 h-4 w-4" />
                How It Works
              </Button>
              <Button
                variant={activeTab === "security" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("security")}
                className="px-4 py-2 transition-all duration-200"
              >
                <Shield className="mr-2 h-4 w-4" />
                Security
              </Button>
            </nav>
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
