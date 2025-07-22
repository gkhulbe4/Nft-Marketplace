import { Link } from "react-router-dom";
import MyAccount from "./MyAccount";
import WalletPopover from "./WalletPopover";

function Header() {
  return (
    <header className="w-full px-4 py-2 bg-black backdrop-blur-lg border-b border-white/10 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <nav className="flex items-center gap-3">
          {[
            { to: "/", label: "Create NFT" },
            { to: "/listings", label: "Listings" },
            { to: "/all", label: "Your NFTs" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-xs px-4 py-2 font-light rounded-lg border border-white/10 backdrop-blur-md bg-[#141414] hover:bg-white/10 hover:border-[#f8c345] text-gray-300 transition shadow-sm"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <WalletPopover />
          <MyAccount />
        </div>
      </div>
    </header>
  );
}

export default Header;
