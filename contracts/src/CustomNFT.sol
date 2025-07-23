// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CustomNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    address public marketplaceAddress;

    event TokenCreated(
        uint256 indexed tokenId,
        address indexed owner,
        string imgUrl,
        string name,
        string description
    );

    constructor(
        address _marketplaceAddress
    ) ERC721("BidVerse", "BV") Ownable(msg.sender) {
        marketplaceAddress = _marketplaceAddress;
    }

    function createNFT(
        string memory tokenURI,
        string memory imgUrl,
        string memory name,
        string memory description
    ) external returns (uint256) {
        uint256 newTokenId = _tokenIdCounter;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        emit TokenCreated(newTokenId, msg.sender, imgUrl, name, description);

        _tokenIdCounter += 1;
        return newTokenId;
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function setMarketplaceAddress(
        address _marketplaceAddress
    ) public onlyOwner {
        marketplaceAddress = _marketplaceAddress;
    }
}
