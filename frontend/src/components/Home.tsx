import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-[#07080a] pb-8 px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col justify-center items-start gap-4 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Create, Collect & Sell <br /> Digital NFTs
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl">
            Whether you're a creator or investor, easily buy, sell, and trade
            exclusive NFTs on a platform designed for a seamless experience.
          </p>
          <Link
            to="/create"
            className="text-black mt-4 text-sm font-semibold bg-[#f8c345] hover:bg-[#f8c345]/80 px-6 py-3 rounded-xl cursor-pointer"
          >
            Explore
          </Link>
        </div>

        <div className="w-full max-w-md">
          <img
            className="w-full h-auto object-cover rounded-2xl"
            src="https://ivory-occasional-marmoset-271.mypinata.cloud/ipfs/bafybeig23m2jtmwuhsk3bod6p2pam56ob5ndzedrpgfii4wr4t5fbheshq"
            alt="banner"
          />
        </div>
      </div>

      <div className="w-full h-80 px-10">
        <img
          className="w-full h-full object-fill rounded-2xl"
          src="https://ivory-occasional-marmoset-271.mypinata.cloud/ipfs/bafybeidgovkit6fa3ty2rsmlmd26xl4mncfozmmfojxoxb2pvwmhwxlp4q"
          alt="banner"
        />
      </div>
    </div>
  );
}

export default Home;
