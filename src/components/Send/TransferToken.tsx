import { Web3Wrapper } from "../Web3Wrapper";
import {
  useAccount,
  useBalance,
  usePrepareContractWrite,
  useContractWrite,
  erc20ABI,
} from "wagmi";

function Transfer(props: { token: string; to: string; amount: string }) {
  const { config, error } = usePrepareContractWrite({
    addressOrName: props.token,
    contractInterface: erc20ABI,
    functionName: "transfer",
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
}

const Wallet = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  return (
    <>
      {isConnecting && <div>Connecting...</div>}
      {isDisconnected && <div>Please connect your wallet to continue.</div>}
      {address && <div>Connected to {address}</div>}
    </>
  );
};

const Balance = (props: { address: string; token: string }) => {
  const { data, isError, isLoading } = useBalance({
    addressOrName: props.address,
    token: props.token,
  });
  return (
    <>
      {isLoading && <div>Loading balance...</div>}
      {isError && <div>An error occurred loading your balance.</div>}
      {console.log(data)}
    </>
  );
};
export const TransferToken = () => {
  return (
    <Web3Wrapper>
      <Wallet />
    </Web3Wrapper>
  );
};
