import { Web3Wrapper } from "../Web3/Web3Wrapper";
import { useAccount, useNetwork } from "wagmi";
import { useState } from "react";
import { Input } from "../Inputs/Input";
import { NFTCollection } from "../Web3/NFTCollection";

const Wallet = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const [contract, setContract] = useState("");
  const { chain } = useNetwork();
  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const contract = ((e.target as HTMLFormElement)[0] as HTMLInputElement)
      .value;
    new RegExp("^0x[a-fA-F0-9]{40}$").test(contract) && setContract(contract);
  };
  return (
    <>
      {isConnecting && <div>Connecting...</div>}
      {isDisconnected && <div>Please connect your wallet to continue.</div>}
      {address && (
        <form className="form-control" onSubmit={handleAdd}>
          <label className="label">
            <span className="label-text">NFT Collection</span>
          </label>
          <Input
            label="Enter Contract Address"
            placeholder="0x..."
            rightIcon={<button type="submit">Add</button>}
          />
        </form>
      )}
      {contract && (
        <>
          <p>
            {contract.substring(0, 4)}...
            {contract.substring(contract.length - 4)}
          </p>
          <NFTCollection address={contract} />
        </>
      )}
    </>
  );
};

export const TransferNFT = () => {
  return (
    <Web3Wrapper>
      <Wallet />
    </Web3Wrapper>
  );
};
