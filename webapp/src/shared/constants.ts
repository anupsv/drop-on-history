export const Constants = Object.freeze({
  EXPLORER_BASE_URL: "https://explorer.axiom.xyz/v2/goerli/query/",
  COVALENT_BASE_URI: "https://api.covalenthq.com/v1",
  COVALENT_API_KEY: process.env.COVALENT_API_KEY as string,
  UNISWAP_UNIV_ROUTER_GOERLI: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD".toLowerCase(),

  AUTO_AIRDROP_ADDR: "0x28da6cb528f2f66704c9ede5dda31ec2e07c2c1a",
  TOKEN_ADDR: "0xBC3015AfbACAa546813070Dcc518E1ab3474aC83",
  
  // Swap (address sender, address recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)
  EVENT_SCHEMA: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  ELIGIBLE_BLOCK_HEIGHT: 9747184,
})