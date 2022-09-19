import { useState } from "react";
import { AirDropToken } from "./AirDropToken";
import { AirDropNFT } from "./AirDropNFT";
import { Web3Wrapper } from "../Web3/Web3Wrapper";

export const AirDropTabs = () => {
  const [tab, setTab] = useState("Token");
  const handleTabChange = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    setTab((e.target as HTMLElement).innerHTML);
  };
  return (
    <div className="flex flex-col">
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
      <Web3Wrapper>
        {tab === "Token" && <AirDropToken />}
        {tab === "NFT" && <AirDropNFT />}
      </Web3Wrapper>
    </div>
  );
};
