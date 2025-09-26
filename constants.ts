// Contract addresses
export const CONTRACTS = {
  "84532": { // Base Sepolia
    NFT: "0x275068e0610DefC70459cA40d45C95e3DCF50A10",
  },
  "11155111": { // Ethereum Sepolia
    NFT: "0x725aC76CBb32665d0CfA90F34d2D2AecB526ee0e", // FreeNFT contract
  },
} as const;

// Contract ABIs - Only NFT ABI needed since we use ETH for transfers

// NFT contract ABI
export const NFT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "mint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Chain information
export const CHAIN_INFO = {
  "84532": {
    name: "Base Sepolia",
    explorer: "https://sepolia.basescan.org",
    rpc: "https://sepolia.base.org",
    icon: "🔵",
  },
  "11155111": {
    name: "Ethereum Sepolia", 
    explorer: "https://sepolia.etherscan.io",
    rpc: "https://ethereum-sepolia.publicnode.com",
    icon: "🔷",
  },
} as const;

export function getContractAddress(
  networkId: string | number,
  contractName: string
): `0x${string}` | undefined {
  const networkContracts = (CONTRACTS as Record<string, any>)[networkId];
  if (networkContracts && contractName in networkContracts) {
    const address = networkContracts[contractName];
    return address === null ? undefined : address;
  }

  return undefined;
}

export function getChainInfo(chainId: number) {
  return CHAIN_INFO[chainId as keyof typeof CHAIN_INFO] || {
    name: "Unknown Network",
    explorer: "",
    rpc: "",
    icon: "❓",
  };
}

export function getExplorerUrl(chainId: number, txHash: string) {
  const chainInfo = getChainInfo(chainId);
  return chainInfo.explorer ? `${chainInfo.explorer}/tx/${txHash}` : "";
}

export function getRpcUrl(chainId: number) {
  const chainInfo = getChainInfo(chainId);
  return chainInfo.rpc;
}
