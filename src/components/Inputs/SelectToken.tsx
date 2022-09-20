import { Input } from "./Input";
import type { Key } from "react";

const TokenOptions = (props: { token: string; contractAddress: string }) => (
  <option
    value={props.contractAddress}
    disabled={props.contractAddress ? false : true}
  >
    {props.token}
  </option>
);

export const SelectToken = (props: {
  tokenOptions: { token: string; contractAddress: string; tokenImg: string }[];
  token: string;
  setToken: (token: string) => void;
  hideAmount?: boolean;
}) => {
  const { tokenOptions, token, setToken } = props;
  const hideAmount = props.hideAmount ? true : false;
  const handleChange = (e: { target: { value: string } }) => {
    setToken(e.target.value);
  };
  const handleAddToken = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const form = (e.target as HTMLButtonElement).form!;
    setToken((form[1] as HTMLInputElement).value);
  };
  return (
    <>
      <div className="input-group">
        <span>
          <div className="w-10 avatar">
            {token &&
            token != "add" &&
            tokenOptions.filter(
              (e: { contractAddress: string }) => e.contractAddress == token
            ).length > 0 ? (
              <div className="rounded-full">
                <img
                  src={
                    tokenOptions.filter(
                      (e: { contractAddress: string }) =>
                        e.contractAddress == token
                    )[0].tokenImg
                  }
                />
              </div>
            ) : (
              "$"
            )}
          </div>
        </span>
        <select
          className="select"
          defaultValue="native"
          onChange={handleChange}
        >
          <option value="0" disabled>
            Select Token
          </option>
          {tokenOptions.map(
            (
              tokenOption: { token: string; contractAddress: string },
              Key: Key
            ) => (
              <TokenOptions key={Key} {...tokenOption} />
            )
          )}
          <option value="add">Custom Token</option>
        </select>
        {token && token !== "add" && !hideAmount && (
          <Input placeholder="Your Amount" type="number" />
        )}
      </div>
      {token == "add" && (
        <Input
          label="Enter Contract Address"
          placeholder="0x..."
          rightIcon={<button onClick={handleAddToken}>Add</button>}
        />
      )}
    </>
  );
};
