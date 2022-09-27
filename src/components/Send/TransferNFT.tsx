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
  const [destinationAddress, setDestinationAddress] = useState("");
  const [NFTList, setNFTList] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState({
    contract: "",
    tokenId: "",
  });
  const { chain } = useNetwork();
  const handleSend = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const form = (e.target as HTMLElement).parentElement as HTMLFormElement;
    const id = (form[2] as HTMLInputElement).value;
    const message = (form[3] as HTMLInputElement).value;
    setSelectedNFT({
      contract: selectedNFT.contract,
      tokenId: id,
    });
    const username =
      document.getElementById("username")!.textContent?.trim() || "";
    getWallet(username).then((wallet) => {
      setDestinationAddress(wallet);
      fetch("https://eoy89exhwmio8s8.m.pipedream.net/", {
        method: "POST",
        body: JSON.stringify({
          username,
          message,
          amount: "#" + id,
          from: address,
          recipient: wallet,
          token:
            selectedNFT.contract.substring(0, 4) +
            "..." +
            selectedNFT.contract.substring(37),
        }),
      });
    });
  };
  const chainName = chain && chainForCenterChainName[chain.network as Chain];
  const endpoint = `https://api.center.dev/v1/${chainName}/account/${address}/assets-owned?limit=12`;
  useEffect(() => {
    fetch(endpoint, {
      method: "GET",
      headers: {
        "X-API-Key": import.meta.env.PUBLIC_CENTER_API_KEY,
      },
    }).then((res) => {
      res.json().then((data) => {
        setNFTList(data.items);
      });
    });
  }, [address, chain]);
  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const contract = (form[0] as HTMLInputElement).value;
    new RegExp("^0x[a-fA-F0-9]{40}$").test(contract) &&
      setSelectedNFT({
        contract,
        tokenId: selectedNFT.tokenId,
      });
  };
  const handleSelect = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const NFT: { address: string; tokenId: string } =
      NFTList[Number((e.target as HTMLInputElement).value)];
    setSelectedNFT({
      contract: NFT.address,
      tokenId: NFT.tokenId,
    });
  };
  const [offset, setOffset] = useState(0);
  const handleLoadMore = () => {
    const newEndpoint = `${endpoint}&offset=${offset}`;
    fetch(newEndpoint, {
      method: "GET",
      headers: {
        "X-API-Key": import.meta.env.PUBLIC_CENTER_API_KEY,
      },
    }).then((res) => {
      res.json().then((data) => {
        setNFTList(NFTList.concat(data.items));
        setOffset(offset + 12);
      });
    });
  };
  return (
    <>
      {isConnecting && <div>Connecting...</div>}
      {isDisconnected && <div>Please connect your wallet to continue.</div>}
      {address && (
        <form
          className="form-control"
          onSubmit={handleAdd}
          onChange={handleSelect}
        >
          <label className="label">
            <span className="label-text">NFT Collection</span>
          </label>
          {NFTList.length > 0 && (
            <>
              <NFTCollection NFTList={NFTList} />
              <a onClick={handleLoadMore} className="cursor-pointer">
                Load more
              </a>
            </>
          )}
          <Input
            label="Enter Contract Address"
            placeholder={selectedNFT.contract}
            rightIcon={<button type="submit">Add</button>}
          />
          {selectedNFT.contract && (
            <>
              <Input
                label="Enter Your NFT ID"
                placeholder={selectedNFT.tokenId}
              />
              <Input placeholder="Comment" />
              {destinationAddress && selectedNFT.tokenId && address ? (
                <TransferERC721
                  from={address}
                  contract={selectedNFT.contract}
                  to={destinationAddress}
                  id={selectedNFT.tokenId}
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
