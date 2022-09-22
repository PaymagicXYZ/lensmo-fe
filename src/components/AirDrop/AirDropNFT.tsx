import { useAccount, useNetwork } from "wagmi";
import React, { useState, useEffect } from "react";
import { getWallet } from "../../../utils/getWallet";
import { DISPERSENFT_CONTRACTS } from "../../../utils/contracts";
// import { disperseNFT } from "../Web3/DisperseNFT";
import { Input } from "../Inputs/Input";

export const AirDropNFT = () => {
  const { chain } = useNetwork();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [NFTContract, setNFTContract] = useState("");
  const [showIndividual, setShowIndividual] = useState(false);
  const [recipients, setRecipients] = useState<{ user: string; id: string }[]>(
    []
  );
  const [selectedNFT, setSelectedNFT] = useState({
    contract: "",
    tokenId: "",
  });
  const disperseNFTContract =
    chain &&
    DISPERSENFT_CONTRACTS[chain.name as keyof typeof DISPERSENFT_CONTRACTS];
  const handleAdd = (e: any) => {
    e.preventDefault();
    const input = e.target[0].value;
    setNFTContract(input);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const user = (form[0] as HTMLInputElement).value;
    const id = (form[1] as HTMLInputElement).value;
    setRecipients([...recipients, { user, id }]);
    (form[0] as HTMLInputElement).value = "";
    (form[1] as HTMLInputElement).value = "";
  };
  const handleStart = (e: any) => {
    const input = document.getElementById("bulkInput") as HTMLInputElement;
    setRecipients(recipients.concat(JSON.parse(input.value)));
    input.value = "";
  };
  const [parsedTx, setParsedTx] = useState<{ to: string[]; id: string[] }>({
    to: [],
    id: [],
  });
  const handleApprove = async (e: any) => {
    const Txs = Promise.all(
      recipients.map(async (recipient) => {
        return {
          to: await getWallet(recipient.user),
          id: recipient.id,
        };
      })
    );
    setParsedTx({
      to: (await Txs).map((tx) => tx.to),
      id: (await Txs).map((tx) => tx.id),
    });
    e.target.className = "hidden";
  };

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Airdrop Token</h2>
        {isConnecting && <div>Connecting...</div>}
        {isDisconnected && <div>Please connect your wallet to continue.</div>}
        {address && (
          <div>
            <h2>Select Your NFT</h2>
            <form onSubmit={handleAdd}>
              <Input
                label="Enter Contract Address"
                placeholder={selectedNFT.contract || "0x..."}
                rightIcon={<button type="submit">Add</button>}
              />
            </form>
            <textarea
              id="bulkInput"
              placeholder='e.g. [{"user":"twitter:elonmusk","id":"1"}, {"user":"github:yyx990803","id":"2"}]'
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
                    <span>Id</span>
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
              disabled={NFTContract == "add"}
            >
              Parse JSON
            </button>
          </div>
        )}
      </div>
      {NFTContract !== "add" && recipients.length > 0 && (
        <a onClick={handleApprove} className="btn btn-primary">
          Approve NFTs for Airdrop
        </a>
      )}
      {/* {parsedTx.to.length > 0 && disperseNFTContract && address && (
        <DisperseNFT
          NFTContract
          owner={address}
          spender={disperseNFTContract}
          addresses={parsedTx.to}
          idArray={parsedTx.id}
        />
      )} */}
    </div>
  );
};
