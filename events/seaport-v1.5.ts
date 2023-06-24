import { Interface } from '@ethersproject/abi'
import { EventData } from '../types'

export const orderFulfilled: EventData = {
  kind: 'seaport-v1.5',
  subKind: 'seaport-v1.5-order-filled',
  addresses: {
    0x00000000000000adc04c56bf30ac9d3c0aaf14dc: true,
  },
  topic: '0x9d9af8e38d66c62e2c12f0225249fd9d721c54b83f48d9352c97c6cacdcb6f31',
  numTopics: 3,
  abi: new Interface([
    `event OrderFulfilled(
      bytes32 orderHash,
      address indexed offerer,
      address indexed zone,
      address recipient,
      (
        uint8 itemType,
        address token,
        uint256 identifier,
        uint256 amount
      )[] offer,
      (
        uint8 itemType,
        address token,
        uint256 identifier,
        uint256 amount,
        address recipient
      )[] consideration
    )`,
  ]),
}
