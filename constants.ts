// Contract addresses
export const CONTRACTS = {
  "84532": { // Base Sepolia
    USD: "0x678d798938bd326d76e5db814457841d055560d0", // DUSD token
    NFT: "0xCea441b6fB0695fC1DADC79Dd9A59Cf6a619f49f", // FinalNFT contract
  },
  "11155111": { // Ethereum Sepolia
    USD: "0x1F7daF8B1989A949c5f2d70340C234eF63aEE6F5", // DUSD token
    NFT: "0xC949C74C0644B4ED7b9bBCF4560A46e01E3B8B5d", // FinalNFT contract
  },
} as const;

// Contract ABIs
export const TOKEN_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amountDollars",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

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
        "name": "account",
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
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
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
    "inputs": [],
    "name": "nextTokenId",
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
    "inputs": [],
    "name": "name",
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
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
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
  // Gotcha: CHAIN_INFO keys are strings, but chainId comes as number
  return CHAIN_INFO[chainId.toString() as keyof typeof CHAIN_INFO] || {
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
