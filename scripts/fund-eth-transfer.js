const hre = require("hardhat");

async function main() {
  // Get the deployed contract
  const ETHTransfer = await hre.ethers.getContractAt(
    "ETHTransfer", 
    "0x5379F718229c987bafd3e808dAc529E73aa3756c"
  );

  // Fund the contract with 0.1 ETH
  const fundingAmount = hre.ethers.utils.parseEther("0.1");
  
  console.log("Funding ETH Transfer contract with 0.1 ETH...");
  
  const tx = await ETHTransfer.fund({ value: fundingAmount });
  await tx.wait();
  
  console.log("Contract funded successfully!");
  console.log("Transaction hash:", tx.hash);
  
  // Check contract balance
  const balance = await ETHTransfer.getBalance();
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
