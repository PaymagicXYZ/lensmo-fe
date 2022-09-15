import {
  usePrepareContractWrite,
  useContractWrite,
  erc20ABI,
  useToken,
  erc721ABI,
} from "wagmi";
const TransferWrite = (props: { config: any; error: any }) => {
  const { write } = useContractWrite(props.config);

  return (
    <>
      <button
        className="btn btn-primary"
        disabled={!write}
        onClick={() => write?.()}
      >
        Confirm
      </button>
      {props.error && (
        <div className="collapse">
          <input type="checkbox" />
          <div className="collapse-title alert alert-warning shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Warning: Unable to proceed with this transaction</span>
            </div>
          </div>
          <div className="collapse-content">
            <p>{props.error.message}</p>
          </div>
        </div>
      )}
    </>
  );
};

export const TransferERC20 = (props: {
  token: string;
  to: string;
  amount: string;
}) => {
  const { data, isError, isLoading } = useToken({
    address: props.token,
  });
  const amount = data
    ? Number(props.amount) * 10 ** data.decimals
    : props.amount;
  const { config, error } = usePrepareContractWrite({
    addressOrName: props.token,
    contractInterface: erc20ABI,
    functionName: "transfer",
    args: [props.to, amount],
  });

  return <TransferWrite config={config} error={error} />;
};

export const TransferERC721 = (props: {
  from: string;
  contract: string;
  to: string;
  id: string;
}) => {
  const { config, error } = usePrepareContractWrite({
    addressOrName: props.contract,
    contractInterface: erc721ABI,
    functionName: "transferFrom",
    args: [props.from, props.to, props.id],
  });
  return <TransferWrite config={config} error={error} />;
};
