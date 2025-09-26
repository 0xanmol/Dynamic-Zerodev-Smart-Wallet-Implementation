// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ETHTransfer
 * @dev Simple contract to handle ETH transfers for ZeroDev paymaster compatibility
 */
contract ETHTransfer {
    event ETHSent(address indexed to, uint256 amount, string message);
    
    /**
     * @dev Transfer ETH to a recipient using contract's balance
     * @param to The recipient address
     * @param amount The amount of ETH to transfer (in wei)
     * @param message Optional message for the transfer
     */
    function transferETH(address to, uint256 amount, string memory message) external {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");
        require(address(this).balance >= amount, "Insufficient contract balance");
        
        (bool success, ) = payable(to).call{value: amount}("");
        require(success, "ETH transfer failed");
        
        emit ETHSent(to, amount, message);
    }
    
    /**
     * @dev Fund the contract with ETH (any amount)
     */
    function fund() external payable {
        require(msg.value > 0, "Must send some ETH");
        // Contract receives ETH when this function is called with value
        emit ETHSent(address(this), msg.value, "Contract funded");
    }
    
    /**
     * @dev Fund the contract with any amount of ETH (fallback)
     */
    receive() external payable {
        // Contract receives ETH when sent directly
        emit ETHSent(address(this), msg.value, "Contract funded via receive");
    }
    
    /**
     * @dev Get the contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
