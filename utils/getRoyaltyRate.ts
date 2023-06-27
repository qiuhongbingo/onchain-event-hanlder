import { Interface } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'
import { baseProvider } from './provider'

export const getRoyaltyRate = async (token: string, tokenId: string) => {
  const royaltyEngine = new Contract(
    '0x0385603ab55642cb4dd5de3ae9e306809991804f',
    new Interface([
      `
      function getRoyaltyView(
        address token,
        uint256 tokenId,
        uint256 value
      ) external view returns (
        address[] recipients,
        uint256[] amounts
      )
    `,
    ]),
    baseProvider
  )

  let amount = 0

  try {
    const { amounts } = await royaltyEngine.getRoyaltyView(
      token,
      tokenId,
      '1000000000000000000'
    )
    for (let i = 0; i < amounts.length; i++) {
      amount += Number(amounts[i]) / 1e18
    }
    console.log(token, amount)
  } catch {}

  return amount
}
