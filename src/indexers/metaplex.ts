import path from 'node:path';
import { ClickhouseState } from '@sqd-pipes/core';
import { createClickhouseClient, ensureTables } from "../db/clickhouse";
import { SolanaMetaplexStream } from '../streams/metaplex';
import { logger } from '../utils';

export async function metaplexIndexer() {
  const clickhouse = createClickhouseClient()

  const ds = new SolanaMetaplexStream({
    portal: process.env.PORTAL_URL || 'https://portal.sqd.dev/datasets/solana-beta',
    blockRange: {
      from: process.env.METAPLEX_FROM_BLOCK || 332557468,
      to: process.env.METAPLEX_TO_BLOCK,
    },
    state: new ClickhouseState(clickhouse, {
      table: 'solana_sync_status',
      id: 'metaplex_metadata',
    }),
    logger
  });

  await ensureTables(clickhouse, path.join(__dirname, '../db/sql/metaplex.sql'));

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
    });

    await ds.ack();
  }
}
