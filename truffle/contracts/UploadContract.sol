// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./StorageContract.sol";

contract UploadContract {
    StorageContract storageContract;

    constructor(address _storageAddress) {
        storageContract = StorageContract(_storageAddress);
    }

    // Upload a new hash with an owner
    function uploadHash(bytes32 _hash, address _uploader) public returns (address) {

        if (storageContract.hashExists(_hash)) {
            // If the hash exists, return the current owner's address

            address owner = storageContract.getOwner(_hash);
            return owner;

        } else {
            
            // If the hash does not exist, add it and return the uploader's address
            storageContract.addHash(_hash, _uploader);
            return _uploader;
        }

    }
}
