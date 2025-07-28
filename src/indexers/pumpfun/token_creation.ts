import path from 'node:path'
import { NodeClickHouseClient } from '@clickhouse/client/dist/client'
import { ClickhouseState } from '@sqd-pipes/core'
import { IndexerFunction, PipeConfig } from 'src/main'
import { ensureTables } from '../../db/clickhouse'
import { SolanaPumpfunTokensStream } from '../../streams/pumpfun/token_creation'
import { logger } from '../../utils/logger'

export const pumpfunTokenCreationIndexer: IndexerFunction = async (
  portalUrl: string,
  clickhouse: NodeClickHouseClient,
  config: PipeConfig,
) => {
  const ds = new SolanaPumpfunTokensStream({
    portal: `${portalUrl}/datasets/solana-mainnet`,
    blockRange: {
      from: config.fromBlock,
      to: config.toBlock,
    },
    state: new ClickhouseState(clickhouse, {
      table: 'solana_sync_status',
      id: 'solana_pumpfun_token_creation',
    }),
    logger,
  })

  await ensureTables(clickhouse, path.join(__dirname, '../../db/sql/pumpfun_token_creation.sql'))

  for await (const tokens of await ds.stream()) {
    await clickhouse.insert({
      table: 'solana_pumpfun_tokens',
      format: 'JSONEachRow',
      values: tokens.map((t) => ({
        name: t.name,
        symbol: t.symbol,
        address: t.address,
        metadata_uri: t.uri,
        creation_time: t.deployTime,
      })),
    })

    await ds.ack()
  }
}
