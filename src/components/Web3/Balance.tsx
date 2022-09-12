import { useBalance } from "wagmi";
import { Input } from "../Inputs/Input";

export const Balance = (props: { address: string; token: string }) => {
  const { data, isError, isLoading } = useBalance({
    addressOrName: props.address,
    token: props.token,
  });
  return (
    <>
      {isLoading && <span>Loading balance...</span>}
      {isError && (
        <span>
          An error occurred loading your balance. Please double check your
          contract address.
        </span>
      )}
      {data && (
        <>
          <span>
            Balance: {data.formatted} {data.symbol}
          </span>
          <Input
            label="Enter Amount"
            placeholder="Your Amount"
            rightIcon={data.symbol}
          />
        </>
      )}
    </>
  );
};
