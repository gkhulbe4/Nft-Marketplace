import { useConnect } from "wagmi";

function AllWallets() {
  const { connect, connectors, isPending } = useConnect();

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      {connectors
        .filter((c) => c.name !== "Injected")
        .map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            className="flex w-full justify-center items-center gap-2 text-sm px-3 font-semibold py-2 rounded-md border border-[#333] bg-[#1f1f1f] text-white hover:border-[#f8c347] transition cursor-pointer"
          >
            {connector.icon && (
              <img
                src={connector.icon}
                alt={`${connector.name} icon`}
                className="w-4 h-4"
              />
            )}
            {connector.name.toUpperCase()}
          </button>
        ))}
      {isPending && (
        <span className="text-xs text-gray-400">Connecting...</span>
      )}
    </div>
  );
}

export default AllWallets;
