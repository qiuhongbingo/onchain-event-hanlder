import { StaticJsonRpcProvider } from '@ethersproject/providers'

export const baseProvider = new StaticJsonRpcProvider(
  {
    url: 'https://eth-mainnet.g.alchemy.com/v2/vjywjyMyiFj7POu2bEO1aGScfKsrBysK',
  },
  1
)
