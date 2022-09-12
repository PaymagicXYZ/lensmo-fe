import {
  usePrepareContractWrite,
  useContractWrite,
  erc20ABI,
  erc721ABI,
} from "wagmi";

export const TransferERC20 = (props: {
  token: string;
  to: string;
  amount: string;
}) => {
  const { config, error } = usePrepareContractWrite({
    addressOrName: props.token,
    contractInterface: erc20ABI,
    functionName: "transfer",
    args: [props.to, props.amount],
  });
  const { write } = useContractWrite(config);

  return (
    <>
      <button
        className="btn btn-primary"
        disabled={!write}
        onClick={() => write?.()}
      >
        Transfer
      </button>
      {error && (
        <div>An error occurred preparing the transaction: {error.message}</div>
      )}
    </>
  );
};
