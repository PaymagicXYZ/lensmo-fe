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
import { useTokenPortfolio } from "../Web3/hooks/useTokenPortfolio";
import { SelectToken } from "../Inputs/SelectToken";

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
    const amount = (
      (
        (e.target as HTMLElement).parentElement as HTMLFormElement
      )[1] as HTMLInputElement
    ).value;
    setAmount(amount);
    const username =
      document.getElementById("username")!.textContent?.trim() || "";
    getWallet(username).then((wallet) => {
      setDestinationAddress(wallet);
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
        <div class="my-4"> Please connect your wallet to continue.</div>
      )}
      {address && (
        <form className="form-control">
          <label className="label">
            <span className="label-text">Asset</span>
          </label>
          <div className="input-group">
            <span>
              <div className="w-10 avatar">
                {token &&
                token != "add" &&
                tokenOptions.filter((e) => e.contractAddress == token).length >
                  0 ? (
                  <div className="rounded-full">
                    <img
                      src={
                        tokenOptions.filter(
                          (e) => e.contractAddress == token
                        )[0].tokenImg
                      }
                    />
                  </div>
                ) : (
                  "$"
                )}
              </div>
            </span>
            <select
              className="select"
              defaultValue="native"
              onChange={handleChange}
            >
              <option value="0" disabled>
                Select Token
              </option>
              {tokenOptions.map((tokenOption, Key) => (
                <TokenOptions key={Key} {...tokenOption} />
              ))}
              <option value="add">Custom Token</option>
            </select>
            {token && token !== "add" && (
              <Input placeholder="Your Amount" type="number" />
            )}
          </div>
          {token == "add" && (
            <Input
              label="Enter Contract Address"
              placeholder="0x..."
              rightIcon={<button onClick={handleAddToken}>Add</button>}
            />
          )}
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
