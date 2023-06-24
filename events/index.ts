import * as erc721 from './erc721'
import * as erc1155 from './erc1155'
import * as seaportV15 from './seaport-v1.5'

const allEventData = [
  erc721.transfer,
  erc1155.transferSingle,
  erc1155.transferBatch,
  seaportV15.orderFulfilled,
]

export const getEventData = (subKind: string) => {
  return allEventData.find((event) => event.subKind === subKind)!
}
