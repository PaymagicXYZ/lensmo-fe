export type TokenOption = {
  token: string;
  tokenImg: string;
  contractAddress: string;
};
export const defaultTokenOptions: { [key: string]: TokenOption[] } = {
  Polygon: [
    {
      token: "USDT",
      tokenImg:
        "https://www.coinopsy.com/media/img/quality_logo/tether-usdt.png",
      contractAddress: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    },
    {
      token: "USDC",
      tokenImg:
        "https://www.coinopsy.com/media/img/quality_logo/usd-coin-usdc.png",
      contractAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    },
    {
      token: "DAI",
      tokenImg: "https://www.coinopsy.com/media/img/quality_logo/Dai.png",
      contractAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    },
    {
      token: "WETH",
      tokenImg:
        "https://static.debank.com/image/project/logo_url/weth/5611c10271b5e9ab32b7d379cdf68a0e.png",
      contractAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    },
  ],
};
