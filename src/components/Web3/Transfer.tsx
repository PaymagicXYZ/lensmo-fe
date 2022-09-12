import {
  usePrepareContractWrite,
  useContractWrite,
  erc20ABI,
  erc721ABI,
} from "wagmi";

export const Transfer = (props: {
  token: string;
  to: string;
  amount: string;
  interface: "erc20" | "erc721";
}) => {
  const { config, error } = usePrepareContractWrite({
    addressOrName: props.token,
    contractInterface: props.interface === "erc20" ? erc20ABI : erc721ABI,
    functionName: props.interface === "erc20" ? "transfer" : "transferFrom",
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
};
