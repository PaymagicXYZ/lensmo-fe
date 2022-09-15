import { Web3Wrapper } from "../Web3/Web3Wrapper";
import { useAccount, useNetwork } from "wagmi";
import { useState, useEffect } from "react";
import { Input } from "../Inputs/Input";
import { NFTCollection } from "../Web3/NFTCollection";
import { TransferERC721 } from "../Web3/Transfer";
import { getWallet } from "../../../utils/getWallet";

const chainForCenterChainName = {
  matic: "polygon-mainnet",
};
type Chain = keyof typeof chainForCenterChainName;

const Wallet = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const [contract, setContract] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [id, setId] = useState("");
  const { chain } = useNetwork();
  const handleSend = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const form = (e.target as HTMLElement).parentElement as HTMLFormElement;
    const id = (form[2] as HTMLInputElement).value;
    setId(id);
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
    console.log(import.meta.env.PUBLIC_CENTER_API_KEY);
    const chainName = chain && chainForCenterChainName[chain.network as Chain];
    const endpoint = `https://api.center.dev/v1/${chainName}/account/${address}/assets-owned`;
    fetch(endpoint, {
      method: "GET",
      headers: {
        "X-API-Key": import.meta.env.PUBLIC_CENTER_API_KEY,
      },
    }).then((res) => {
      res.json().then((data) => {
        console.log(data);
      });
    });
  }, [address, chain]);
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
          {contract && (
            <>
              <p>
                {contract.substring(0, 4)}...
                {contract.substring(contract.length - 4)}
              </p>
              <NFTCollection address={contract} />
              <Input label="Enter Your NFT ID" placeholder="NFT ID" />
              {destinationAddress && id && address ? (
                <TransferERC721
                  from={address}
                  contract={contract}
                  to={destinationAddress}
                  id={id}
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

export const TransferNFT = () => {
  return (
    <Web3Wrapper>
      <Wallet />
    </Web3Wrapper>
  );
};
