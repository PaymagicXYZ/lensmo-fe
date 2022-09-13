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
      tokenImg: "https://polygonscan.com/token/images/WETH_32.png",
      contractAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    },
    {
      token: "BNB",
      tokenImg: "https://polygonscan.com/token/images/bnb_28_2.png",
      contractAddress: "0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3",
    },
  ],
};
