import { useContractRead, erc721ABI } from "wagmi";

export const NFTCollection = (props: { address: string }) => {
  const { data, isError, isLoading } = useContractRead({
    addressOrName: props.address,
    contractInterface: erc721ABI,
    functionName: "balanceOf",
    args: [props.address],
  });
  return (
    <>
      {isLoading && <div>Fetching data...</div>}
      {isError && (
        <div>
          Cannot load your NFT balance, please double check your contract
          address.
        </div>
      )}
      {data && console.log(data)}
    </>
  );
};
