// Simple script to fund the ETH Transfer contract
// Run this with: node scripts/fund-contract.js

const { ethers } = require("ethers");

async function fundContract() {
  // Use Base Sepolia RPC
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  
  // You'll need to provide your private key to fund the contract
  // For security, use environment variable: process.env.PRIVATE_KEY
  const privateKey = process.env.PRIVATE_KEY || "YOUR_PRIVATE_KEY_HERE";
  
  if (privateKey === "YOUR_PRIVATE_KEY_HERE") {
    console.log("❌ Please set your PRIVATE_KEY environment variable");
    console.log("Example: PRIVATE_KEY=0x... node scripts/fund-contract.js");
    return;
  }
  
  const wallet = new ethers.Wallet(privateKey, provider);
  const contractAddress = "0x5379F718229c987bafd3e808dAc529E73aa3756c";
  
  console.log("💰 Funding ETH Transfer contract...");
  console.log("Contract address:", contractAddress);
  console.log("From wallet:", wallet.address);
  
  // Fund with 0.1 ETH
  const fundingAmount = ethers.parseEther("0.1");
  
  try {
    const tx = await wallet.sendTransaction({
      to: contractAddress,
      value: fundingAmount,
    });
    
    console.log("Transaction sent:", tx.hash);
    console.log("Waiting for confirmation...");
    
    await tx.wait();
    
    console.log("Contract funded successfully!");
    console.log("Amount sent:", ethers.formatEther(fundingAmount), "ETH");
    
    // Check contract balance
    const balance = await provider.getBalance(contractAddress);
    console.log("Contract balance:", ethers.formatEther(balance), "ETH");
    
  } catch (error) {
    console.error("❌ Error funding contract:", error.message);
  }
}

fundContract();
