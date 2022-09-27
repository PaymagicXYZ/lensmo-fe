import { useBalance } from "wagmi";
import numeral from "numeral";

export const Balance = (props: { address: string; token: string }) => {
  const { data, isError, isLoading } =
    props.token == "native"
      ? useBalance({
          addressOrName: props.address,
        })
      : useBalance({
          addressOrName: props.address,
          token: props.token,
        });
  return (
    <>
      {isLoading && "Loading balance..."}
      {isError &&
        "An error occurred loading your balance. Please double check your contract address."}
      {data &&
        `Balance: ${numeral(data.formatted).format("0,0.00")} ${data.symbol}`}
    </>
  );
};
