import { useAccount, useNetwork } from "wagmi";
import { useTokenPortfolio } from "../Web3/hooks/useTokenPortfolio";
import { SelectToken } from "../Inputs/SelectToken";
import { useState, useEffect } from "react";
import { Balance } from "../Web3/Balance";
import { defaultTokenOptions } from "../../../utils/defaultTokenOptions";
import { getWallet } from "../../../utils/getWallet";
import { utils } from "ethers";
import { DISPERSE_CONTRACTS } from "../../../utils/contracts";

export const AirDropToken = () => {
  const { chain } = useNetwork();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [token, setToken] = useState("add");
  const [showBulk, setShowBulk] = useState(false);
  const [recipients, setRecipients] = useState<
    { user: string; amount: string }[]
  >([]);
  const [amount, setAmount] = useState(0);
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
  const handleBulk = (e: any) => {
    const input = document.getElementById("bulkInput") as HTMLInputElement;
    setRecipients(recipients.concat(JSON.parse(input.value)));
    input.value = "";
  };
  const handleApprove = async (e: any) => {
    const Txs = Promise.all(
      recipients.map(async (recipient) => {
        return {
          to: await getWallet(recipient.user),
          value: recipient.amount,
        };
      })
    );
    const disperseContract =
      chain &&
      DISPERSE_CONTRACTS[chain.name as keyof typeof DISPERSE_CONTRACTS];
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
              <button type="submit" className="btn btn-primary">
                Add
              </button>
            </form>
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
                setShowBulk(!showBulk);
              }}
            >
              {showBulk ? <span>&darr;</span> : <span>&rarr;</span>} Bulk Add
            </p>
            {showBulk && (
              <>
                <textarea
                  id="bulkInput"
                  className="textarea h-24 textarea-bordered"
                />
                <a onClick={handleBulk} className="btn btn-primary">
                  Bulk Add
                </a>
              </>
            )}
          </div>
        )}
      </div>
      {token !== "add" && (
        <a onClick={handleApprove} className="btn btn-primary">
          Approve {amount}{" "}
          {tokenOptions.filter((t) => t.contractAddress == token)[0].token} for
          airdrop
        </a>
      )}
    </div>
  );
};
