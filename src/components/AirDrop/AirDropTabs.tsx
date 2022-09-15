import { useState } from "react";
import { AirDropToken } from "./AirDropToken";
import { AirDropNFT } from "./AirDropNFT";

export const AirDropTabs = () => {
  const [tab, setTab] = useState("Token");
  const handleTabChange = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    setTab((e.target as HTMLElement).innerHTML);
  };
  return (
    <div className="flex flex-row">
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
      {tab === "Token" && <AirDropToken />}
      {tab === "NFT" && <AirDropNFT />}
    </div>
  );
};
