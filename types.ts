import { Interface } from '@ethersproject/abi'

export type EventKind = 'erc721' | 'erc1155' | 'seaport-v1.5'

export type EventSubKind =
  | 'erc721-transfer'
  | 'erc1155-transfer-single'
  | 'erc1155-transfer-batch'
  | 'seaport-v1.5-order-filled'
  | 'seaport-v1.5-order-matched'

export type EventData = {
  kind: EventKind
  subKind: EventSubKind
  addresses?: { [address: string]: boolean }
  topic: string
  numTopics: number
  abi: Interface
}

export type EventLog = {
  subKind: EventSubKind
  log: {
    blockTimestamp: number
    blockNumber: number
    blockHash: string
    transactionIndex: number
    address: string
    data: string
    topics: string[]
    transactionHash: string
    logIndex: number
  }
}

export type EventsByKind = {
  kind: EventKind
  data: EventLog[]
}

export type EventsBatch = {
  id: string
  events: EventsByKind[]
}

export enum ItemType {
  NATIVE,
  ERC20,
  ERC721,
  ERC1155,
  ERC721_WITH_CRITERIA,
  ERC1155_WITH_CRITERIA,
}

export type SpentItem = {
  itemType: ItemType
  token: string
  identifier: string
  amount: string
}

export type ReceivedItem = {
  itemType: ItemType
  token: string
  identifier: string
  amount: string
  recipient: string
}
