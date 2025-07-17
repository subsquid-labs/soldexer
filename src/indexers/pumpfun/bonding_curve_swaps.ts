import path from 'node:path'
import { NodeClickHouseClient } from '@clickhouse/client/dist/client'
import { ClickhouseState } from '@sqd-pipes/core'
import { IndexerFunction, PipeConfig } from 'src/main'
import { ensureTables } from '../../db/clickhouse'
import { PumpfunBuysAndSellsStream } from '../../streams/pumpfun/bonding_curve_swaps'
import { logger } from '../../utils/logger'

export const pumpfunBondingCurveSwapsIndexer: IndexerFunction = async (
  portalUrl: string,
  clickhouse: NodeClickHouseClient,
  config: PipeConfig,
) => {
  const ds = new PumpfunBuysAndSellsStream({
    portal: `${portalUrl}/datasets/solana-mainnet`,
    blockRange: {
      from: config.fromBlock,
      to: config.toBlock,
    },
    state: new ClickhouseState(clickhouse, {
      table: 'solana_sync_status',
      id: 'solana_pumpfun_bonding_curve_swaps',
    }),
    logger,
  })

  await ensureTables(clickhouse, path.join(__dirname, '../../db/sql/pumpfun_bonding_curve_swaps.sql'))

  for await (const tokens of await ds.stream()) {
    await clickhouse.insert({
      table: 'solana_pumpfun_bonding_curve_swaps',
      format: 'JSONEachRow',
      values: tokens.map((t) => ({
        timestamp: t.timestamp,
        event_type: t.type,
        base_token: t.baseToken.mint,
        base_token_decimals: t.baseToken.decimals,
        quote_token: t.quoteToken.mint,
        quote_token_decimals: t.quoteToken.decimals,
        user: t.account,
        raw_token_price: Number(t.tokenPrice),
        block_number: t.block.number,
        block_hash: t.block.hash,
        transaction_index: t.transaction.index,
        transaction_hash: t.transaction.hash,
        sign: 1,
      })),
    })

    await ds.ack()
  }
}
