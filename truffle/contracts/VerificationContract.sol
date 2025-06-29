// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./StorageContract.sol";

contract VerificationContract {
    StorageContract storageContract;

    constructor(address _storageAddress) {
        storageContract = StorageContract(_storageAddress);
    }

    // Verify ownership of a hash
    function verifyOwnership(bytes32 _hash, address _owner) public view returns (bool) {
        return storageContract.getOwner(_hash) == _owner;
    }
}
