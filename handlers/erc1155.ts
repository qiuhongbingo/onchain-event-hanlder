import { getEventData } from '../events'
import { EventLog } from '../types'
import dayjs from 'dayjs'
import fs from 'fs'

const res: any = []

export const handleEvents = async (events: EventLog[]) => {
  for (const { subKind, log } of events) {
    const eventData = getEventData(subKind)
    const parsedLog = eventData.abi.parseLog(log)
    const fromAddress = parsedLog.args['from'].toLowerCase()
    const toAddress = parsedLog.args['to'].toLowerCase()
    const transferType =
      fromAddress === '0x0000000000000000000000000000000000000000'
        ? 'mint'
        : toAddress === '0x0000000000000000000000000000000000000000'
        ? 'burn'
        : 'transfer'

    switch (subKind) {
      case 'erc1155-transfer-single': {
        const nftTokenId = parsedLog.args['tokenId']
        const amountRaw = parsedLog.args['amount']

        res.push({
          transaction_hash: log.transactionHash,
          log_index: log.logIndex + '',
          internal_index: '0',
          block_timestamp: log.blockTimestamp + '',
          block_date: dayjs(log.blockTimestamp).format('YYYY-MM-DD'),
          block_number: log.blockNumber + '',
          chain: 'Ethereum',
          collection_contract_address: log.address,
          nft_token_id: nftTokenId + '',
          amount_raw: amountRaw,
          from_address: fromAddress,
          to_address: toAddress,
          transfer_type: transferType,
        })
        break
      }
      case 'erc1155-transfer-batch': {
        const nftTokenIds = parsedLog.args['tokenIds']
        const amountRaws = parsedLog.args['amounts']

        const count = Math.min(nftTokenIds.length, amountRaws.length)
        for (let i = 0; i < count; i++) {
          res.push({
            transaction_hash: log.transactionHash,
            log_index: log.logIndex + '',
            internal_index: '0',
            block_timestamp: log.blockTimestamp + '',
            block_date: dayjs(log.blockTimestamp).format('YYYY-MM-DD'),
            block_number: log.blockNumber + '',
            chain: 'Ethereum',
            collection_contract_address: log.address,
            nft_token_id: nftTokenIds[i] + '',
            amount_raw: amountRaws[i] + '',
            from_address: fromAddress,
            to_address: toAddress,
            transfer_type: transferType,
          })
        }
        break
      }
    }
  }

  fs.writeFileSync(
    process.cwd() + '/outputs/erc1155-transfer.json',
    JSON.stringify(res, null, 2)
  )
}
