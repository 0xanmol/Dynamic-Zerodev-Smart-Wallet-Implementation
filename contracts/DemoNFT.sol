// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DemoNFT {
    // Token name and symbol
    string public name = "Dynamic Demo NFT";
    string public symbol = "DDNFT";
    
    // Token counter
    uint256 private _tokenIdCounter;
    
    // Mint price (free)
    uint256 public mintPrice = 0;
    
    // Owner
    address public owner;
    
    // Mappings
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event NFTMinted(address indexed to, uint256 indexed tokenId);
    
    constructor() {
        owner = msg.sender;
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
        
        // Return a simple JSON metadata with an image
        return string(abi.encodePacked(
            'data:application/json;base64,',
            _base64Encode(abi.encodePacked(
                '{"name":"Dynamic Demo NFT #', _toString(tokenId), '",',
                '"description":"A demo NFT minted with gasless transactions powered by Dynamic and ZeroDev",',
                '"image":"data:image/svg+xml;base64,', _getSVGImage(tokenId), '",',
                '"attributes":[{"trait_type":"Token ID","value":"', _toString(tokenId), '"}]}'
            ))
        ));
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
    
    // Generate a simple SVG image
    function _getSVGImage(uint256 tokenId) internal pure returns (string memory) {
        return _base64Encode(abi.encodePacked(
            '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
            '<rect width="400" height="400" fill="#', _getColor(tokenId), '"/>',
            '<text x="200" y="200" font-family="Arial" font-size="24" fill="white" text-anchor="middle">',
            'Dynamic Demo NFT',
            '</text>',
            '<text x="200" y="240" font-family="Arial" font-size="18" fill="white" text-anchor="middle">',
            '#', _toString(tokenId),
            '</text>',
            '</svg>'
        ));
    }
    
    // Generate a color based on token ID
    function _getColor(uint256 tokenId) internal pure returns (string memory) {
        string[8] memory colors = [
            "FF6B6B", "4ECDC4", "45B7D1", "96CEB4", 
            "FFEAA7", "DDA0DD", "98D8C8", "F7DC6F"
        ];
        return colors[tokenId % 8];
    }
    
    // Base64 encoding
    function _base64Encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";
        
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        
        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        string memory result = new string(encodedLen);
        
        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)
            
            for {
                let i := 0
            } lt(i, mload(data)) {
                i := add(i, 3)
            } {
                let input := and(mload(add(data, add(32, i))), 0xffffff)
                
                let out := mload(add(tablePtr, and(shr(250, input), 0x3F)))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(244, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(238, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(232, input), 0x3F))), 0xFF))
                out := shl(8, out)
                
                mstore(resultPtr, out)
                resultPtr := add(resultPtr, 4)
            }
            
            switch mod(mload(data), 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }
        }
        
        return result;
    }
}