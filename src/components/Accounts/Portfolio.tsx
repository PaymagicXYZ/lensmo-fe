import { useEffect, useState } from "react";
import {
  getTokenPortfolio,
  TokenPortfolio,
} from "../../hooks/useTokenPortfolio";
import { utils } from "ethers";

export const Portfolio = (props: {
  wallet: string;
  //   chain: { name: string };
}) => {
  const [portfolio, setPortfolio] = useState<TokenPortfolio>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getTokenPortfolio({ name: "Polygon" }, props.wallet).then((portfolio) => {
      setPortfolio(portfolio);
      setIsLoading(false);
    });
  });
  return (
    <div className="overflow-x-auto w-full">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin radial-progress">
            <span className="hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <table className="table w-full">
          <thead>
            <tr>
              <th>Token</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {portfolio
              .filter((t) => t.balance > 0)
              .map((token) => (
                <tr>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={token.tokenImg} alt={token.token} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{token.token}</div>
                        <div className="text-sm opacity-50">{token.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {utils.formatUnits(token.balance, token.decimals)}
                    <br />
                    <span className="badge badge-ghost badge-sm">
                      ${token.quote.toPrecision(2)}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
