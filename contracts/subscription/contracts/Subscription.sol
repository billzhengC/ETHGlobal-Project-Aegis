// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Subscription is Ownable {
    event SubscriptionStatus(address channel, address subscriber, bool status);

    constructor() {}

    // Signature tracker
    mapping(bytes => bool) public signatureUsed;

    // Subscription Tracker
    mapping(address => mapping(address => bool)) public subscriptionTracker;

    // Recover signer address with hash and signature
    function recoverSigner(bytes32 hash, bytes memory signature)
        public
        pure
        returns (address)
    {
        bytes32 messageDigest = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );
        return ECDSA.recover(messageDigest, signature);
    }

    // Change the subscription of the notification
    function change(
        address _channel,
        address _subscriber,
        bool _status,
        bytes32 _hash,
        bytes memory _signature
    ) public onlyOwner {
        require(
            recoverSigner(_hash, _signature) == owner(),
            "invalid signature"
        );
        require(!signatureUsed[_signature], "signature has already been used");
        signatureUsed[_signature] = true;

        subscriptionTracker[_channel][_subscriber] = _status;
        emit SubscriptionStatus(_channel, _subscriber, _status);
    }

    // Get the subscription status
    function check(address _channel, address _subscriber)
        public
        view
        returns (bool)
    {
        return subscriptionTracker[_channel][_subscriber];
    }

    // Get multiple subscription status of given address list
    function checkMulti(address _channel, address[] memory _subscriberList)
        public
        view
        returns (bool[] memory)
    {
        bool[] memory resp = new bool[](_subscriberList.length);
        for (uint256 i = 0; i < _subscriberList.length; i++) {
            resp[i] = subscriptionTracker[_channel][_subscriberList[i]];
        }
        return resp;
    }
}
