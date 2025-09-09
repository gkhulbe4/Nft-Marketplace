export type Nft = {
  id: number;
  name: string;
  description: string;
  imgUrl: string;
  tokenId: number;
  auction: {
    currentBid: string | null;
    highestBidder: string | null;
    deadline: string;
    minimumBid: string;
    createdAt: string;
  };
};
