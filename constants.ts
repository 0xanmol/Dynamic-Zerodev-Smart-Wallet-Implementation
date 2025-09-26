// Contract addresses
export const CONTRACTS = {
  "84532": { // Base Sepolia
    USD: "0x678d798938bd326d76e5db814457841d055560d0", // DUSD token
    NFT: "0x9fbeb7d8e95eDD3B1825eF1d9447B52e68cEa248", // StandardNFT contract
  },
  "11155111": { // Ethereum Sepolia
    USD: null, // No DUSD token deployed on Ethereum Sepolia
    NFT: "0xbA7ed67197681Ed3B9C63063A2CDD9EE2A21f175", // StandardNFT contract
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
