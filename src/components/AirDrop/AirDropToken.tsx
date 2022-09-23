import { useAccount, useNetwork } from "wagmi";
import { useTokenPortfolio } from "../../hooks/useTokenPortfolio";
import { SelectToken } from "../Inputs/SelectToken";
import React, { useState, useEffect } from "react";
import { Balance } from "../Web3/Balance";
// import { defaultTokenOptions } from "../../../utils/defaultTokenOptions";
import { getWallet } from "../../../utils/getWallet";
import { DISPERSE_CONTRACTS } from "../../../utils/contracts";
import { DisperseTokens } from "../Web3/Disperse";

export const AirDropToken = () => {
  const { chain } = useNetwork();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [token, setToken] = useState("add");
  const [showIndividual, setShowIndividual] = useState(false);
  const [recipients, setRecipients] = useState<
    { user: string; amount: string }[]
  >([]);
  const [amount, setAmount] = useState(0);
  const disperseContract =
    chain && DISPERSE_CONTRACTS[chain.name as keyof typeof DISPERSE_CONTRACTS];
  // const nativeToken =
  //   chain && Object.keys(defaultTokenOptions).includes(chain.name)
  //     ? defaultTokenOptions[chain.name][0]
  //     : { token: "native", tokenImg: "", contractAddress: "native" };
  const tokenOptions: {
    token: string;
    contractAddress: string;
    tokenImg: string;
  }[] = [
    // nativeToken,
    ...(chain && address ? useTokenPortfolio(chain, address) : []),
  ];
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const user = (form[0] as HTMLInputElement).value;
    const amount = (form[1] as HTMLInputElement).value;
    setRecipients([...recipients, { user, amount }]);
    (form[0] as HTMLInputElement).value = "";
    (form[1] as HTMLInputElement).value = "";
  };
  const handleStart = (e: any) => {
    const input = document.getElementById("bulkInput") as HTMLInputElement;
    setRecipients(recipients.concat(JSON.parse(input.value)));
    input.value = "";
  };
  const [parsedTx, setParsedTx] = useState<{ to: string[]; value: string[] }>({
    to: [],
    value: [],
  });
  const handleApprove = async (e: any) => {
    const Txs = Promise.all(
      recipients.map(async (recipient) => {
        return {
          to: await getWallet(recipient.user),
          value: recipient.amount,
        };
      })
    );
    setParsedTx({
      to: (await Txs).map((tx) => tx.to),
      value: (await Txs).map((tx) => tx.value),
    });
    e.target.className = "hidden";
  };

  useEffect(() => {
    const totalValue = recipients.reduce(
      (acc, tx) => acc + Number(tx.amount),
      0
    );
    setAmount(totalValue);
  }, [recipients]);
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Airdrop Token</h2>
        {isConnecting && <div>Connecting...</div>}
        {isDisconnected && <div>Please connect your wallet to continue.</div>}
        {address && (
          <div>
            <h2>Select Your Token</h2>
            <SelectToken
              token={token}
              setToken={setToken}
              tokenOptions={tokenOptions}
              hideAmount={true}
            />
            {token !== "add" && (
              <span className="label-text text-gray-400">
                <Balance address={address} token={token} />
              </span>
            )}
            <textarea
              id="bulkInput"
              placeholder='e.g. [{"user":"twitter:elonmusk","amount":"1"}, {"user":"github:yyx990803","amount":"1"}]'
              className="textarea h-24 textarea-bordered w-full"
            />
            {recipients &&
              recipients.map((tx, i) => (
                <div key={i}>
                  <span
                    style={{
                      color: "red",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      delete recipients[i];
                      setRecipients(recipients.filter((r) => r !== undefined));
                    }}
                  >
                    ×
                  </span>
                  Recipient{i + 1}:<p key={i}>{JSON.stringify(tx)}</p>{" "}
                </div>
              ))}
            <p
              onClick={() => {
                setShowIndividual(!showIndividual);
              }}
            >
              {showIndividual ? <span>&darr;</span> : <span>&rarr;</span>}
              Add Individual Recipients
            </p>
            {showIndividual && (
              <>
                <h2>Recipients</h2>
                <form onSubmit={handleSubmit}>
                  <label className="input-group">
                    <span>User</span>
                    <input
                      type="text"
                      placeholder="platform:username"
                      className="input input-bordered"
                    />
                  </label>
                  <label className="input-group">
                    <span>Amount</span>
                    <input
                      type="number"
                      placeholder="enter your amount"
                      className="input input-bordered"
                    />
                  </label>
                  <button type="submit" className="btn btn-primary ">
                    Add
                  </button>
                </form>
              </>
            )}
            <button
              onClick={handleStart}
              className="btn btn-primary w-full"
              disabled={token == "add"}
            >
              Parse JSON
            </button>
          </div>
        )}
      </div>
      {token !== "add" && recipients.length > 0 && (
        <a onClick={handleApprove} className="btn btn-primary">
          Approve {amount}{" "}
          {tokenOptions.filter((t) => t.contractAddress == token)[0].token} for
          airdrop
        </a>
      )}
      {parsedTx.to.length > 0 && disperseContract && address && (
        <DisperseTokens
          token={token}
          owner={address}
          spender={disperseContract}
          amount={String(amount)}
          addresses={parsedTx.to}
          valueArray={parsedTx.value}
        />
      )}
    </div>
  );
};
