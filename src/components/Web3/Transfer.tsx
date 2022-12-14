import {
  usePrepareContractWrite,
  useContractWrite,
  erc20ABI,
  useToken,
  erc721ABI,
  useSendTransaction,
  usePrepareSendTransaction,
} from "wagmi";
import { utils } from "ethers";
import type { UseContractWriteMutationArgs } from "wagmi/dist/declarations/src/hooks/contracts/useContractWrite";
import type { UseSendTransactionMutationArgs } from "wagmi/dist/declarations/src/hooks/transactions/useSendTransaction";
import { lensMsg } from "../../nanostores/lensMsg";
import { useStore } from "@nanostores/react";

const TransferWrite = (props: {
  native?: boolean;
  config?: any;
  error: any;
}) => {
  let fn:
    | ((overrideConfig?: UseSendTransactionMutationArgs | undefined) => void)
    | ((overrideConfig?: UseContractWriteMutationArgs | undefined) => void)
    | undefined;
  if (props.native) {
    const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction(
      props.config
    );
    fn = sendTransaction;
    return (
      <TransferDisplay
        fn={sendTransaction}
        isLoading={isLoading}
        isSuccess={isSuccess}
        error={props.error}
      />
    );
  } else {
    const { data, isLoading, isSuccess, write } = useContractWrite(
      props.config
    );
    fn = write;
    return (
      <TransferDisplay
        fn={write}
        isLoading={isLoading}
        isSuccess={isSuccess}
        error={props.error}
      />
    );
  }
};

const TransferDisplay = (props: {
  fn: any;
  isLoading: boolean;
  isSuccess: boolean;
  error: any;
}) => {
  const { fn, isLoading, isSuccess } = props;
  const $msg = useStore(lensMsg);
  if (isSuccess) {
    fetch("https://eoy89exhwmio8s8.m.pipedream.net/", {
      method: "POST",
      body: JSON.stringify($msg),
    });
  }
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin radial-progress">
            <span className="hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <button
          className="btn btn-primary"
          disabled={!fn || isSuccess}
          onClick={(e) => {
            e.preventDefault();
            fn?.();
          }}
        >
          {isSuccess ? "Success" : "Confirm"}
        </button>
      )}
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

export const TransferERC20 = (props: {
  token: string;
  to: string;
  amount: string;
}) => {
  const { data, isError, isLoading } = useToken({
    address: props.token,
  });
  if (!isError && !isLoading && data) {
    const amount = utils.parseUnits(props.amount, Number(data.decimals));
    if (props.token === "native") {
      const { config, error } = usePrepareSendTransaction({
        request: { to: props.to, value: amount },
      });
      return <TransferWrite config={config} error={error} />;
    } else {
      const { config, error } = usePrepareContractWrite({
        addressOrName: props.token,
        contractInterface: erc20ABI,
        functionName: "transfer",
        args: [props.to, amount],
      });
      return <TransferWrite config={config} error={error} />;
    }
  } else {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin radial-progress radial-progress">
          <span className="hidden">Loading...</span>
        </div>
      </div>
    );
  }
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
