// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./StorageContract.sol";

contract TransferContract {
    StorageContract storageContract;

    constructor(address _storageAddress) {
        storageContract = StorageContract(_storageAddress);
    }

    // Transfer ownership of a hash
    function transferOwnership(bytes32 _hash, address _newOwner) public {
        storageContract.updateOwner(_hash, _newOwner);
    }
}
