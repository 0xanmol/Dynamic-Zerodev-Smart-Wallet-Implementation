"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Shield, Zap, Wallet, Users } from "lucide-react";

export function AAExplanation() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            What is Account Abstraction?
          </CardTitle>
          <CardDescription>
            Understanding how Dynamic's embedded wallets work
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p>
              Account Abstraction (AA) is a revolutionary approach to blockchain wallets that 
              makes Web3 more user-friendly and secure. Instead of traditional externally-owned 
              accounts (EOAs) that require users to manage private keys, AA uses smart contracts 
              as accounts.
            </p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Key Benefits:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Gasless Transactions:</strong> Sponsors can pay gas fees for users</li>
              <li><strong>Social Recovery:</strong> Recover accounts using social methods</li>
              <li><strong>Batch Operations:</strong> Execute multiple transactions in one call</li>
              <li><strong>Custom Logic:</strong> Implement complex transaction rules</li>
              <li><strong>Better UX:</strong> No seed phrases or private key management</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-4 w-4" />
              Gasless Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              In this demo, ZeroDev sponsors your gas fees. When you mint tokens or send money, 
              the transaction is paid for by the paymaster, not your wallet balance.
            </p>
            <div className="mt-3 p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                Try minting 100 DUSD tokens - it's completely free!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="h-4 w-4" />
              Smart Wallet Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your Dynamic embedded wallet is a smart contract that can:
            </p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Auto-deploy when first used</li>
              <li>• Execute complex transaction logic</li>
              <li>• Support social recovery</li>
              <li>• Batch multiple operations</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            How It Works in This Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  Sign in with email or social login. No crypto knowledge required.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">Smart Wallet Creation</h4>
                <p className="text-sm text-muted-foreground">
                  Dynamic creates a smart contract wallet for you automatically.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">Gasless Transactions</h4>
                <p className="text-sm text-muted-foreground">
                  ZeroDev paymaster sponsors your gas fees. You only pay for the actual transaction value.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <div>
                <h4 className="font-medium">Enhanced Security</h4>
                <p className="text-sm text-muted-foreground">
                  Your wallet supports social recovery and can implement custom security rules.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-muted/30 dark:bg-muted/20 rounded-lg border border-border/50">
              <h4 className="font-semibold text-sm mb-2 text-foreground">Smart Wallet Stack:</h4>
              <ul className="text-sm text-foreground/80 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span><strong className="text-foreground">Dynamic SDK:</strong> Authentication and wallet management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span><strong className="text-foreground">ZeroDev:</strong> Account abstraction infrastructure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span><strong className="text-foreground">Base Sepolia:</strong> Test network for development</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span><strong className="text-foreground">EntryPoint v7:</strong> Account abstraction standard</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-muted/30 dark:bg-muted/20 rounded-lg border border-border/50">
              <h4 className="font-semibold text-sm mb-2 text-foreground">Transaction Flow:</h4>
              <ol className="text-sm text-foreground/80 space-y-1.5 list-none">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">1</span>
                  <span>User initiates transaction (mint, send, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">2</span>
                  <span>Dynamic SDK creates UserOperation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">3</span>
                  <span>ZeroDev paymaster sponsors gas fees</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">4</span>
                  <span>Transaction executes on Base Sepolia</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">5</span>
                  <span>User sees success without paying gas</span>
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
