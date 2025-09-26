// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FinalNFT {
    string public name = "Dynamic Demo NFT";
    string public symbol = "DDNFT";
    uint256 private _tokenIdCounter;
    uint256 public mintPrice = 0;
    address public owner;
    
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event NFTMinted(address indexed to, uint256 indexed tokenId);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
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
        
        // Simple JSON metadata with a working image URL
        return string(abi.encodePacked(
            '{"name":"Dynamic Demo NFT #', _toString(tokenId), '",',
            '"description":"A demo NFT minted with gasless transactions",',
            '"image":"https://picsum.photos/400/400?random=', _toString(tokenId), '",',
            '"attributes":[{"trait_type":"Token ID","value":"', _toString(tokenId), '"}]}'
        ));
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    function nextTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    function setMintPrice(uint256 _price) public onlyOwner {
        mintPrice = _price;
    }
    
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
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
