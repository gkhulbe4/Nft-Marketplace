import { Link } from "react-router-dom";
import MyAccount from "./MyAccount";
import WalletPopover from "./WalletPopover";
import { Boxes, Menu } from "lucide-react";
import { useAccount } from "wagmi";
import { useState } from "react";

function Header() {
  const { address } = useAccount();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full px-4 py-2 bg-[#07080a] backdrop-blur-lg border-b border-white/10 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <nav className="flex items-center gap-4 md:gap-10">
          <Link to="/">
            <Boxes size={34} color="#f8c345" />
          </Link>

          {address && (
            <button
              className="md:hidden text-gray-300"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu size={24} />
            </button>
          )}

          {address && (
            <div
              className={`absolute md:static top-14 left-0 w-full md:w-auto bg-[#07080a] md:bg-transparent md:flex transition-all duration-200 ease-in-out ${
                menuOpen ? "block" : "hidden"
              }`}
            >
              <div className="flex flex-col md:flex-row gap-2 px-4 py-2 md:p-0">
                {[
                  { to: "/create", label: "Create NFT" },
                  { to: "/listings", label: "Listings" },
                  { to: "/collection", label: "Your NFTs" },
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="text-xs px-4 py-2 font-light rounded-lg border border-white/10 backdrop-blur-md bg-[#141414] hover:bg-white/10 hover:border-[#f8c345] text-gray-300 transition shadow-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          )}
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
