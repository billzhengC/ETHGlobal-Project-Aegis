// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract BadgeNFT is ERC721URIStorage, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    event CreatedBadgeNFT(uint256 indexed tokenId, string tokenURI);

    mapping(address => uint256) addresstoTokenId;

    constructor() ERC721("Carbon Retirement Challenge", "CRC") {}

    function getTokenURI(uint256 tokenId, string memory imageURL)
        public
        returns (string memory)
    {
        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "Carbon Retirement Challenge Serial #',
            tokenId.toString(),
            '",',
            '"description": "Retirement Challenge Participant',
            '",',
            '"image_data": "',
            imageURL,
            '"}'
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(dataURI)
                )
            );
    }

    function svgToImageURI(string memory svg)
        public
        pure
        returns (string memory)
    {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(
            bytes(string(abi.encodePacked(svg)))
        );
        return string(abi.encodePacked(baseURL, svgBase64Encoded));
    }

    // Signature tracker
    mapping(bytes => bool) public signatureUsed;

    // Allowlist addresses
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

    function mint(
        address _toAddress,
        bytes32 hash,
        bytes memory signature
    ) public onlyOwner {
        require(
            recoverSigner(hash, signature) == owner(),
            "Address is not allowlisted"
        );
        require(!signatureUsed[signature], "Signature has already been used.");

        string memory svg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 105.16" style="enable-background:new 0 0 122.88 105.16" xml:space="preserve"><g><path d="M66.41,88.93h21.91c1.76-1.75,3.69-3.57,5.65-5.42c4.11-3.89,8.4-7.95,12.81-13.03c5.04-5.81,5.58-7.82,7.11-13.51 c0.29-1.07,0.61-2.27,1.03-3.76l2.62-9.21l0.03-0.1c1.4-4.1,1.51-6.81,0.93-8.37c-0.18-0.48-0.41-0.8-0.68-0.97 c-0.21-0.14-0.49-0.19-0.78-0.16c-0.68,0.07-1.45,0.5-2.15,1.27l-7.78,18.53c-0.07,0.17-0.17,0.33-0.28,0.47 c-0.46,0.83-1.08,1.64-1.88,2.41l-13.8,15.39c-0.75,0.84-2.04,0.91-2.87,0.16c-0.84-0.75-0.91-2.04-0.16-2.87l13.81-15.39 c0.06-0.07,0.12-0.14,0.19-0.2c1.43-1.36,1.88-2.83,1.63-3.9c-0.08-0.33-0.22-0.61-0.42-0.8c-0.19-0.17-0.44-0.29-0.75-0.32v0 c-1.23-0.13-3.04,0.78-5.25,3.39l0,0c-0.06,0.07-0.13,0.14-0.2,0.21l-5.35,4.72l-0.03,0.03c-5.79,5.48-8.28,6.78-12.82,9.15 c-0.95,0.5-1.99,1.04-3.28,1.74c-0.51,0.28-1.01,0.62-1.5,0.99c-0.52,0.4-1.02,0.81-1.49,1.21c-2.4,2.02-3.66,3.66-4.38,5.47 c-0.75,1.88-1.02,4.17-1.39,7.31c-0.15,1.27-0.26,2.52-0.35,3.77C66.47,87.74,66.44,88.34,66.41,88.93L66.41,88.93z M51.47,42.28 c-2.18,2.9-4.05,5.32-5.06,8.09c-0.99,2.7-1.39,3.94,0.85,1.13c2.09-2.61,4.05-5.15,6.9-7.55c0.2,0.05,0.42,0.09,0.64,0.14 C80.67,49.23,99.5,37.6,96.19,0C76.28,6.9,48.07,4.09,50.99,39.43C51.1,40.74,51.2,41.64,51.47,42.28L51.47,42.28z M58.41,36.63 c6.5-14,23.2-18.8,31.48-28.37C80.9,25.79,75.99,25.02,58.41,36.63L58.41,36.63L58.41,36.63z M56.47,88.93H34.55 c-1.76-1.75-3.69-3.57-5.65-5.42c-4.11-3.89-8.4-7.95-12.81-13.03c-5.04-5.81-5.58-7.82-7.11-13.51C8.7,55.9,8.38,54.7,7.96,53.21 L5.34,44l-0.03-0.1c-1.4-4.1-1.51-6.81-0.93-8.37c0.18-0.48,0.41-0.8,0.68-0.97c0.21-0.14,0.49-0.19,0.78-0.16 C6.53,34.46,7.3,34.9,8,35.66l7.78,18.53c0.07,0.17,0.17,0.33,0.28,0.47c0.46,0.83,1.08,1.64,1.88,2.41l13.8,15.39 c0.75,0.84,2.04,0.91,2.87,0.16c0.84-0.75,0.91-2.04,0.16-2.87L20.96,54.35c-0.06-0.07-0.12-0.14-0.19-0.2 c-1.43-1.36-1.88-2.83-1.63-3.9c0.08-0.33,0.22-0.61,0.42-0.8c0.19-0.17,0.44-0.29,0.75-0.32v0c1.23-0.13,3.05,0.78,5.25,3.39l0,0 c0.06,0.07,0.13,0.14,0.2,0.21l5.35,4.72l0.03,0.03c5.79,5.48,8.28,6.78,12.82,9.15c0.95,0.5,1.99,1.04,3.28,1.74 c0.51,0.28,1.01,0.62,1.5,0.99c0.52,0.4,1.02,0.81,1.49,1.21c2.4,2.02,3.66,3.66,4.38,5.47c0.75,1.88,1.02,4.17,1.39,7.31 c0.15,1.27,0.26,2.52,0.35,3.77C56.41,87.74,56.44,88.34,56.47,88.93L56.47,88.93z M29.45,89.63c-0.31,0.36-0.5,0.83-0.5,1.34 v12.14c0,1.13,0.92,2.04,2.04,2.04h27.58c1.13,0,2.04-0.92,2.04-2.04V90.86c0-1.3-0.08-2.7-0.17-4c-0.09-1.33-0.21-2.65-0.36-3.96 c-0.4-3.43-0.7-5.94-1.66-8.35c-0.99-2.47-2.58-4.6-5.53-7.09c-0.54-0.46-1.09-0.92-1.67-1.35c-0.61-0.46-1.27-0.9-2.01-1.31 c-1.2-0.65-2.32-1.24-3.34-1.78c-4.2-2.2-6.5-3.4-11.91-8.52c-0.04-0.04-0.09-0.08-0.13-0.11l-5.22-4.61 c-3.19-3.73-6.31-4.97-8.7-4.71l-0.01,0v0c-1.17,0.12-2.17,0.58-2.97,1.28L11.65,33.8l-0.01,0c-0.08-0.18-0.18-0.35-0.31-0.51 c-1.46-1.75-3.31-2.77-5.08-2.95c-1.21-0.12-2.38,0.14-3.4,0.8c-0.97,0.63-1.77,1.61-2.27,2.96c-0.88,2.35-0.86,6,0.86,11.05 l2.6,9.15c0.38,1.32,0.71,2.59,1.02,3.71c1.7,6.35,2.3,8.6,7.97,15.12c4.49,5.17,8.88,9.33,13.1,13.32 C27.23,87.51,28.33,88.55,29.45,89.63L29.45,89.63z M33.35,93.01c0.27,0.06,0.55,0.06,0.83,0h22.34v8.06H33.03v-8.06H33.35 L33.35,93.01z M93.43,89.63c0.31,0.36,0.5,0.83,0.5,1.34v12.14c0,1.13-0.91,2.04-2.04,2.04H64.32c-1.13,0-2.04-0.92-2.04-2.04 V90.86c0-0.07,0-0.15,0.01-0.22c0.03-1.31,0.08-2.58,0.16-3.78c0.09-1.33,0.21-2.65,0.36-3.96c0.4-3.43,0.7-5.94,1.66-8.35 c0.99-2.47,2.58-4.6,5.53-7.09c0.54-0.46,1.09-0.92,1.67-1.35c0.61-0.46,1.27-0.9,2.01-1.31c1.2-0.65,2.32-1.24,3.34-1.78 c4.2-2.2,6.5-3.4,11.91-8.52c0.04-0.04,0.09-0.08,0.13-0.11l5.22-4.61c3.19-3.73,6.31-4.97,8.7-4.71l0.01,0v0 c1.17,0.12,2.17,0.58,2.97,1.28l5.27-12.56l0.01,0c0.08-0.18,0.18-0.35,0.31-0.51c1.46-1.75,3.31-2.77,5.08-2.95 c1.21-0.12,2.38,0.14,3.4,0.8c0.97,0.63,1.77,1.61,2.27,2.96c0.88,2.35,0.86,6-0.86,11.05l-2.6,9.15 c-0.38,1.32-0.71,2.59-1.02,3.71c-1.7,6.35-2.3,8.6-7.97,15.12c-4.49,5.17-8.88,9.33-13.1,13.32 C95.65,87.51,94.55,88.55,93.43,89.63L93.43,89.63z M89.53,93.01c-0.27,0.06-0.55,0.06-0.83,0H66.36v8.06h23.49v-8.06H89.53 L89.53,93.01z"/></g></svg>';

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(_toAddress, newItemId);
        string memory imageURL = svgToImageURI(svg);
        _setTokenURI(newItemId, getTokenURI(newItemId, imageURL));

        signatureUsed[signature] = true;

        emit CreatedBadgeNFT(newItemId, svg);
    }

    function iToHex(bytes memory buffer) public pure returns (string memory) {
        // Fixed buffer size for hexadecimal convertion
        bytes memory converted = new bytes(buffer.length * 2);

        bytes memory _base = "0123456789abcdef";

        for (uint256 i = 0; i < buffer.length; i++) {
            converted[i * 2] = _base[uint8(buffer[i]) / _base.length];
            converted[i * 2 + 1] = _base[uint8(buffer[i]) % _base.length];
        }

        return string(abi.encodePacked("0x", converted));
    }
}
