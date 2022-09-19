import { useAccount, useNetwork } from "wagmi";
import { useTokenPortfolio } from "../Web3/hooks/useTokenPortfolio";
import { SelectToken } from "../Inputs/SelectToken";
import { useState } from "react";
import { Balance } from "../Web3/Balance";
import { defaultTokenOptions } from "../../../utils/defaultTokenOptions";

export const AirDropToken = () => {
  const { chain } = useNetwork();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [token, setToken] = useState("native");
  const nativeToken =
    chain && Object.keys(defaultTokenOptions).includes(chain.name)
      ? defaultTokenOptions[chain.name][0]
      : { token: "native", tokenImg: "", contractAddress: "native" };
  const tokenOptions = [
    nativeToken,
    ...(chain && address ? useTokenPortfolio(chain, address) : []),
  ];
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Airdrop Token</h2>
        {isConnecting && <div>Connecting...</div>}
        {isDisconnected && <div>Please connect your wallet to continue.</div>}
        {address && (
          <div>
            <SelectToken
              token={token}
              setToken={setToken}
              tokenOptions={tokenOptions}
            />
            <span className="label-text text-gray-400">
              <Balance address={address} token={token} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
