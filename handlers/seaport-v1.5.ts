import { getEventData } from '../events'
import { EventLog } from '../types'
import dayjs from 'dayjs'
import fs from 'fs'

export const handleEvents = async (events: EventLog[]) => {
  const res = []

  for (const { subKind, log } of events) {
    const eventData = getEventData(subKind)
    const parsedLog = eventData.abi.parseLog(log)

    switch (subKind) {
      case 'seaport-v1.5-order-filled': {
        const buyerAddress = parsedLog.args['offerer'].toLowerCase()
        const sellerAddress = parsedLog.args['recipient'].toLowerCase()
        const offer = parsedLog.args['offer']
        const consideration = parsedLog.args['consideration']
        const amount = offer[0].amount.toString() / 1e18
        const platformFeeAmount = consideration[1]?.amount.toString() / 1e18

        res.push({
          chain: 'Ethereum',
          numberOfNftTokenId: consideration[0].amount.toString(),
          nftTokenId: consideration[0].identifier.toString(),
          // royaltyRate: null,
          amount,
          // ethAmount: null,
          // royaltyAmount: null,
          // value: null,
          internalIndex: 0,
          // royaltyValue: null,
          // valueCurrency: null,
          blockTimestamp: log.blockTimestamp,
          platformFeeRate: Number((platformFeeAmount / amount).toFixed(3)),
          platformFeeAmount,
          transactionHash: log.transactionHash,
          logIndex: log.logIndex,
          // platformFeesValue: null,
          blockDate: dayjs(log.blockTimestamp).format('YYYY-MM-DD'),
          blockNumber: log.blockNumber,
          marketplaceContractAddress: log.address,
          collectionContractAddress: consideration[0].token.toLowerCase(),
          // collectionSlug: null,
          marketplaceSlug: 'opensea',
          // amountCurrency: null,
          amountCurrencyContractAddress: offer[0].token.toLowerCase(),
          buyerAddress,
          sellerAddress,
          // tradeType: null,
        })
        break
      }
    }
  }

  fs.writeFileSync(
    process.cwd() + '/outputs/seaport-transaction.json',
    JSON.stringify(res, null, 2)
  )
}
