import { useAccount, useBalance } from "wagmi";

function MyAccount() {
  const { address, connector } = useAccount();
  const { data: balance, isLoading } = useBalance({
    address,
    // @ts-expect-error error
    watch: true,
  });

  return (
    <div className="flex flex-col text-sm text-white items-end">
      {connector && (
        <div className="flex items-center gap-2 text-xs text-[#B0B0C3]">
          {connector.icon && (
            <img
              src={connector.icon}
              alt={`${connector.name}`}
              className="w-4 h-4"
            />
          )}
          <span>Connected via {connector.name}</span>
        </div>
      )}
      <p className="text-xs text-[#00E395] mt-1">
        {isLoading
          ? "Loading..."
          : balance?.formatted
          ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}`
          : "0 ETH"}
      </p>
    </div>
  );
}

export default MyAccount;
