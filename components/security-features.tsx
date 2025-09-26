"use client";

import { useDynamicContext, isEthereumWallet } from "@/lib/dynamic";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Shield, Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react";
import { MFAManagement } from "./mfa-management";

export function SecurityFeatures() {
  const { primaryWallet, user } = useDynamicContext();
  const [showPrivateInfo, setShowPrivateInfo] = useState(false);
  const [securityChecks, setSecurityChecks] = useState({
    walletConnected: false,
    smartWalletDeployed: false,
    socialRecoveryEnabled: false,
    mfaEnabled: false,
  });

  // Simulate security checks
  useState(() => {
    if (primaryWallet && isEthereumWallet(primaryWallet)) {
      setSecurityChecks(prev => ({
        ...prev,
        walletConnected: true,
        smartWalletDeployed: true, // Assume deployed if connected
        socialRecoveryEnabled: true, // Dynamic supports this
        mfaEnabled: user?.email ? true : false, // Email is a form of MFA
      }));
    }
  });

  const togglePrivateInfo = () => {
    setShowPrivateInfo(!showPrivateInfo);
  };

  if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Features
          </CardTitle>
          <CardDescription>
            Connect your wallet to view security features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please connect your Dynamic embedded wallet to view security features.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* MFA Management Section */}
      <MFAManagement />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Dashboard
          </CardTitle>
          <CardDescription>
            Your Dynamic embedded wallet security status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Security Status Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Wallet Connected</p>
                <p className="text-xs text-green-600 dark:text-green-400">Secure connection active</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Smart Wallet</p>
                <p className="text-xs text-green-600 dark:text-green-400">Account abstraction enabled</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <Lock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Social Recovery</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Email-based recovery</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">MFA Enabled</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Email verification</p>
              </div>
            </div>
          </div>

          {/* Wallet Information */}
          <div className="space-y-3">
            <h4 className="font-medium">Wallet Information</h4>
            <div className="p-3 bg-muted/30 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Wallet Address:</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-background border px-2 py-1 rounded">
                    {showPrivateInfo 
                      ? primaryWallet.address 
                      : `${primaryWallet.address.slice(0, 6)}...${primaryWallet.address.slice(-4)}`
                    }
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePrivateInfo}
                    className="h-6 w-6 p-0"
                  >
                    {showPrivateInfo ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Wallet Type:</span>
                <span className="text-sm text-muted-foreground">Smart Contract (AA)</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Network:</span>
                <span className="text-sm text-muted-foreground">
                  {"Unknown Network"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Features Explained</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Account Abstraction Security</h4>
                <p className="text-sm text-muted-foreground">
                  Your wallet is a smart contract that can implement custom security rules, 
                  batch transactions, and support social recovery.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Social Recovery</h4>
                <p className="text-sm text-muted-foreground">
                  If you lose access to your wallet, you can recover it using your email 
                  address and social login methods.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Multi-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  Your email address serves as a form of MFA. Dynamic can implement 
                  additional security layers like SMS or authenticator apps.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Security Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">For Production Use:</h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Enable additional MFA methods (SMS, authenticator)</li>
                <li>• Set up transaction limits and approval workflows</li>
                <li>• Implement time-locked recovery mechanisms</li>
                <li>• Use hardware wallet integration for high-value accounts</li>
                <li>• Regular security audits of smart contract logic</li>
              </ul>
            </div>
            
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Current Demo Features:</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Email-based authentication and recovery</li>
                <li>• Smart contract wallet with custom logic</li>
                <li>• Gasless transactions via paymaster</li>
                <li>• Social login integration</li>
                <li>• Passkey and TOTP MFA setup (see above)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
