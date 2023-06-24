import { getEventData } from '../events'
import { EventLog } from '../types'
import dayjs from 'dayjs'
import fs from 'fs'

export const handleEvents = async (events: EventLog[]) => {
  const res = []

  for (const { subKind, log } of events) {
    const eventData = getEventData(subKind)
    const parsedLog = eventData.abi.parseLog(log)
    const nftTokenId = parsedLog.args['tokenId'].toString()
    const fromAddress = parsedLog.args['from'].toLowerCase()
    const toAddress = parsedLog.args['to'].toLowerCase()
    const transferType =
      fromAddress === '0x0000000000000000000000000000000000000000'
        ? 'mint'
        : toAddress === '0x0000000000000000000000000000000000000000'
        ? 'burn'
        : 'transfer'

    switch (subKind) {
      case 'erc721-transfer': {
        res.push({
          blockTimestamp: log.blockTimestamp,
          blockDate: dayjs(log.blockTimestamp).format('YYYY-MM-DD'),
          amountRaw: '1',
          collectionContractAddress: log.address,
          chain: 'Ethereum',
          transactionHash: log.transactionHash,
          logIndex: log.logIndex,
          nftTokenId,
          blockNumber: log.blockNumber,
          fromAddress,
          toAddress,
          internalIndex: 0,
          transferType,
        })
        break
      }
    }
  }

  fs.writeFileSync(
    process.cwd() + '/outputs/erc721-transfer.json',
    JSON.stringify(res, null, 2)
  )
}
