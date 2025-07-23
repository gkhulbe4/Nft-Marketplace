function NoWallet() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black gap-3">
      <h1 className="text-gray-300 font-semibold text-3xl">
        Connect wallet to create NFT
      </h1>
      <p className="text-gray-400 text-sm">
        Add any wallet extension like Metamask or Phantom to your browser
      </p>
    </div>
  );
}

export default NoWallet;
