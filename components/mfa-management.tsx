"use client";

import { useState, useEffect } from "react";
import { useDynamicContext, useIsLoggedIn } from "@/lib/dynamic";
import { 
  useRegisterPasskey, 
  useAuthenticatePasskeyMFA, 
  useDeletePasskey,
  useMfa,
  usePromptMfaAuth
} from "@dynamic-labs/sdk-react-core";
import { MFADevice } from "@dynamic-labs/sdk-api-core";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { 
  Shield, 
  Smartphone, 
  Key, 
  QrCode, 
  CheckCircle, 
  X, 
  Plus,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import QRCodeUtil from "qrcode";

interface ConvertedMFADevice {
  id: string;
  type: string;
  name: string;
  createdAt: string;
}

export function MFAManagement() {
  const { user } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const [devices, setDevices] = useState<ConvertedMFADevice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string>("");
  const [totpSecret, setTotpSecret] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const [showSecret, setShowSecret] = useState(false);

  // Dynamic hooks
  const registerPasskey = useRegisterPasskey();
  const authenticatePasskeyMFA = useAuthenticatePasskeyMFA();
  const deletePasskey = useDeletePasskey();
  const promptMfaAuth = usePromptMfaAuth();
  const { addDevice, getUserDevices, authenticateDevice, deleteUserDevice } = useMfa();

  // Load user's MFA devices
  useEffect(() => {
    if (isLoggedIn) {
      loadDevices();
    }
  }, [isLoggedIn]);

  const loadDevices = async () => {
    try {
      setIsLoading(true);
      console.log("Loading MFA devices...");
      
      // Method 1: Try getUserDevices (current approach)
      let userDevices: any[] = [];
      try {
        const devices = await getUserDevices();
        console.log("Method 1 - getUserDevices result:", devices);
        userDevices = devices || [];
      } catch (err) {
        console.log("Method 1 failed:", err);
      }
      
      // Method 2: Try to access user context for MFA data
      try {
        console.log("Method 2 - User context:", user);
        if (user && (user as any).mfaDevices) {
          console.log("User has mfaDevices property:", (user as any).mfaDevices);
          userDevices = [...userDevices, ...((user as any).mfaDevices || [])];
        }
        if (user && (user as any).passkeys) {
          console.log("User has passkeys property:", (user as any).passkeys);
          userDevices = [...userDevices, ...((user as any).passkeys || [])];
        }
      } catch (err) {
        console.log("Method 2 failed:", err);
      }
      
      // Method 3: Try to access Dynamic context for additional MFA data
      try {
        console.log("Method 3 - Checking for additional MFA methods in useMfa hook");
        const mfaMethods = useMfa();
        console.log("Available MFA methods:", Object.keys(mfaMethods));
        
        // Try to call other methods if they exist
        if (typeof (mfaMethods as any).getUserPasskeys === 'function') {
          try {
            const passkeys = await (mfaMethods as any).getUserPasskeys();
            console.log("getUserPasskeys result:", passkeys);
            userDevices = [...userDevices, ...(passkeys || [])];
          } catch (err) {
            console.log("getUserPasskeys failed:", err);
          }
        }
      } catch (err) {
        console.log("Method 3 failed:", err);
      }
      
      // Method 4: Try to access Dynamic client directly
      try {
        console.log("Method 4 - Checking Dynamic context for client access");
        const dynamicContext = useDynamicContext();
        console.log("Dynamic context:", dynamicContext);
        
        if ((dynamicContext as any).sdk && typeof (dynamicContext as any).sdk.passkeys === 'object') {
          console.log("SDK has passkeys object:", (dynamicContext as any).sdk.passkeys);
          if (typeof (dynamicContext as any).sdk.passkeys.get === 'function') {
            try {
              const passkeys = await (dynamicContext as any).sdk.passkeys.get();
              console.log("SDK passkeys.get result:", passkeys);
              userDevices = [...userDevices, ...(passkeys || [])];
            } catch (err) {
              console.log("SDK passkeys.get failed:", err);
            }
          }
        }
      } catch (err) {
        console.log("Method 4 failed:", err);
      }
      
      console.log("Final combined devices:", userDevices);
      console.log("Number of devices returned:", userDevices?.length || 0);
      
      // Log each device in detail
      if (userDevices && Array.isArray(userDevices)) {
        userDevices.forEach((device, index) => {
          console.log(`Device ${index + 1}:`, {
            id: device.id,
            type: device.type,
            verified: device.verified,
            createdAt: device.createdAt,
            allProperties: Object.keys(device)
          });
        });
      }
      
      // Convert Dynamic SDK devices to our expected format
      const convertedDevices: ConvertedMFADevice[] = userDevices.map(device => {
        console.log("Processing device:", device);
        return {
          id: device.id || '',
          type: device.type || 'unknown',
          name: device.type === 'passkey' ? 'Passkey' : 'Authenticator App',
          createdAt: device.createdAt ? new Date(device.createdAt).toISOString() : new Date().toISOString()
        };
      });
      
      console.log("Converted devices:", convertedDevices);
      console.log("Passkey count:", convertedDevices.filter(d => d.type === 'passkey').length);
      console.log("TOTP count:", convertedDevices.filter(d => d.type === 'totp').length);
      setDevices(convertedDevices);
    } catch (err) {
      console.error("Failed to load devices:", err);
      setError("Failed to load MFA devices");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterPasskey = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await registerPasskey();
      await loadDevices(); // Refresh devices list
    } catch (err) {
      console.error("Failed to register passkey:", err);
      setError("Failed to register passkey. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterTOTP = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { uri, secret } = await addDevice();
      setTotpSecret(secret);
      
      // Generate QR code
      const qrCode = await QRCodeUtil.toDataURL(uri);
      setQrCodeData(qrCode);
      setShowQRCode(true);
    } catch (err) {
      console.error("Failed to setup TOTP:", err);
      setError("Failed to setup authenticator app. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyTOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Find the TOTP device (assuming it's the most recent one)
      const totpDevice = devices.find(d => d.type === "totp");
      if (!totpDevice) {
        setError("No TOTP device found. Please set up authenticator app first.");
        return;
      }

      await authenticateDevice({ 
        code: otpCode, 
        deviceId: totpDevice.id 
      });
      
      setShowQRCode(false);
      setOtpCode("");
      await loadDevices();
    } catch (err) {
      console.error("Failed to verify TOTP:", err);
      setError("Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDevice = async (deviceId: string, deviceType: string) => {
    if (!deviceId) {
      setError("Device ID not found");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (deviceType === "passkey") {
        // For passkeys, we need MFA authentication first
        await promptMfaAuth({ createMfaToken: true });
        await deletePasskey(deviceId);
      } else {
        // For TOTP devices, we need to authenticate first
        const code = prompt("Enter your 6-digit authenticator code to delete this device:");
        if (!code) return;

        const mfaToken = await authenticateDevice({
          code,
          deviceId,
          createMfaToken: { singleUse: true }
        });
        
        if (mfaToken) {
          await deleteUserDevice(deviceId, mfaToken);
        } else {
          throw new Error("Failed to get MFA token");
        }
      }

      await loadDevices();
    } catch (err) {
      console.error("Failed to delete device:", err);
      setError("Failed to delete device. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Multi-Factor Authentication
          </CardTitle>
          <CardDescription>
            Please log in to manage your MFA settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to set up additional security layers.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* MFA Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <div>
                <CardTitle>Multi-Factor Authentication</CardTitle>
                <CardDescription>
                  Add extra security layers to protect your wallet
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadDevices}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Key className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Passkeys</p>
                <p className="text-xs text-muted-foreground">
                  {devices.filter(d => d.type === "passkey").length} registered
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Smartphone className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Authenticator Apps</p>
                <p className="text-xs text-muted-foreground">
                  {devices.filter(d => d.type === "totp").length} registered
                </p>
              </div>
            </div>
          </div>
          
          {/* Debug: Show device details */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Debug: Device Details</h4>
            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <p>Total devices: {devices.length}</p>
              <p>Passkey devices: {devices.filter(d => d.type === "passkey").length}</p>
              <p>TOTP devices: {devices.filter(d => d.type === "totp").length}</p>
              <p>Device types: {devices.map(d => d.type).join(", ")}</p>
              <p>All devices: {JSON.stringify(devices, null, 2)}</p>
            </div>
            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> If you see passkeys in the Dynamic widget but 0 here, 
                the API might not be returning all device types. Check console logs for details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add MFA Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Security Method
          </CardTitle>
          <CardDescription>
            Choose how you'd like to add an extra layer of security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Passkey Setup */}
            <div className="p-4 border rounded-lg flex flex-col h-full">
              <div className="flex items-center gap-2 mb-3">
                <Key className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium">Passkey</h3>
              </div>
              <p className="text-sm text-muted-foreground flex-grow mb-3">
                Use your device's biometric authentication (Face ID, Touch ID, or Windows Hello)
              </p>
              <Button 
                onClick={handleRegisterPasskey} 
                disabled={isLoading}
                className="w-full mt-auto"
                variant="outline"
              >
                {isLoading ? "Setting up..." : "Add Passkey"}
              </Button>
            </div>

            {/* TOTP Setup */}
            <div className="p-4 border rounded-lg flex flex-col h-full">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="h-5 w-5 text-green-600" />
                <h3 className="font-medium">Authenticator App</h3>
              </div>
              <p className="text-sm text-muted-foreground flex-grow mb-3">
                Use apps like Google Authenticator, Authy, or 1Password
              </p>
              <Button 
                onClick={handleRegisterTOTP} 
                disabled={isLoading}
                className="w-full mt-auto"
                variant="outline"
              >
                {isLoading ? "Setting up..." : "Add Authenticator"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Modal for TOTP */}
      {showQRCode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Set Up Authenticator App
            </CardTitle>
            <CardDescription>
              Scan this QR code with your authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <img src={qrCodeData} alt="QR Code" className="w-48 h-48" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Manual Entry (if QR code doesn't work):</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-muted rounded text-xs font-mono">
                  {showSecret ? totpSecret : "••••••••••••••••"}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Enter 6-digit code to verify:</label>
              <div className="flex gap-2">
                <Input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="flex-1"
                />
                <Button onClick={handleVerifyTOTP} disabled={isLoading || otpCode.length !== 6}>
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={() => setShowQRCode(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Debug Info */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h4 className="font-medium text-blue-800 dark:text-blue-200">Debug Info</h4>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p>Is Logged In: {isLoggedIn ? 'Yes' : 'No'}</p>
              <p>Devices Count: {devices.length}</p>
              <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
              <p>User: {user ? 'Yes' : 'No'}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log("Manual refresh triggered");
                  loadDevices();
                }}
                className="mt-2"
              >
                Force Refresh Devices
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log("Current devices state:", devices);
                  console.log("Device types:", devices.map(d => d.type));
                  console.log("TOTP count:", devices.filter(d => d.type === "totp").length);
                }}
                className="mt-2"
              >
                Log State
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Registered Devices */}
      {devices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Registered Security Methods</CardTitle>
            <CardDescription>
              Manage your active MFA devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {device.type === "passkey" ? (
                      <Key className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Smartphone className="h-5 w-5 text-green-600" />
                    )}
                    <div>
                      <p className="font-medium">{device.name || `${device.type === "passkey" ? "Passkey" : "Authenticator App"}`}</p>
                      <p className="text-sm text-muted-foreground">
                        {device.type === "passkey" ? "Passkey" : "Authenticator App"} • 
                        {device.createdAt ? `Added ${new Date(device.createdAt).toLocaleDateString()}` : "Recently added"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDevice(device.id, device.type)}
                    disabled={isLoading}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p>Set up at least one MFA method for enhanced security</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p>Keep backup codes in a safe place in case you lose your device</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p>Use different MFA methods for different security levels</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
