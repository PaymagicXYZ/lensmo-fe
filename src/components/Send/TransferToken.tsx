import { useState, useEffect } from "react";
import { Web3Wrapper } from "../Web3/Web3Wrapper";
import { useAccount, useNetwork } from "wagmi";
import {
  defaultTokenOptions,
  TokenOption,
} from "../../../utils/defaultTokenOptions";
import { Balance } from "../Web3/Balance";
import { TransferERC20 } from "../Web3/Transfer";
import { getWallet } from "../../../utils/getWallet";
import { useTokenPortfolio } from "../../hooks/useTokenPortfolio";
import { SelectToken } from "../Inputs/SelectToken";
import { lensMsg } from "../../nanostores/lensMsg";

const Wallet = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  const [tokenOptions, setTokenOptions] = useState(
    chain && Object.keys(defaultTokenOptions).includes(chain.name)
      ? defaultTokenOptions[chain.name]
      : []
  );

  const [destinationAddress, setDestinationAddress] = useState("");
  const [amount, setAmount] = useState("0");
  const [token, setToken] = useState("native");
  const handleSend = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const form = (e.target as HTMLElement).parentElement as HTMLFormElement;
    const amount = (form[1] as HTMLInputElement).value;
    const message = (form[2] as HTMLInputElement).value;
    setAmount(amount);
    const username =
      document.getElementById("username")!.textContent?.trim() || "";
    getWallet(username).then((wallet) => {
      setDestinationAddress(wallet);
      lensMsg.set({
        username,
        message,
        amount,
        from: address,
        recipient: wallet,
        token: tokenOptions.find((t) => t.contractAddress === token)?.token,
      });
    });
  };
  const portfolio = chain && address ? useTokenPortfolio(chain, address) : [];
  useEffect(() => {
    portfolio.length > 0 &&
      setTokenOptions([
        ...tokenOptions,
        { token: "My Tokens", tokenImg: "", contractAddress: "" },
        ...portfolio,
      ]);
  }, [portfolio]);

  return (
    <>
      {isConnecting && <div>Connecting...</div>}
      {isDisconnected && (
        <div className="my-4"> Please connect your wallet to continue.</div>
      )}
      {address && (
        <form className="form-control">
          <label className="label">
            <span className="label-text">Asset</span>
          </label>
          <SelectToken
            tokenOptions={tokenOptions}
            token={token}
            setToken={setToken}
          />
          {token && token != "add" && (
            <>
              {/* {token.length == 42
                ? `${token.substring(0, 4)}...${token.substring(
                    token.length - 4
                  )}`
                : token} */}
              <span className="label-text text-gray-400">
                <Balance address={address} token={token} />
              </span>
              <label className="input-group">
                <input
                  type="text"
                  placeholder="Comment"
                  className="input input-bordered w-full"
                />
              </label>
              {destinationAddress ? (
                <TransferERC20
                  token={token}
                  to={destinationAddress}
                  amount={amount}
                />
              ) : (
                <a className="btn btn-primary" onClick={(e) => handleSend(e)}>
                  Send
                </a>
              )}
            </>
          )}
        </form>
      )}
    </>
  );
};

export const TransferToken = () => {
  return (
    <Web3Wrapper>
      <Wallet />
    </Web3Wrapper>
  );
};
