import { processEventsBatch } from './handlers'
import { EventsBatch } from './types'
import dayjs from 'dayjs'
import erc721Transfer from './inputs/erc721-transfer.json'
import erc1155TransferSingle from './inputs/erc1155-transfer-single.json'
import erc1155TransferBatch from './inputs/erc1155-transfer-batch.json'
import seaportV15OrderFilled from './inputs/seaport-v1.5-order-filled.json'
import seaportV15OrderMatched from './inputs/seaport-v1.5-order-matched.json'

const formatLog = (item: any) => {
  return {
    blockTimestamp: dayjs(item.block_timestamp).valueOf(),
    blockNumber: item.block_number,
    blockHash: item.block_hash,
    transactionIndex: item.transaction_index,
    address: item.address,
    data: item.data,
    topics: JSON.parse(item.topics.replaceAll("'", '"')),
    transactionHash: item.transaction_hash,
    logIndex: item.log_index,
  }
}

const batch: EventsBatch = {
  id: dayjs().valueOf() + '',
  events: [
    {
      kind: 'erc721',
      data: erc721Transfer.map((item) => ({
        subKind: 'erc721-transfer',
        log: formatLog(item),
      })),
    },
    {
      kind: 'erc1155',
      data: erc1155TransferSingle.map((item) => ({
        subKind: 'erc1155-transfer-single',
        log: formatLog(item),
      })),
    },
    {
      kind: 'erc1155',
      data: erc1155TransferBatch.map((item) => ({
        subKind: 'erc1155-transfer-batch',
        log: formatLog(item),
      })),
    },
    {
      kind: 'seaport-v1.5',
      data: seaportV15OrderFilled.map((item) => ({
        subKind: 'seaport-v1.5-order-filled',
        log: formatLog(item),
      })),
    },
    {
      kind: 'seaport-v1.5',
      data: seaportV15OrderMatched.map((item) => ({
        subKind: 'seaport-v1.5-order-matched',
        log: formatLog(item),
      })),
    },
  ],
}

processEventsBatch(batch)
