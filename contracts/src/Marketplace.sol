// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ICustomNFT {
    function ownerOf(uint256 tokenId) external view returns (address);
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
}
contract Marketplace is Ownable, ReentrancyGuard {
    ICustomNFT public nftContract;

    constructor(address _nftAddress) Ownable(msg.sender) {
        nftContract = ICustomNFT(_nftAddress);
    }

    struct Auction {
        address seller;
        uint256 minimumBid;
        address highestBidder;
        uint256 highestBid;
        uint256 deadline;
        bool active;
    }

    mapping(uint256 => Auction) public auctions;

    event ItemListed(
        address indexed seller,
        uint256 indexed tokenId,
        uint256 minimumBid,
        uint256 durationInSeconds
    );

    event BidPlaced(
        address indexed bidder,
        uint256 indexed tokenId,
        uint256 amount
    );

    event AuctionClosed(
        uint256 indexed tokenId,
        address winner,
        uint256 finalPrice
    );

    function listItem(
        uint256 tokenId,
        uint256 minimumBid,
        uint256 durationInSeconds
    ) public {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not owner of NFT");
        auctions[tokenId] = Auction({
            seller: msg.sender,
            minimumBid: minimumBid,
            highestBidder: address(0),
            highestBid: 0,
            deadline: block.timestamp + durationInSeconds,
            active: true
        });
        emit ItemListed(
            msg.sender,
            tokenId,
            minimumBid,
            block.timestamp + durationInSeconds
        );
    }

    function placeBid(uint256 tokenId) public payable nonReentrant {
        Auction storage auction = auctions[tokenId];
        uint256 bidAmount = msg.value;
        require(auction.active == true, "Not active");
        require(block.timestamp < auction.deadline, "Auction ended");
        require(bidAmount > auction.minimumBid, "Bid too low");
        require(
            bidAmount > auction.highestBid,
            "Bid lower than the current bid"
        );

        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        emit BidPlaced(msg.sender, tokenId, bidAmount);
        auction.highestBidder = msg.sender;
        auction.highestBid = bidAmount;
    }

    function closeAuction(uint256 tokenId) public payable nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.active == true, "Not active");
        require(block.timestamp >= auction.deadline, "Auction not ended");
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not owner of NFT");

        auction.active = false;

        if (auction.highestBidder != address(0)) {
            payable(msg.sender).transfer(auction.highestBid);
            nftContract.safeTransferFrom(
                msg.sender,
                auction.highestBidder,
                tokenId
            );

            emit AuctionClosed(
                tokenId,
                auction.highestBidder,
                auction.highestBid
            );
            delete auctions[tokenId];
        } else {
            delete auctions[tokenId];
        }
    }

    function setNftAddress(address nftAddress) public onlyOwner {
        nftContract = ICustomNFT(nftAddress);
    }
}
