import { useState } from "react";
import { TransferToken } from "./TransferToken";
import { TransferNFT } from "./TransferNFT";

export const SendTabs = () => {
  const [tab, setTab] = useState("Token");
  const handleTabChange = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    setTab((e.target as HTMLElement).innerHTML);
  };
  return (
    <>
      <div className="tabs w-full">
        <a
          className={`tab tab-bordered w-1/2 ${
            tab === "Token" && "tab-active"
          }`}
          onClick={handleTabChange}
        >
          Token
        </a>
        <a
          className={`tab tab-bordered w-1/2 ${tab === "NFT" && "tab-active"}`}
          onClick={handleTabChange}
        >
          NFT
        </a>
      </div>
      {tab === "Token" && <TransferToken />}
      {tab === "NFT" && <TransferNFT />}
    </>
  );
};
