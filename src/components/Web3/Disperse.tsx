import {
  usePrepareContractWrite,
  useContractWrite,
  useContractReads,
  erc20ABI,
} from "wagmi";
import disperseContract from "../../../utils/contracts/Disperse.json";
import { utils, BigNumber } from "ethers";

const SimpleDisperse = (props: {
  token: string;
  spender: string;
  addresses: string[];
  valueArray: BigNumber[];
}) => {
  const { config, error } = usePrepareContractWrite({
    addressOrName: props.spender,
    contractInterface: disperseContract.abi,
    functionName: "disperseTokenSimple",
    args: [props.token, props.addresses, props.valueArray],
  });
  const { write, isLoading, isSuccess } = useContractWrite(config);
  return (
    <button
      className="btn btn-primary"
      disabled={!write || isLoading || isSuccess}
      onClick={() => write?.()}
    >
      {isSuccess
        ? "AirDrop Success!"
        : isLoading
        ? "Starting AirDrop..."
        : "Start AirDrop"}
    </button>
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
        functionName: "decimals",
      },
      {
        addressOrName: props.token,
        contractInterface: erc20ABI,
        functionName: "allowance",
        args: [props.owner, props.spender],
      },
    ],
  });
  if (!isError && !isLoading && data) {
    const [decimals, allowance] = data;
    const amount = utils.parseUnits(props.amount, Number(decimals));
    const valueArray = props.valueArray.map((value) =>
      utils.parseUnits(value, Number(decimals))
    );
    return (
      <>
        {Number(allowance) >= Number(amount) ? (
          <SimpleDisperse
            token={props.token}
            spender={props.spender}
            addresses={props.addresses}
            valueArray={valueArray}
          />
        ) : (
          <DisperseApproval
            token={props.token}
            spender={props.spender}
            addresses={props.addresses}
            valueArray={valueArray}
            allowance={Number(allowance)}
            amount={amount}
          />
        )}
      </>
    );
  } else {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin radial-progress">
          <span className="hidden">Loading...</span>
        </div>
      </div>
    );
  }
};

export const DisperseApproval = (props: {
  token: string;
  spender: string;
  addresses: string[];
  valueArray: BigNumber[];
  allowance: number;
  amount: BigNumber;
}) => {
  const { config, error } = usePrepareContractWrite({
    addressOrName: props.token,
    contractInterface: erc20ABI,
    functionName: "approve",
    args: [props.spender, props.amount],
  });
  const { write, data, isLoading, isSuccess } = useContractWrite(config);
  return (
    <>
      {isSuccess && (
        <SimpleDisperse
          token={props.token}
          spender={props.spender}
          addresses={props.addresses}
          valueArray={props.valueArray}
        />
      )}
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
    </>
  );
};
