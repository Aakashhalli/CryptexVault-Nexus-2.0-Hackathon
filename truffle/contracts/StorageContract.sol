// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract StorageContract {
    mapping(bytes32 => address) public hashToOwner;

    // Add a hash with an owner

    function addHash(bytes32 _hash, address _owner) public {
        
        hashToOwner[_hash] = _owner;
    }

    // Retrieve owner of a hash

    function getOwner(bytes32 _hash) public view returns (address) {
        return hashToOwner[_hash];
    }

    // Check if a hash exists

    function hashExists(bytes32 _hash) public view returns (bool) {
        return hashToOwner[_hash] != address(0);
    }

    // Update the owner of a hash

    function updateOwner(bytes32 _hash, address _newOwner) public {
        hashToOwner[_hash] = _newOwner;
    }

    // Delete a hash entry

    function deleteHash(bytes32 _hash) public {
        delete hashToOwner[_hash];
    }
}
