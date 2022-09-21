import {
  usePrepareContractWrite,
  useContractWrite,
  useContractReads,
  erc20ABI,
} from "wagmi";
import disperseContract from "../../../utils/contracts/Disperse.json";

const SimpleDisperse = (props: {
  native?: boolean;
  config?: any;
  error: any;
}) => {
  const { write } = useContractWrite(props.config);
  return (
    <>
      <button
        className="btn btn-primary"
        disabled={!write}
        onClick={() => write?.()}
      >
        Start AirDrop
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

export const DisperseTokens = (props: {
  token: string;
  owner: string;
  spender: string;
  amount: string;
  addresses: string[];
  valueArray: string[];
}) => {
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        addressOrName: props.token,
        contractInterface: erc20ABI,
        functionName: "allowance",
        args: [props.owner, props.spender],
      },
    ],
  });
  const { config, error } = usePrepareContractWrite({
    addressOrName: props.spender,
    contractInterface: disperseContract.abi,
    functionName: "disperseTokenSimple",
    args: [props.token, props.addresses, props.valueArray],
  });
  if (!isError && !isLoading && data) {
    // const [allowance] = data;
    // if (Number(allowance) >= Number(props.amount)) {

    return <SimpleDisperse config={config} error={error} />;
    // } else {
    //   return <div>Waiting for the approval...</div>;
    // }
  } else {
    return <div>Loading...</div>;
  }
};
