import { useEffect, useState } from "react";

type TokenPortfolio = {
  token: string;
  tokenImg: string;
  contractAddress: string;
  decimals: number;
  balance: number;
  quote: number;
  name: string;
}[];
export const getTokenPortfolio = async (
  chain: { name: string },
  address: string
): Promise<TokenPortfolio> => {
  const chainNameForId = {
    Polygon: 137,
  };
  const chainId = chainNameForId[chain.name as keyof typeof chainNameForId];
  const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?key=${
    import.meta.env.PUBLIC_COVALENT_API_KEY
  }`;
  const res = await fetch(url);
  const data = await res.json();
  return data.data.items.map(
    (item: {
      contract_ticker_symbol: string;
      logo_url: string;
      contract_address: string;
      contract_decimals: number;
      balance: number;
      quote: number;
      contract_name: string;
    }) => {
      return {
        token: item.contract_ticker_symbol,
        tokenImg: item.logo_url,
        contractAddress: item.contract_address,
        decimals: item.contract_decimals,
        balance: item.balance,
        quote: item.quote,
        name: item.contract_name,
      };
    }
  );
};

export const useTokenPortfolio = (chain: { name: string }, address: string) => {
  const [token, setToken] = useState<TokenPortfolio>([]);
  useEffect(() => {
    getTokenPortfolio(chain, address).then((data) => setToken(data));
  }, [address, chain]);
  return token;
};
