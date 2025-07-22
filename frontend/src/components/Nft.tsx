import ListDialog from "./dialogs/ListDialog";

function Nft({
  id,
  name,
  description,
  imgUrl,
  tokenId,
  active,
  address,
}: {
  id: number;
  name: string;
  description: string;
  imgUrl: string;
  tokenId: number;
  active: boolean;
  address: string;
}) {
  return (
    <li
      key={id}
      className="relative group bg-[#141414] rounded-xl shadow-md border border-[#333] w-72 h-fit flex flex-col justify-between cursor-pointer overflow-hidden transition-all duration-300 hover:scale-102"
    >
      <img
        src={imgUrl}
        alt={name}
        className="h-52 w-full object-fill rounded-lg mb-3"
      />

      <div className="space-y-1 text-sm group-hover:opacity-40 transition-opacity duration-300 z-0 p-4">
        <p className="text-sm text-white font-light truncate">
          {name}{" "}
          <span className="text-[#f8c347] text-md font-semibold">
            #{tokenId}
          </span>
        </p>

        <p className="text-gray-400 text-xs">{description}</p>
      </div>

      <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-blue-600 text-white text-sm font-semibold flex items-center justify-center rounded-b-xl z-10">
        <ListDialog tokenId={tokenId} active={active} address={address} />
      </div>
    </li>
  );
}

export default Nft;
