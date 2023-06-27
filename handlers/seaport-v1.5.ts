import { getEventData } from '../events'
import { EventLog } from '../types'
import dayjs from 'dayjs'
import fs from 'fs'
import { deriveBasicSale } from '../utils/deriveBasicSale'
import { getRoyaltyRate } from '../utils/getRoyaltyRate'

const res: any = []

export const handleEvents = async (events: EventLog[]) => {
  let i = 0
  for (const { subKind, log } of events) {
    const eventData = getEventData(subKind)

    switch (subKind) {
      case 'seaport-v1.5-order-filled': {
        const parsedLog = eventData.abi.parseLog(log)
        const orderId = parsedLog.args['orderHash'].toLowerCase()
        const maker = parsedLog.args['offerer'].toLowerCase()
        let taker = parsedLog.args['recipient'].toLowerCase()
        const offer = parsedLog.args['offer']
        const consideration = parsedLog.args['consideration']

        const saleInfo = deriveBasicSale(offer, consideration)
        if (saleInfo) {
          const amount = Number(saleInfo.price) / 1e18
          const royaltyRate = await getRoyaltyRate(
            saleInfo.contract,
            saleInfo.tokenId
          )

          res.push({
            transaction_hash: log.transactionHash,
            log_index: log.logIndex + '',
            internal_index: '0',
            block_timestamp: log.blockTimestamp + '',
            block_date: dayjs(log.blockTimestamp).format('YYYY-MM-DD'),
            block_number: log.blockNumber + '',
            chain: 'Ethereum',
            marketplace_contract_address: log.address,
            marketplaceSlug: 'opensea',
            collection_contract_address: saleInfo.contract,
            number_of_nft_token_id: saleInfo.amount,
            nft_token_id: saleInfo.tokenId,
            amount: amount + '',
            amountCurrencyContractAddress: saleInfo.paymentToken,
            buyer_address: saleInfo.side === 'buy' ? maker : taker,
            seller_address: saleInfo.side === 'buy' ? taker : maker,
            royalty_rate: royaltyRate + '',
            royalty_amount: amount * royaltyRate + '',
            platformFeeRate: '0.005',
            platformFeeAmount: amount * 0.005 + '',
            // ethAmount: null,
            // value: null,
            // royaltyValue: null,
            // valueCurrency: null,
            // platformFeesValue: null,
            // collectionSlug: null,
            // amountCurrency: null,
            // tradeType: null,
          })
        }
        break
      }
    }
  }
  i++

  fs.writeFileSync(
    process.cwd() + '/outputs/seaport-transaction.json',
    JSON.stringify(res, null, 2)
  )
}
