// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SimpleNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    uint256 public constant MINT_PRICE = 0.001 ether;
    uint256 public constant MAX_SUPPLY = 1000;
    
    constructor() ERC721("Dynamic Demo NFT", "DDNFT") Ownable(msg.sender) {}
    
    function mint(address to) public payable {
        require(msg.value >= MINT_PRICE, "Not enough ETH sent");
        require(_tokenIdCounter.current() < MAX_SUPPLY, "Max supply reached");
        
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();
        _safeMint(to, newItemId);
    }
    
    function mintPrice() public pure returns (uint256) {
        return MINT_PRICE;
    }
    
    function withdraw() public onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}
