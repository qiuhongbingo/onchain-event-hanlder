import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

export const bn = (value: BigNumberish) => BigNumber.from(value)

export const lc = (x: string) => x?.toLowerCase()

export const n = (x: any) => (x ? Number(x) : x)

export const s = (x: any) => (x ? String(x) : x)
