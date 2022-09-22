import {
  usePrepareContractWrite,
  useContractWrite,
  erc20ABI,
  useToken,
} from "wagmi";
import { utils } from "ethers";

const ApproveWrite = (props: {
  native?: boolean;
  config?: any;
  error: any;
}) => {
  const { write, data, isLoading, isSuccess } = useContractWrite(props.config);
  return (
    <>
      <button
        className="btn btn-primary"
        id="approve-status"
        disabled={!write || isLoading || isSuccess}
        onClick={() => write?.()}
      >
        {isSuccess ? (
          <>
            Approval Success{" "}
            <div
              className="tooltip"
              data-tip={`Transaction: ${JSON.stringify(data)}`}
            >
              ℹ️
            </div>
          </>
        ) : isLoading ? (
          "Waiting for approval..."
        ) : (
          "Confirm"
        )}
      </button>
      {props.error && (
        <div className="collapse">
          <input type="checkbox" />
          <div className="mt-8 collapse-title alert alert-warning shadow-lg">
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

export const ApproveERC20 = (props: {
  token: string;
  spender: string;
  amount: string;
}) => {
  const { data, isError, isLoading } = useToken({
    address: props.token,
  });
  if (!isError && !isLoading && data) {
    const value = utils.parseUnits(props.amount, Number(data.decimals));
    const { config, error } = usePrepareContractWrite({
      addressOrName: props.token,
      contractInterface: erc20ABI,
      functionName: "approve",
      args: [props.spender, value],
    });
    return <ApproveWrite config={config} error={error} />;
  } else {
    return <div>Loading...</div>;
  }
};
