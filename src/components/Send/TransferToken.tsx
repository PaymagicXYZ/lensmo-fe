import { useState, useEffect, SetStateAction } from "react";
import { Web3Wrapper } from "../Web3Wrapper";
import {
  useAccount,
  useBalance,
  usePrepareContractWrite,
  useContractWrite,
  useNetwork,
  erc20ABI,
} from "wagmi";
import {
  defaultTokenOptions,
  TokenOption,
} from "../../../utils/defaultTokenOptions";

function Transfer(props: { token: string; to: string; amount: string }) {
  const { config, error } = usePrepareContractWrite({
    addressOrName: props.token,
    contractInterface: erc20ABI,
    functionName: "transfer",
  });
  const { write } = useContractWrite(config);

  return (
    <>
      <button disabled={!write} onClick={() => write?.()}>
        Feed
      </button>
      {error && (
        <div>An error occurred preparing the transaction: {error.message}</div>
      )}
    </>
  );
}

const TokenOptions = (props: { token: string; contractAddress: string }) => (
  <option value={props.token + ":" + props.contractAddress}>
    {props.token}
  </option>
);

const Wallet = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  const tokenOptions: TokenOption[] =
    chain && Object.keys(defaultTokenOptions).includes(chain.name)
      ? defaultTokenOptions[chain.name]
      : [];
  const [token, setToken] = useState("");
  const handleChange = (e: { target: { value: string } }) => {
    setToken(e.target.value);
  };
  return (
    <>
      {isConnecting && <div>Connecting...</div>}
      {isDisconnected && <div>Please connect your wallet to continue.</div>}
      {address && (
        <form className="form-control">
          <label className="label">
            <span className="label-text">Asset</span>
          </label>
          <div className="input-group">
            <span>
              <div className="w-10 avatar">
                {token && token != "add" ? (
                  <div className="rounded-full">
                    <img
                      src={
                        tokenOptions.filter(
                          (e) => e.token == token.split(":")[0]
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
              className="select select-bordered"
              defaultValue="0"
              onChange={handleChange}
            >
              <option value="0" disabled>
                Select Token
              </option>
              {tokenOptions.map((tokenOption, Key) => (
                <TokenOptions key={Key} {...tokenOption} />
              ))}
              <option value="add">Add Token</option>
            </select>
          </div>
          {token == "add" && (
            <Input label="Enter Contract Address" placeholder="0x..." />
          )}
          {token && token != "add" && (
            <Input
              label="Enter Amount"
              placeholder="10"
              rightIcon={token.split(":")[0]}
            />
          )}
        </form>
      )}
    </>
  );
};

const Balance = (props: { address: string; token: string }) => {
  const { data, isError, isLoading } = useBalance({
    addressOrName: props.address,
    token: props.token,
  });
  return (
    <>
      {isLoading && <div>Loading balance...</div>}
      {isError && <div>An error occurred loading your balance.</div>}
      {console.log(data)}
    </>
  );
};

const Input = (props: {
  label: string;
  placeholder: string;
  rightIcon?: JSX.Element | string;
}) => {
  return (
    <>
      <label className="label">
        <span className="label-text">{props.label}</span>
      </label>
      <label className="input-group">
        <input
          type="text"
          placeholder={props.placeholder}
          className="input input-bordered"
        />
        <span>{props.rightIcon}</span>
      </label>
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
