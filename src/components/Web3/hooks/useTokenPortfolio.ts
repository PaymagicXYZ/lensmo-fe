import { useEffect, useState } from "react";

export const useTokenPortfolio = (chain: { name: string }, address: string) => {
  const [token, setToken] = useState([]);
  useEffect(() => {
    if (address && chain) {
      const chainNameForId = {
        Polygon: 137,
      };
      const chainId = chainNameForId[chain.name as keyof typeof chainNameForId];
      const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?key=${
        import.meta.env.PUBLIC_COVALENT_API_KEY
      }`;
      fetch(url).then((res) => {
        res.json().then((data) => {
          setToken(
            data.data.items.map(
              (item: {
                contract_ticker_symbol: string;
                logo_url: string;
                contract_address: string;
              }) => {
                return {
                  token: item.contract_ticker_symbol,
                  tokenImg: item.logo_url,
                  contractAddress: item.contract_address,
                };
              }
            )
          );
        });
      });
    }
  }, [address, chain]);
  return token;
};
