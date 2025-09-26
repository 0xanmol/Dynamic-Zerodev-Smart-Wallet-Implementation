// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract StandardNFT {
    // Token name and symbol
    string public name = "Dynamic Demo NFT";
    string public symbol = "DDNFT";
    
    // Token counter
    uint256 private _tokenIdCounter;
    
    // Mint price (free)
    uint256 public mintPrice = 0;
    
    // Owner
    address public owner;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Mappings
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => string) private _tokenURIs;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event NFTMinted(address indexed to, uint256 indexed tokenId);
    
    constructor() {
        owner = msg.sender;
        _baseTokenURI = "https://api.dynamic.xyz/metadata/";
    }
    
    // Modifier for owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    // Mint function - free for everyone
    function mint(address to) public payable returns (uint256) {
        require(msg.value >= mintPrice, "Insufficient payment");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _owners[tokenId] = to;
        _balances[to]++;
        
        emit Transfer(address(0), to, tokenId);
        emit NFTMinted(to, tokenId);
        
        return tokenId;
    }
    
    // ERC721 functions
    function balanceOf(address account) public view returns (uint256) {
        require(account != address(0), "Balance query for zero address");
        return _balances[account];
    }
    
    function ownerOf(uint256 tokenId) public view returns (address) {
        address tokenOwner = _owners[tokenId];
        require(tokenOwner != address(0), "Owner query for nonexistent token");
        return tokenOwner;
    }
    
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_owners[tokenId] != address(0), "URI query for nonexistent token");
        return string(abi.encodePacked(_baseTokenURI, _toString(tokenId)));
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    function nextTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    // Owner functions
    function setMintPrice(uint256 _price) public onlyOwner {
        mintPrice = _price;
    }
    
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    function setTokenURI(uint256 tokenId, string memory _tokenURI) public onlyOwner {
        require(_owners[tokenId] != address(0), "URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }
    
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    // Helper function to convert uint256 to string
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
