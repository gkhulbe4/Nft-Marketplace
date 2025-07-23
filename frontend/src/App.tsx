import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import Header from "./components/Header";
import { Toaster } from "sonner";
import wagmi from "./lib/wagmi";
import Listings from "./components/Listings";
import UserCollections from "./components/userCollections/UserCollections";
import { queryClient } from "./lib/queryClient";
import CreateNft from "./components/CreateNft";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <WagmiProvider config={wagmi}>
        <QueryClientProvider client={queryClient}>
          <Toaster richColors position="top-center" />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateNft />} />
            <Route path="/collection" element={<UserCollections />} />
            <Route path="/listings" element={<Listings />} />
          </Routes>
        </QueryClientProvider>
      </WagmiProvider>
    </Router>
  );
}

export default App;
