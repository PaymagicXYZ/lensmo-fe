import {
  usePrepareContractWrite,
  useContractWrite,
  useContractReads,
  erc721ABI,
} from "wagmi";
import disperseNFTContract from "../../../utils/contracts/DisperseNFT.json";
import { lensMsg } from "../../nanostores/lensMsg";
import { useStore } from "@nanostores/react";

export const HandleDisperse = (props: {
  NFTContract: string;
  spender: string;
  addresses: string[];
  idArray: number[];
}) => {
  const { config, error } = usePrepareContractWrite({
    addressOrName: props.spender,
    contractInterface: disperseNFTContract.abi,
    functionName: "disperseTokenERC721",
    args: [props.NFTContract, props.addresses, props.idArray],
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

export const DisperseNFT = (props: {
  NFTContract: string;
  owner: string;
  spender: string;
  addresses: string[];
  idArray: number[];
}) => {
  const { config, error } = usePrepareContractWrite({
    addressOrName: props.NFTContract,
    contractInterface: erc721ABI,
    functionName: "setApprovalForAll",
    args: [props.spender, true],
  });
  const { write, data, isLoading, isSuccess } = useContractWrite(config);
  const $msg = useStore(lensMsg);
  if (isSuccess) {
    fetch("https://eoy89exhwmio8s8.m.pipedream.net/", {
      method: "POST",
      body: JSON.stringify($msg),
    });
  }
  return (
    <>
      {isSuccess ? (
        <HandleDisperse
          NFTContract={props.NFTContract}
          spender={props.spender}
          addresses={props.addresses}
          idArray={props.idArray}
        />
      ) : (
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
      )}
    </>
  );
};
