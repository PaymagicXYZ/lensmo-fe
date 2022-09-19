import { useState, useEffect } from "react";
import { Web3Wrapper } from "../Web3/Web3Wrapper";
import { useAccount, useNetwork } from "wagmi";
import {
  defaultTokenOptions,
  TokenOption,
} from "../../../utils/defaultTokenOptions";
import { Balance } from "../Web3/Balance";
import { TransferERC20 } from "../Web3/Transfer";
import { Input } from "../Inputs/Input";
import { getWallet } from "../../../utils/getWallet";

const TokenOptions = (props: { token: string; contractAddress: string }) => (
  <option
    value={props.contractAddress}
    disabled={props.contractAddress ? false : true}
  >
    {props.token}
  </option>
);

const Wallet = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  const [tokenOptions, setTokenOptions] = useState(
    chain && Object.keys(defaultTokenOptions).includes(chain.name)
      ? defaultTokenOptions[chain.name]
      : []
  );
  const [token, setToken] = useState("native");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [amount, setAmount] = useState("0");
  const handleChange = (e: { target: { value: string } }) => {
    setToken(e.target.value);
  };
  const handleAddToken = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const form = (e.target as HTMLButtonElement).form!;
    console.log(form[0] as HTMLOptionElement);
    // = (form[1] as HTMLInputElement).value;
    setToken((form[1] as HTMLInputElement).value);
  };
  const handleSend = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const amount = (
      (
        (e.target as HTMLElement).parentElement as HTMLFormElement
      )[1] as HTMLInputElement
    ).value;
    setAmount(amount);
    const username =
      document.getElementById("username")!.textContent?.trim() || "";
    if (new RegExp("^[lens|ens]").test(username)) {
      const wallet = document
        .getElementById("destination")!
        .textContent?.trim();
      setDestinationAddress(wallet!);
    } else {
      getWallet(username).then((wallet) => {
        setDestinationAddress(wallet);
      });
    }
  };
  useEffect(() => {
    if (address && chain) {
      const chainNameForId = {
        Polygon: 137,
      };
      const chainId = chainNameForId[chain.name as keyof typeof chainNameForId];
      const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?key=${
        import.meta.env.PUBLIC_COVALENT_API_KEY
      }`;
      fetch(url).then((res) => {
        res.json().then((data) => {
          setTokenOptions([
            ...tokenOptions,
            { token: "My Tokens", tokenImg: "", contractAddress: "" },
            ...data.data.items.map(
              (item: {
                contract_ticker_symbol: string;
                logo_url: string;
                contract_address: string;
              }) => {
                return {
                  token: item.contract_ticker_symbol,
                  tokenImg: item.logo_url,
                  contractAddress: item.contract_address,
                };
              }
            ),
          ]);
        });
      });
    }
  }, [address, chain]);
  return (
    <>
      {isConnecting && <div>Connecting...</div>}
      {isDisconnected && (
        <div class="my-4"> Please connect your wallet to continue.</div>
      )}
      {address && (
        <form className="form-control">
          <div className="my-4">
            <select className="select max-w-xs" disabled>
              <option value="0">Polygon</option>
            </select>
          </div>
          <div className="input-group bg-white!">
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
