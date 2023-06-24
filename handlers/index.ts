import { EventKind, EventLog, EventsBatch } from '../types'
import * as erc721 from './erc721'
import * as erc1155 from './erc1155'
import * as seaportV15 from './seaport-v1.5'

export const eventKindToHandler = new Map<
  EventKind,
  (e: EventLog[]) => Promise<void>
>([
  ['erc721', (e) => erc721.handleEvents(e)],
  ['erc1155', (e) => erc1155.handleEvents(e)],
  ['seaport-v1.5', (e) => seaportV15.handleEvents(e)],
])

export const processEventsBatch = async (batch: EventsBatch) => {
  await Promise.all(
    batch.events.map(async (events) => {
      const handler = eventKindToHandler.get(events.kind)!
      await handler(events.data)
    })
  )
}
