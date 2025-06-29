// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./StorageContract.sol";

contract DeleteContract {
    StorageContract storageContract;

    constructor(address _storageAddress) {
        storageContract = StorageContract(_storageAddress);
    }

    // Delete a hash entry
    function deleteHashEntry(bytes32 _hash) public {
        storageContract.deleteHash(_hash);
    }
}
