import path from 'node:path'
import { NodeClickHouseClient } from '@clickhouse/client/dist/client'
import { ClickhouseState } from '@sqd-pipes/core'
import { ensureTables } from '../db/clickhouse'
import { IndexerFunction, PipeConfig } from '../main'
import { SolanaMetaplexStream } from '../streams/metaplex'
import { logger } from '../utils'

export const metaplexIndexer: IndexerFunction = async (
  portalUrl: string,
  clickhouse: NodeClickHouseClient,
  config: PipeConfig,
) => {
  const ds = new SolanaMetaplexStream({
    portal: `${portalUrl}/datasets/solana-mainnet`,
    blockRange: {
      from: config.fromBlock,
      to: config.toBlock,
    },
    state: new ClickhouseState(clickhouse, {
      table: 'solana_sync_status',
      id: 'metaplex_metadata',
    }),
    logger,
  })

  await ensureTables(clickhouse, path.join(__dirname, '../db/sql/metaplex.sql'))

  for await (const mints of await ds.stream()) {
    await clickhouse.insert({
      table: 'solana_metaplex_tokens',
      format: 'JSONEachRow',
      values: mints.map((m) => ({
        account: m.account,
        mint: m.mint,
        name: m.name,
        symbol: m.symbol,
        uri: m.uri,
        is_mutable: m.isMutable,
        block_number: m.block.number,
        transaction_hash: m.transaction.hash,
        timestamp: m.block.timestamp,
      })),
    })

    await ds.ack()
  }
}
