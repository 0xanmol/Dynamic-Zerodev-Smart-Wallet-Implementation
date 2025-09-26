const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying ETH Transfer contract...");

  // Get the contract factory
  const ETHTransfer = await ethers.getContractFactory("ETHTransfer");

  // Deploy the contract
  const ethTransfer = await ETHTransfer.deploy();

  // Wait for deployment to complete
  await ethTransfer.waitForDeployment();

  // Get the deployed contract address
  const contractAddress = await ethTransfer.getAddress();

  console.log("ETH Transfer contract deployed to:", contractAddress);
  console.log("Please update the ETH_TRANSFER_CONTRACT address in components/send-money.tsx");
  console.log("Contract address:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
