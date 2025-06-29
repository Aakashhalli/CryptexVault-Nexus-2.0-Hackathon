import React, { useState } from "react";

const WalletAddress = ({ address }: { address: string }) => {
  const [showFull, setShowFull] = useState(false);

  const toggleAddress = () => setShowFull((prev) => !prev);

  return (
    <div
      className="flex-1 overflow-hidden cursor-pointer"
      onClick={toggleAddress}
    >
      <p className="text-sm text-gray-400">Wallet Address</p>
      <p className="text-sm truncate hover:text-blue-500 transition-all duration-200">
        {showFull ? address : `${address.slice(0, 6)}...${address.slice(-4)}`}
      </p>
    </div>
  );
};

export default WalletAddress;
