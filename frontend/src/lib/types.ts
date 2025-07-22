export type Nft = {
  id: number;
  name: string;
  description: string;
  imgUrl: string;
  tokenId: number;
  auction: {
    currentBid: number | null;
    highestBidder: string | null;
    deadline: string;
    minimumBid: number;
    createdAt: string;
  };
};
